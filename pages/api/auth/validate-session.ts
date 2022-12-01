import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import { jwt } from '../../../utils'


type Data = 
    | { message: string }
    | {
        token: string
        user: {
            email: string
        }
      }


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {

        case 'GET':
            return checkJWT(req, res)

        default:
            return res.status(400).json({ message: 'Endpoint no existe' })
    }
}


const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { share_groups_session_ef32f43613d682c33c56fae2d4ba528a = '' } = req.cookies

    let userId = ''

    try {

        userId = await jwt.isValidToken( share_groups_session_ef32f43613d682c33c56fae2d4ba528a )

    } catch (error) {
        return res.status(401).json({ message: 'Token de autorización no valido' })
    }

    await db.connect()
    const user = await User.findById(userId).lean()
    await db.disconnect()
    
    if (!user) {
        return res.status(400).json({ message: 'No existe ningun usuario con ese id' })
    }

    const token = jwt.signToken( user._id, user.email ) //jwt

    return res.status(200).json({
        token,
        user: {
            email: user.email
        }
    })

}