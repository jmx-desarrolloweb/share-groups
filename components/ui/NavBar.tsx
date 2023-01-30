import { FC, useState } from 'react'

import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { useData } from '../../hooks/useData'
import { useUI } from '../../hooks/useUI'
import { ModalConfirm } from './ModalConfirm'

import { ICategory } from '../../interfaces'

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
    const { toggleSideMenu } = useUI()


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

    const handleResetRandom = async(random: boolean) => {

        if(random){
            setLoadingReset(true)
        }else{
            setLoadingResetAll(true)
        }

        await resetGroupsOfPages( category._id!, random )
        
        if(random){
            setLoadingReset(false)
        }else{
            setLoadingResetAll(false)
        }

    }

        
    return (
        <>
            <div className='sticky top-0 flex items-center w-full bg-white z-[1] py-3 px-5 shadow'>
                <div className='flex-1 flex items-center'>
                    <button
                        onClick={ ()=> toggleSideMenu() } 
                        className='text-2xl px-1 mt-1 rounded text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 hover:shadow-lg active:scale-95 block sm:hidden'
                    >
                        <i className='bx bx-menu'></i>
                    </button>
                    <nav className='sm:mr-10'>
                        <ul className='ml-5 sm:ml-12 flex gap-5 sm:gap-14'>
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
                </div>
                <div className='flex items-stretch gap-2'>
                    <button
                        disabled={ loadingResetAll || loadingReset }
                        onClick={ ()=> handleResetRandom( true ) } 
                        className='font-semibold text-sm rounded-md px-3 sm:py-2 sm:px-6 bg-gradient-to-r from-indigo-700 to-blue-700 enabled:hover:from-indigo-800 enabled:hover:to-blue-800 text-white hover:shadow-lg transition-transform flex items-center justify-center gap-1 disabled:opacity-50 disabled:shadow-none'
                    >
                        {
                            loadingReset
                                ?(
                                <svg className="animate-spin h-5 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4">
                                    </circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                ):(
                                    <i className='bx bx-refresh text-xl sm:text-2xl' ></i>
                                )
                        }
                    </button>
                    <button
                        onClick={ ()=> handleResetRandom( false ) }
                        disabled={ loadingResetAll || loadingReset } 
                        className='group text-sm rounded-md px-2 sm:py-2 sm:px-6 border-2 sm:border-[3px] border-indigo-600 hover:shadow-lg transition-transform flex items-center justify-center gap-1 disabled:opacity-50 disabled:shadow-none'
                    >
                        {
                            loadingResetAll
                                ?(
                                <svg className="animate-spin h-7 sm:h-8 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4">
                                    </circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                ):(
                                    <i className='bx bx-collection text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-700 group-hover:font-semibold group-disabled:group-hover:font-normal' ></i>
                                )
                        }
                    </button>
                </div>
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
