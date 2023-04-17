
import type { NextApiRequest, NextApiResponse } from 'next'

import { isValidObjectId } from 'mongoose';
import * as jose from 'jose'


import { db } from '../../../database';

import { IGroup } from '../../../interfaces/IGroup';
import { Category, Group } from '../../../models';


type Data = 
    | { message: string }
    | IGroup[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            
            return toggleActiveGroups( req, res )
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }


}


const toggleActiveGroups = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {
    
    const { idCategory = '', activate = true } = req.body

    if( !isValidObjectId(idCategory) ){
        return res.status(400).json({ message: 'El ID de la categoría NO es válido' })
    }

    try {

        await db.connect()

        const category =  await Category.findById(idCategory)
        if(!category){
            await db.disconnect()
            return res.status(400).json({ message: 'Categoría no encontrada' }) 
        }

        // Verificar usuario
        const isUserValid = await verifyUser(req, category.user)
        if(!isUserValid){
            await db.disconnect()
            return res.status(401).json({ message: 'Not authorized' }) 
        }
                
        await Group.updateMany({ category: idCategory }, { active: activate })
        
        return res.status(200).json({ message: 'OK' })

        
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