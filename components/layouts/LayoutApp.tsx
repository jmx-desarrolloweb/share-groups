import Head from "next/head"
import { FC, ReactNode } from "react"
import { SiderBar } from '../ui';
import { useAuth } from '../../hooks/useAuth';


interface Props {
    children: ReactNode
}

export const LayoutApp: FC<Props> = ({ children }) => {

    const { isLoggedIn } = useAuth()

    if( !isLoggedIn ){
        return (
            <div className="h-screen w-full flex justify-center items-center">
                <span className="loader"></span>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>JMX - Share Groups</title>
                <meta name="description" content="Aplicación para la asignación de grupos a páginas" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex">
                
                <SiderBar />
                <div className="flex-1 flex flex-col">
                    {children}
                </div>

            </div>

        </>
    )
}
