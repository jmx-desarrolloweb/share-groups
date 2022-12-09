import type { NextApiRequest, NextApiResponse } from 'next'
import bcryptjs from 'bcryptjs'

import { db } from '../../../database'
import { User } from '../../../models'
import { jwt } from '../../../utils'
import { IUser } from '../../../interfaces'



type Data = 
    | { message: string }
    | {
        token: string
        user: {
            name: string
            email: string
        }
      }


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {

        case 'POST':
            return loginUser( req, res )

        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}

const loginUser = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { username='', password='' } = req.body

    if ([username, password].includes('')) {
        return res.status(400).json({ message: 'El usuario y la contraseña son requeridos' })
    }

    await db.connect()
    const userByEmail = await User.findOne({ email:username })
    const userByName = await User.findOne({ name:username })
    await db.disconnect()


    if (!userByEmail && !userByName) {
        return res.status(400).json({ message: 'Usuario o Contaseña no válidos' })
    }
    
    const user = userByEmail ? userByEmail : userByName

    if(!user){
        return res.status(400).json({ message: 'Usuario o Contaseña no válidos' })
    }
    
    if( !(bcryptjs.compareSync( password, user.password )) ){
        return res.status(400).json({ message: 'Usuario o Contaseña no válidos' })
    }

    const token = jwt.signToken( user._id, user.email ) //jwt

    return res.status(200).json({
        token,
        user: {
            name: user.name,
            email: user.email
        }
    })
}