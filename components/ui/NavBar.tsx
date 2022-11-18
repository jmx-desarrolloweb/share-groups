import NextLink from 'next/link'
import { useRouter } from 'next/router'



export const NavBar = () => {
    
    const router = useRouter()
    const { pathname } = router    

    return (
        <div className='flex w-full justify-between mb-7'>
            <nav>
                <ul className='ml-12 flex gap-16'>
                    <li>
                        <NextLink 
                            href={'/'} 
                            className={`font-semibold text-sky-800 px-2 pb-1 border-b-2 ${pathname === '/' ? 'border-sky-500' : 'border-transparent'}`}
                        >
                            Páginas
                        </NextLink>
                    </li>
                    <li>
                        <NextLink 
                            href={'/grupos'} 
                            className={`font-semibold text-sky-800 px-2 pb-1 border-b-2 ${pathname === '/grupos' ? 'border-sky-500' : 'border-transparent'}`}
                        >
                            Grupos
                        </NextLink>
                    </li>
                </ul>
            </nav>
            <button className='font-semibold text-sm rounded-md py-2 px-8 bg-sky-600 text-white hover:shadow-lg hover:bg-sky-700 transition-transform flex items-center justify-center gap-1'>
            <i className='bx bx-refresh text-lg' ></i> Generar
            </button>
        </div>
    )
}
