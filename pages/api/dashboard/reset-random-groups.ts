import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Category, Page } from '../../../models';
import Group from '../../../models/Group';
import * as jose from 'jose'
import { IGroup, IPage } from '../../../interfaces';

type Data = 
    | { message: string }
    | IPage[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        
        case 'POST':
            return resetGroupsOfPages( req, res )
    
        default:
            return res.status(400).json({ message: 'Bad request' })
            
    }

}

const resetGroupsOfPages = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { idCategory = '', random = true } = req.body
    
    if( !isValidObjectId(idCategory) ){
        return res.status(400).json({ message: 'El ID de la categoría NO es válido' })
    }

    try {

        await db.connect()

        const category =  await Category.findById(idCategory)
        if(!category){
            return res.status(400).json({ message: 'Categoría no encontrada' }) 
        }

        // Verificar usuario
        const isUserValid = await verifyUser(req, category.user)
        if(!isUserValid){
            await db.disconnect()
            return res.status(401).json({ message: 'Not authorized' }) 
        }
        

        const pagesOfCategory = await Page.find({ category: idCategory })
        if(pagesOfCategory.length === 0){
            return res.status(400).json({ message: 'Hay páginas para asignar grupos' }) 
        }

        let groupsOfCategory = await Group.find({ category: idCategory, active: true }) 
        if(groupsOfCategory.length === 0){
            return res.status(400).json({ message: 'Hay grupos para asignar a las páginas' }) 
        }

        if(random) {
            // === === === RANDOM === === ===
            // 1.- Ordenar de forma aleatorioa los grupos
            let randomGroups:IGroup[] = []
            while (groupsOfCategory.length > 0) {
    
                const randomIndex = Math.floor( Math.random() * groupsOfCategory.length )
                randomGroups.push(groupsOfCategory[randomIndex])
                groupsOfCategory = groupsOfCategory.filter( ( g, index ) => index !== randomIndex )
    
            }                
    
            // 2.- Asignar grupos a las paginas
            const newPagesUpdate = pagesOfCategory.map( (page, index) => {
    
                const groupsPerPage = Math.ceil( randomGroups.length / (pagesOfCategory.length - index) )
                
                const newGroups = [...randomGroups.filter( ( r, index ) => index >= (randomGroups.length - groupsPerPage) )]
                page.groups = newGroups
                // Elimianr grupos del array
                randomGroups.length = randomGroups.length - groupsPerPage
                
                return page
            })
            
            // 3.- Guardar paginas a la DB
            for await (const page of newPagesUpdate) {
                await Page.findByIdAndUpdate( page._id, { groups: page.groups } )
            }
                
            await db.disconnect()
            return res.status(200).json(newPagesUpdate)

        } else {
            // === === === All === === ===
            const pagesUpdate = pagesOfCategory.map( page => {
                page.groups = groupsOfCategory
                return page
            })

            for await (const page of pagesUpdate) {
                await Page.findByIdAndUpdate( page._id, { groups: page.groups } )
            }

            await db.disconnect()
            return res.status(200).json(pagesUpdate)
        }

        
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