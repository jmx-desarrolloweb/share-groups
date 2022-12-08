import { FC, useState } from 'react'

import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { toast } from 'react-toastify'
import { ModalConfirm } from './ModalConfirm'
import { ICategory } from '../../interfaces'
import { useData } from '../../hooks/useData'

interface Props {
    category: ICategory
}

export const NavBar:FC<Props> = ({ category }) => {
    
    const [showModal, setShowModal] = useState(false)
    const [loadingReset, setLoadingReset] = useState(false)

    const router = useRouter()
    const { query, asPath } = router

    const { resetGroupsOfPages } = useData()


    const handleShowModal = () => {
        const body = document.querySelector<HTMLBodyElement >('body')
        body?.classList.add('fixed-body')
        setShowModal(true)
    }

    const handleHiddenModal = () => {
        const body = document.querySelector<HTMLBodyElement>('body')
        body?.classList.remove('fixed-body')
        setShowModal(false)
    }


    
    const handleRandom = async( method: () => Promise<{ confirm: boolean }> ) => {


        const { confirm } = await method()

        if( !confirm ){
            handleHiddenModal()
            return
        }

        setLoadingReset(true)
        
        const { hasError } = await resetGroupsOfPages( category._id! )

        setLoadingReset(false)
        
        if(hasError){ return }
        
        handleHiddenModal()
            
    }
        
    return (
        <>
            <div className='sticky top-0 flex items-center w-full bg-white z-[1] py-3 px-5 shadow'>
                <nav className='flex-1 mr-5'>
                    <ul className='ml-12 flex gap-16'>
                        <li>
                            <NextLink 
                                href={`/dashboard/${query.slug}`} 
                                className={`font-semibold text-sky-800 px-3 pb-1 border-b-2 ${`/dashboard/${query.slug}` === asPath ? 'border-blue-500' : 'border-transparent'}`}
                            >
                                Páginas
                            </NextLink>
                        </li>
                        <li>
                            <NextLink 
                                href={`/dashboard/${query.slug}/grupos`} 
                                className={`font-semibold text-sky-800 px-2 pb-1 border-b-2 ${`/dashboard/${query.slug}/grupos` === asPath ? 'border-blue-500' : 'border-transparent'}`}
                            >
                                Grupos
                            </NextLink>
                        </li>
                    </ul>
                </nav>
                <button
                    onClick={ handleShowModal } 
                    className='font-semibold text-sm rounded-md py-2 px-8 bg-gradient-to-r from-indigo-700 to-blue-700 over:from-indigo-800 hover:to-blue-800 text-white hover:shadow-lg transition-transform flex items-center justify-center gap-1'
                >
                    <i className='bx bx-refresh text-2xl' ></i>
                </button>
                {/* <button
                    onClick={ handleShowModal } 
                    className='group font-semibold text-sm rounded-md bg-gradient-to-r from-indigo-700 to-blue-700 p-1'
                >
                     <span className="flex items-center justify-center rounded-md bg-white py-1 px-8 group-hover:bg-gradient-to-r group-hover:from-indigo-700 group-hover:to-blue-700">
                        <i className='bx bx-refresh text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-blue-800 hover:text-white group-hover:text-white font-bold' ></i>
                     </span>
                </button> */}
            </div>
            <ModalConfirm 
                toShow={ showModal }
                processing={ loadingReset } 
                title={`¿Reasignar grupos de "${ category.name }"?`} 
                subtitle={'Se sobrescribirán los grupos asignados actualmente'} 
                onResult={ handleRandom }
            />
        </>
    )
}
