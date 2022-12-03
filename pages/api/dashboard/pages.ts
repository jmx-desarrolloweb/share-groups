

import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose'
import slugify from 'slugify'
import * as jose from 'jose'

import { db } from '../../../database'
import { IPage } from '../../../interfaces'
import { Category, Page } from '../../../models'

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


const verifyUser = async( req: NextApiRequest, idCategory:string ):Promise<boolean> => {

    // 2.- verificar que el idUsuario de la sesion coincida con el usuario de la categoria
    const { 'share_groups_session_ef32f43613d682c33c56fae2d4ba528a':token } = req.cookies
    const { payload } = await jose.jwtVerify(String( token ), new TextEncoder().encode(process.env.JWT_SECRET_SEED))
    
    
    if(payload._id === JSON.parse( JSON.stringify( idCategory ) )){
        return true
    }

    return false
}