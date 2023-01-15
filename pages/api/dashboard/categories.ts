import type { NextApiRequest, NextApiResponse } from 'next'

import slugify from "slugify"
import * as jose from 'jose'

import { db } from '../../../database'
import { ICategory } from '../../../interfaces'
import { Category, Group, Page } from '../../../models'
import { isValidObjectId } from 'mongoose'

import { v2 as cloudinary } from 'cloudinary'
cloudinary.config( process.env.CLOUDINARY_URL || '' )


type Data = 
    | { message: string }
    | ICategory[]
    | ICategory



export default function (req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {

        case 'GET':
            return getCategories( req, res )

        case 'POST':
            return addNewCategory( req, res )
        
        case 'PUT':
            return updateCategory( req, res )
        
        case 'DELETE':
            return deleteCategory( req, res )
        
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }

    
}

const getCategories = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { 'share_groups_session_ef32f43613d682c33c56fae2d4ba528a':token } = req.cookies
    const { payload } = await jose.jwtVerify(String( token ) , new TextEncoder().encode(process.env.JWT_SECRET_SEED))
        

    try {
        await db.connect()
        const categories = await Category.find({ user: payload._id }).sort({ createdAt: 'desc' }).lean()
        await db.disconnect()
        
        return res.status(200).json(categories)

    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

}

const addNewCategory = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { name = '' } = req.body

    if( name.trim() === '' ){
        return res.status(400).json({ message: 'El nombre de la categoría es necesaria' })
    }

    const slug = slugify(name, { replacement: '-', lower: true })

    const { 'share_groups_session_ef32f43613d682c33c56fae2d4ba528a':token } = req.cookies
    const { payload } = await jose.jwtVerify(String( token ) , new TextEncoder().encode(process.env.JWT_SECRET_SEED))

    
    const newCategory = new Category({ name, slug, user: payload._id })
    
    try {
        await db.connect()
        await newCategory.save()
        await db.disconnect()    
        return res.status(201).json(newCategory)
    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }    
}

const updateCategory = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { name='', _id='' } = req.body

    if( name === '' ){
        return res.status(400).json({ message: 'La propiedad nombre es necesaria' })
    } 
    
    if( !isValidObjectId(_id) ){
        return res.status(400).json({ message: 'El ID de la categoría NO es válido' })
    }

    try {
        await db.connect()
        const categoryUpdate = await Category.findById( _id )

        if(!categoryUpdate){
            await db.disconnect()
            return res.status(400).json({ message: 'Categoría no encontrada' })
        }

        // Verificar usuario
        const isUserValid = await verifyUser(req, categoryUpdate.user)

        if(!isUserValid){
            await db.disconnect()
            return res.status(401).json({ message: 'Not authorized' }) 
        }

        const slug = slugify(name, { replacement: '-', lower: true })
    
        categoryUpdate.name = name
        categoryUpdate.slug = slug
        await categoryUpdate.save()
        await db.disconnect()

        return res.status(200).json(categoryUpdate)
        
    } catch (error) {

        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }
}

const deleteCategory = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { _id='' } = req.body
    
    if( !isValidObjectId(_id) ){
        return res.status(400).json({ message: 'El ID de la categoría NO es valido' })
    }

    try {

        await db.connect()
        const categoryDelete =  await Category.findById(_id)
        
        if(!categoryDelete){
            return res.status(400).json({ message: 'Categoría no encontrada' }) 
        }
        
        // Verificar usuario
        const isUserValid = await verifyUser(req, categoryDelete.user)

        if(!isUserValid){
            await db.disconnect()
            return res.status(401).json({ message: 'Not authorized' }) 
        }

        
        const pages = await Page.find({ category: _id })
        const groups = await Group.find({ category: _id })
        
        const pageImages = pages.map( p => {
            if(p.img){
                const [ fileId, extencion ] = p.img.substring( p.img.lastIndexOf('/') + 1 ).split('.')
                return `${process.env.CLOUDINARY_FOLDER}/${fileId}`
            }
        }).filter( image => image )
        
        const groupImage = groups.map( g => {
            if(g.img){
                const [ fileId, extencion ] = g.img.substring( g.img.lastIndexOf('/') + 1 ).split('.')   
                return `${process.env.CLOUDINARY_FOLDER}/${fileId}`
            }
        }).filter( imageId => imageId )

        
        const idsImages = [ ...pageImages, ...groupImage ]


        if(idsImages.length >= 0){
            idsImages.forEach( async(img) => {
                await cloudinary.uploader.destroy( img! )
            })
        }
        
        await Promise.all([
            await Page.deleteMany({ category: _id  }),
            await Group.deleteMany({ category: _id  }),
            await categoryDelete.deleteOne()
        ])

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
    
    if(payload._id === JSON.parse( JSON.stringify( idCategory) ) ){
        return true
    }

    return false
}