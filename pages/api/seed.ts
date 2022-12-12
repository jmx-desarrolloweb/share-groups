// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../database'
import { User } from '../../models'
// import bcryptjs from 'bcryptjs'
import Group from '../../models/Group';

type Data = 
    | { message: string }

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data> ) {
    
    if( process.env.NODE_ENV === 'production' ){
        return res.status(401).json({ message: 'No tiene acceso a este servicio' })
    }

    await db.connect()

    // await Group.updateMany({}, { active: true })
    
    await db.disconnect()


    return res.status(200).json({ message: 'Proceso realizado correctamente' })
}
