import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'

export const NavBar:FC = () => {
    
    const router = useRouter()
    const { query, asPath } = router    
        
    return (
        <div className='flex w-full justify-between mb-7'>
            <nav>
                <ul className='ml-12 flex gap-16'>
                    <li>
                        <NextLink 
                            href={`/${query.slug}`} 
                            className={`font-semibold text-sky-800 px-2 pb-1 border-b-2 ${`/${query.slug}` === asPath ? 'border-sky-500' : 'border-transparent'}`}
                        >
                            Páginas
                        </NextLink>
                    </li>
                    <li>
                        <NextLink 
                            href={`/${query.slug}/grupos`} 
                            className={`font-semibold text-sky-800 px-2 pb-1 border-b-2 ${`/${query.slug}/grupos` === asPath ? 'border-sky-500' : 'border-transparent'}`}
                        >
                            Grupos
                        </NextLink>
                    </li>
                </ul>
            </nav>
            <button className='font-semibold text-sm rounded-md py-2 px-8 bg-sky-600 text-white hover:shadow-lg hover:bg-sky-700 transition-transform flex items-center justify-center gap-1'>
            <i className='bx bx-refresh text-lg' ></i> Reasignar
            </button>
        </div>
    )
}
