import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose'
import slugify from 'slugify'
import * as jose from 'jose'

import { Category, Group } from '../../../models'
import { db } from '../../../database'
import { IGroup } from '../../../interfaces'

import { v2 as cloudinary } from 'cloudinary'
cloudinary.config( process.env.CLOUDINARY_URL || '' )



type Data = 
    | { message: string }
    | IGroup[]
    | IGroup


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {

        case 'GET':
            return getGroups( req, res )  

        case 'POST':
            return addNewGroup( req, res )
        
        case 'PUT':
            return updateGroup( req, res )

        case 'DELETE':
            return deleteGroup( req, res )

        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}


const getGroups = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { category=null } = req.query

    if( !isValidObjectId(category) ){
        return res.status(400).json({ message: 'El ID de la categoría NO es válido' })
    }

    try {

        await db.connect()
        const actualCategory = await Category.findById(category)

        if(!actualCategory){
            await db.disconnect()
            return res.status(400).json({ message: 'Categoría no encontrada' })
        }

        // Verificar usuario
        const isUserValid = await verifyUser(req, actualCategory.user)

        if(!isUserValid){
            await db.disconnect()
            return res.status(401).json({ message: 'Not authorized' }) 
        }
        

        const groups = await Group.find({ category }).lean()
        await db.disconnect()

        return res.status(200).json(groups)
        
    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

    
}


const addNewGroup = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { name='', url='', img=null, category=null, section=null, active=true  } = req.body

    if( !isValidObjectId(category) ){
        return res.status(400).json({ message: 'El ID de la categoría NO es valido' })
    }

    if([ name.trim(), url.trim() ].includes('')){                
        return res.status(400).json({ message: 'Las propiedades nombre, url son requeridas' })
    }

    try {

        await db.connect()
        const actualCategory = await Category.findById(category)

        if(!actualCategory){
            await db.disconnect()
            return res.status(400).json({ message: 'Categoría no encontrada' })
        }

        // Verificar usuario
        const isUserValid = await verifyUser(req, actualCategory.user)

        if(!isUserValid){
            await db.disconnect()
            return res.status(401).json({ message: 'Not authorized' }) 
        }

        const slug = slugify(name, { replacement: '-', lower: true })

        let groupSection = undefined

        if(isValidObjectId(section)){
            groupSection = section
        }

        const newGroup = new Group({
            name,
            url, 
            slug, 
            img,
            category,
            section: groupSection,
            active
        })        

        await newGroup.save()
        await db.disconnect()

        return res.status(201).json(newGroup)
        
    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })

    }

}

const updateGroup = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id='', img=null, name='', url='', section=null, active=true } = req.body

    if(!isValidObjectId(_id)){
        return res.status(400).json({ message: 'El ID del grupo NO es valido' })
    }

    try {

        await db.connect()

        const groupUpdate = await Group.findById(_id)
        if( !groupUpdate ){
            await db.disconnect()
            return res.status(400).json({ message: 'Grupo no encontrado' }) 
        }

        const actualCategory = await Category.findById( groupUpdate.category )
        if(!actualCategory){
            await db.disconnect()
            return res.status(400).json({ message: ' Categoría del grupo no encontrada' })
        }

        const isUserValid = await verifyUser(req, actualCategory.user)

        if(!isUserValid){
            await db.disconnect()
            return res.status(401).json({ message: 'Not authorized' }) 
        }

        if( groupUpdate.img && groupUpdate.img !== img  ){
            const [ fileId, extencion ] = (groupUpdate.img).substring( (groupUpdate.img).lastIndexOf('/') + 1 ).split('.')
            await cloudinary.uploader.destroy( `${process.env.CLOUDINARY_FOLDER}/${fileId}` )
        }

        const slug = slugify(name, { replacement: '-', lower: true })

        if(!isValidObjectId(section)){
            groupUpdate.section= undefined
        }else {
            groupUpdate.section= section
        }

        groupUpdate.name   = name
        groupUpdate.slug   = slug
        groupUpdate.url    = url
        groupUpdate.img    = img
        groupUpdate.active = active

        await groupUpdate.save()
        await db.disconnect()
        
        return res.status(200).json(groupUpdate)
        
    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }
    
}


const deleteGroup = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id } = req.body

    if(!isValidObjectId(_id)){
        return res.status(400).json({ message: 'El ID del grupo NO es valido' })
    }

    try {
        
        await db.connect()

        const group = await Group.findById(_id)
        if( !group ){
            await db.disconnect()
            return res.status(400).json({ message: 'Grupo no encontrado' }) 
        }

        const actualCategory = await Category.findById( group.category )
        if(!actualCategory){
            await db.disconnect()
            return res.status(400).json({ message: ' Categoría del grupo no encontrada' })
        }

        // Verificar usuario
        const isUserValid = await verifyUser(req, actualCategory.user)

        if(!isUserValid){
            await db.disconnect()
            return res.status(401).json({ message: 'Not authorized' }) 
        }

        if( group.img ){
            const [ fileId, extencion ] = (group.img).substring( (group.img).lastIndexOf('/') + 1 ).split('.')
            await cloudinary.uploader.destroy( `${process.env.CLOUDINARY_FOLDER}/${fileId}` )
        }

        await group.deleteOne()
        await db.disconnect()

        return res.status(200).json({ message: _id })

    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

}



const verifyUser = async( req: NextApiRequest, idCategory:string ):Promise<boolean> => {

    // 2.- verificar que el idUsuario de la sesion coincida con el usuario de la categoria
    const { 'share_groups_session_ef32f43613d682c33c56fae2d4ba528a':token } = req.cookies
    const { payload } = await jose.jwtVerify(String( token ), new TextEncoder().encode(process.env.JWT_SECRET_SEED))

    if(payload._id === JSON.parse( JSON.stringify( idCategory ) )){
        return true
    }

    return false
}

