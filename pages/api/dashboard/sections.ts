import type { NextApiRequest, NextApiResponse } from 'next'

import { isValidObjectId } from 'mongoose'
import * as jose from 'jose'

import { db } from '../../../database'
import { Category, Section } from '../../../models'
import { ISection } from '../../../interfaces'


type Data = 
    | { message: string }
    | ISection[]
    | ISection


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {

        case 'GET':
            return getSections( req, res )
    
        case 'POST':
            return addNewSection( req, res )
    
        case 'PUT':
            return updateSection( req, res )
    
        case 'DELETE':
            return deleteSection( req, res )
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}


const getSections= async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { category=null } = req.query

    if( !isValidObjectId(category) ){
        return res.status(400).json({ message: 'El ID de la categoría NO es válido' })
    }

    try {
        
        await db.connect()
        const actualCategory = await Category.findById( category )

        if(!actualCategory){
            await db.disconnect()
            return res.status(400).json({ message: 'Categoría no encontrada' })
        }

        const isUserValid = await verifyUser(req, actualCategory.user)

        if(!isUserValid){
            await db.disconnect()
            return res.status(401).json({ message: 'Not authorized' }) 
        }

        const sections = await Section.find({ category })
                                .populate('category', 'name slug user')
                                .lean()
        await db.disconnect()

        return res.status(200).json(sections)

    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })

    }

}



const addNewSection = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { title='', category=null, active=true } = req.body

    if( !isValidObjectId(category._id) ){
        return res.status(400).json({ message: 'El ID de la categoría NO es valido' })
    }

    if( [ title.trim() ].includes('') ){
        return res.status(400).json({ message: 'El título de la sección es requerido' })
    }

    try {
        await db.connect()
        const actualCategory = await Category.findById(category._id)
        
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

        const newSection = new Section({
            title,
            category: category._id,
            active
        })

        await newSection.save()
        await db.disconnect()

        return res.status(201).json({
            ...JSON.parse( JSON.stringify(newSection) ), 
            category: actualCategory
        })

    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }


}



const updateSection = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { _id='' } = req.body

    if(!isValidObjectId(_id)){
        return res.status(400).json({ message: 'El ID del grupo NO es valido' })
    }

    try {
        
        await db.connect()

        const sectionUpdate = await Section.findById(_id)
        if( !sectionUpdate ){
            await db.disconnect()
            return res.status(400).json({ message: 'Sección no encontrado' })
        }

        const actualCategory = await Category.findById( sectionUpdate.category )
        if(!actualCategory){
            await db.disconnect()
            return res.status(400).json({ message: 'Categoría de sección no encontrada' })
        }

        const isUserValid = await verifyUser( req, actualCategory.user )

        if(!isUserValid){
            await db.disconnect()
            return res.status(401).json({ message: 'Not authorized' }) 
        }

        const {
            title = sectionUpdate.title,
            active = sectionUpdate.active
        } = req.body

        sectionUpdate.title = title
        sectionUpdate.active = active

        await sectionUpdate.save()
        await db.disconnect()

        return res.status(200).json({
            ...JSON.parse( JSON.stringify( sectionUpdate )),
            category: actualCategory,
        })

    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })

    }

}



const deleteSection = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id='' } = req.body
    
    if(!isValidObjectId(_id)){
        return res.status(400).json({ message: 'El ID del grupo NO es valido' })
    }

    try {
     
        await db.connect()
        
        const section = await Section.findById( _id )
        if( !section ){
            await db.disconnect()
            return res.status(400).json({ message: 'Sección no encontrada' })
        }

        const actualCategory = await Category.findById( section.category )
        if(!actualCategory){
            await db.disconnect()
            return res.status(400).json({ message: ' Categoría de la sección no encontrada' })
        }

        const isUserValid = await verifyUser(req, actualCategory.user)

        if(!isUserValid){
            await db.disconnect()
            return res.status(401).json({ message: 'Not authorized' }) 
        }

        await section.deleteOne()
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

