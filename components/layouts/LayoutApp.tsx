import Head from "next/head"
import { FC, ReactNode } from "react"
import { SiderBar } from '../ui';
import { NavBar } from '../ui/NavBar';


interface Props {
    children: ReactNode
}

export const LayoutApp: FC<Props> = ({ children }) => {
    return (
        <>
            <Head>
                <title>JMX - Share Groups</title>
                <meta name="description" content="Aplicación para la asignación de grupos a páginas" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex">
                <SiderBar />
                <div className="px-5 pt-10 flex-1 flex flex-col">
                    {children}
                    <footer>
                        <p>Footer</p>
                    </footer>
                </div>

            </div>

        </>
    )
}
