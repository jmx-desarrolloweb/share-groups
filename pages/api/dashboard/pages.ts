

import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose'
import slugify from 'slugify'
import * as jose from 'jose'

import { db } from '../../../database'
import { IPage } from '../../../interfaces'
import { Category, Page } from '../../../models'

import { v2 as cloudinary } from 'cloudinary'
cloudinary.config( process.env.CLOUDINARY_URL || '' )



type Data = 
    | { message: string }
    | IPage[]
    | IPage

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {

        case 'GET':
            return getPages( req, res )
            
        case 'POST':
            return addNewPage( req, res )

        case 'PUT':
            return updatePage( req, res )
        
        case 'DELETE':
            return deletePage( req, res )
            
        
            
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}

const getPages = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { category=null } = req.query
    
    if( !isValidObjectId(category) ){
        return res.status(400).json({ message: 'El ID de la categoría NO es valido' })
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
        
        const pages = await Page.find({ category }).lean()
        await db.disconnect()

        return res.status(200).json(pages)

    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })

    }
}


const addNewPage = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { name='', url='', img=null, category=null  } = req.body
    
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

        const newPage = new Page({
            name,
            slug,
            url,
            img,
            category,
            groups: [],
        })
        
        await newPage.save()
        await db.disconnect()
        
        return res.status(200).json(newPage)
        
    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

}


const updatePage = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { _id='', img='', name='', url='', groups=[] } = req.body

    if( !isValidObjectId( _id ) ){
        return res.status(400).json({ message: 'El ID de la página NO es valido' })
    }

    try {
        await db.connect()

        const pageUpdate = await Page.findById(_id)
        if( !pageUpdate ){
            await db.disconnect()
            return res.status(400).json({ message: 'Página no encontrada' }) 
        }

        const actualCategory = await Category.findById( pageUpdate.category )
        if(!actualCategory){
            await db.disconnect()
            return res.status(400).json({ message: ' Categoría de la página no encontrada' })
        }

        const isUserValid = await verifyUser(req, actualCategory.user)
        if(!isUserValid){
            await db.disconnect()
            return res.status(401).json({ message: 'Not authorized' }) 
        }

        if( pageUpdate.img && pageUpdate.img !== img ){
            const [ fileId, extencion ] = (pageUpdate.img).substring( (pageUpdate.img).lastIndexOf('/') + 1 ).split('.')
            await cloudinary.uploader.destroy( `${process.env.CLOUDINARY_FOLDER}/${fileId}` )
        }

        const slug = slugify(name, { replacement: '-', lower: true })

        pageUpdate.name = name
        pageUpdate.slug = slug
        pageUpdate.url = url
        pageUpdate.img = img
        pageUpdate.groups = groups

        await pageUpdate.save()
        await db.disconnect()

        return res.status(200).json(pageUpdate)
        
    } catch (error) {

        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }
    
}


const deletePage = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id } = req.body

    if( !isValidObjectId( _id ) ){
        return res.status(400).json({ message: 'El ID de la página NO es valido' })
    }
    
    try {
        await db.connect()

        const pageDelete = await Page.findById(_id)
        if( !pageDelete ){
            await db.disconnect()
            return res.status(400).json({ message: 'Página no encontrada' }) 
        }

        const actualCategory = await Category.findById( pageDelete.category )
        if(!actualCategory){
            await db.disconnect()
            return res.status(400).json({ message: ' Categoría de la página no encontrada' })
        }

        // Verificar usuario
        const isUserValid = await verifyUser(req, actualCategory.user)

        if(!isUserValid){
            await db.disconnect()
            return res.status(401).json({ message: 'Not authorized' }) 
        }

        if( pageDelete.img ){
            const [ fileId, extencion ] = (pageDelete.img).substring( (pageDelete.img).lastIndexOf('/') + 1 ).split('.')
            await cloudinary.uploader.destroy( `${process.env.CLOUDINARY_FOLDER}/${fileId}` )
        }

        await pageDelete.deleteOne()
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


