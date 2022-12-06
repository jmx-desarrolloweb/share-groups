import { FC } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'


import { toast } from 'react-toastify'


export const NavBar:FC = () => {
    
    const router = useRouter()
    const { query, asPath } = router
    
    const showNotify = () => {
        // TODO: 
        console.log(toast.success('Hola'));
        
        
        toast.error('Formato no válido', {
            autoClose: 1000
        })
    }
        
    return (
        <div className='flex items-end w-full mb-7'>
            <nav className='flex-1 mr-5'>
                <ul className='ml-12 flex gap-16'>
                    <li>
                        <NextLink 
                            href={`/dashboard/${query.slug}`} 
                            className={`font-semibold text-sky-800 px-2 pb-1 border-b-2 ${`/dashboard/${query.slug}` === asPath ? 'border-sky-500' : 'border-transparent'}`}
                        >
                            Páginas
                        </NextLink>
                    </li>
                    <li>
                        <NextLink 
                            href={`/dashboard/${query.slug}/grupos`} 
                            className={`font-semibold text-sky-800 px-2 pb-1 border-b-2 ${`/dashboard/${query.slug}/grupos` === asPath ? 'border-sky-500' : 'border-transparent'}`}
                        >
                            Grupos
                        </NextLink>
                    </li>
                </ul>
            </nav>
            <button
                onClick={showNotify} 
                className='font-semibold text-sm rounded-md py-3 px-8 bg-gradient-to-r from-indigo-500 to-blue-500 over:from-indigo-600 hover:to-blue-600 text-white hover:shadow-lg hover:bg-sky-700 transition-transform flex items-center justify-center gap-1'
            >
                <i className='bx bx-refresh text-lg' ></i> Reasignar
            </button>
        </div>
    )
}
