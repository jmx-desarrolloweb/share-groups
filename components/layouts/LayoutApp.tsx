import Head from "next/head"
import { FC, ReactNode } from 'react';
import { SiderBar } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from "../../hooks/useUI";


interface Props {
    children: ReactNode
}

export const LayoutApp: FC<Props> = ({ children }) => {

    const { isLoggedIn } = useAuth()
    const { isSideMenuOpen } = useUI()



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
                <title>Share Groups</title>
                <meta name="description" content="Aplicación para la asignación de grupos a páginas" />
                <link rel="icon" href="/favicon_jmx.png" />
            </Head>
            <div className="flex relative">
                <div className={`${isSideMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform absolute top-0 bottom-0 shadow-2xl min-h-ful z-10 sm:translate-x-0 sm:sticky sm:shadow-none`}>
                    <SiderBar />
                </div>
                <div className="flex-1 flex flex-col">
                    {children}
                </div>

            </div>

        </>
    )
}
