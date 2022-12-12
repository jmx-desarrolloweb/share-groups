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
    const [loadingResetAll, setLoadingResetAll] = useState(false)

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


    
    const handleRandom = async( method: () => Promise<{ confirm: boolean, random?: boolean }> ) => {


        const { confirm, random } = await method()

        if( !confirm ){
            handleHiddenModal()
            return
        }

        if(random){
            setLoadingReset(true)
        }else{
            setLoadingResetAll(true)
        }

        
        const { hasError } = await resetGroupsOfPages( category._id!, random )


        if(random){
            setLoadingReset(false)
        }else{
            setLoadingResetAll(false)
        }
        
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
                    className='font-semibold text-sm rounded-md py-2 px-8 bg-gradient-to-r from-indigo-700 to-blue-700 hover:from-indigo-800 hover:to-blue-800 text-white hover:shadow-lg transition-transform flex items-center justify-center gap-1'
                >
                    <i className='bx bx-refresh text-2xl' ></i>
                </button>
            </div>
            <ModalConfirm 
                toShow={ showModal }
                processing={ loadingReset } 
                processingAll={ loadingResetAll } 
                title={`¿Reasignar grupos de "${ category.name }"?`} 
                subtitle={'Se sobrescribirán los grupos asignados actualmente'} 
                onResult={ handleRandom }
            />
        </>
    )
}
