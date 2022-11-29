import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../../database'

import formidable from 'formidable'

import { v2 as cloudinary } from 'cloudinary'
cloudinary.config( process.env.CLOUDINARY_URL || '' )


// yarn add formidable
// yarn add -D  @types/formidable
type Data = {
    message: string
}

export const config = {
    api: {
        bodyParser: false,
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {

        case 'POST':
            return uploadImage( req, res )
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}




const saveFile = async( file: formidable.File ):Promise<string> => {

    const { secure_url } = await cloudinary.uploader.upload( file.filepath, { folder: process.env.CLOUDINARY_FOLDER  } )
    return secure_url
}

const parseFiles =  async( req: NextApiRequest ):Promise<string> => {
    
    return new Promise(( resolve, reject ) => {
        
        const form = new formidable.IncomingForm()
        
        form.parse( req, async( err, fields, files )=>{
            
            if( err ) { return reject(err) }

            const filePath = await saveFile( files.file as formidable.File ) 

            resolve(filePath)
        })

    })
}

const uploadImage = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    
    try {
        
        const urlImage = await parseFiles( req )
        
        return res.status(201).json({ message: urlImage })

    } catch (error) {

        console.log(error);
        await db.disconnect()
        return res.status(500).json({ message: 'Hubo un error inesperado, revisar la consola del servidor' })

    }
}
