
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import * as jose from 'jose';



export async function middleware( req: NextRequest ) {

    const cookieAuthKey = 'share_groups_session_ef32f43613d682c33c56fae2d4ba528a'    

    const token = req.cookies.get(cookieAuthKey)
    const { protocol, host } = req.nextUrl 


    // ===== ===== ===== API ===== ===== =====

    if (req.nextUrl.pathname.startsWith('/api/dashboard')) {

        if (!token) {            
            return NextResponse.redirect(new URL('/api/unauthorized', req.url))
        }

        try {
            
            await jose.jwtVerify( String(token.value ), new TextEncoder().encode(process.env.JWT_SECRET_SEED))


            return NextResponse.next()

        } catch (error) {
            return NextResponse.redirect(new URL('/api/unauthorized', req.url))
        }
    }

    // ===== ===== ===== Frontend ===== ===== =====


    if (req.nextUrl.pathname.startsWith('/dashboard')) {


        if (!token) {            
            return NextResponse.redirect(`${protocol}//${host}/`)
        }
    
        try {
            
            await jose.jwtVerify( String(token.value ), new TextEncoder().encode(process.env.JWT_SECRET_SEED))
            return NextResponse.next()
    
        } catch (error) {
    
            console.log(error)
            return NextResponse.redirect(`${protocol}//${host}/`)
        }
    }


    if (req.nextUrl.pathname.startsWith('/')) {

        if (!token) {            
             return NextResponse.next()
        }
        
        try {
            
            await jose.jwtVerify( String(token.value), new TextEncoder().encode(process.env.JWT_SECRET_SEED))
            return NextResponse.redirect(`${protocol}//${host}/dashboard`)
            
        } catch (error) {

            return NextResponse.next()
        }
    }




}


export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/api/dashboard/:path*',
    ]
}