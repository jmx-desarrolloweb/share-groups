import type { NextApiRequest, NextApiResponse } from 'next'

import slugify from "slugify"

import { db } from '../../../database'
import { ICategory } from '../../../interfaces'
import { Category } from '../../../models'

type Data = 
    | { message: string }
    | ICategory[]
    | ICategory



const listGroups:ICategory[] = [
    {
        _id: '1231',
        name: 'Fredy',
        slug: 'fredy',
    },
    {
        _id: '1232',
        name: 'Tlapa Gro.',
        slug: 'tlapa-gro',
    },
    {
        _id: '1233',
        name: 'Guerrero',
        slug: 'guerrero',
    },
] 

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
            return res.status(400).json({ message: 'Endpoint no encontrado' })
    }

    
}

const getCategories = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    try {
        await db.connect()
        const categories = await Category.find().lean()
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
    
    const newCategory = new Category({ name, slug })
    
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
    
    const { name='', _id } = req.body

    if( name === '' ){
        return res.status(400).json({ message: 'La propiedad nombre es necesaria' })
    } 
    
    if( !_id ){
        return res.status(400).json({ message: 'La propiedad ID es necesaria' })
    }

    await db.connect()
    const categoryUpdate = await Category.findById( _id )

    if(!categoryUpdate){
        return res.status(400).json({ message: 'Categoría no encontrada' })
    }

    const slug = slugify(name, { replacement: '-', lower: true })

    
    try {
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
    const { _id } = req.body
    
    if(!_id){
        return res.status(400).json({message: 'La propiedad ID es necesaria'})
    }

    await db.connect()
    const categoryDelete =  await Category.findById(_id)
    
    if(!categoryDelete){
        return res.status(400).json({ message: 'Categoría no encontrada' }) 
    }

    try {
        
        await categoryDelete.deleteOne()
        await db.disconnect()

        return res.status(200).json({ message: _id })

    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

}

