import React, { FC, ReactNode, useState } from 'react'
import { useRouter } from 'next/router'

import { useForm } from 'react-hook-form'

import { useData } from '../../hooks/useData'
import { ModalDelete, NavBar } from '../ui'

import { ICategory } from '../../interfaces'


interface FormData {
    name: string
}

interface Props {
    children: ReactNode
    category: ICategory
}

export const LayoutCategory:FC<Props> = ({ children, category }) => {

    const [showForm, setShowForm] = useState<boolean>(false)
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false)

    const [loadingDelete, setLoadingDelete] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)


    const router = useRouter()
    const { asPath } = router

    const { updateCategory, deleteCategory } = useData()
    

    const { register, handleSubmit, formState:{ errors }, setValue, setFocus,  } = useForm<FormData>()


    const cancelForm = () => {
        setShowForm(false)
        setValue('name', '')
    }

    const onShowForm = () => {

        if(showForm){
            setShowForm(false)
            setValue('name', '')
            return
        }
        
        
        setValue('name', category.name)
        setShowForm(true)
        setTimeout(() => {
            setFocus("name", { shouldSelect: true })
        }, 100);
            
    }




    const onEdith = async({ name }:FormData) => {

        setLoadingUpdate(true)

        const newCategory = {
            ...category,
            name
        }

        const { hasError, message } = await updateCategory(newCategory)
        
        if( hasError ){
            setLoadingUpdate(false)
            return
        }

        cancelForm()
        setLoadingUpdate(false)

        if(asPath.includes('grupos')) {
            router.replace(`/${message}/grupos`)
        } else {
            router.replace(`/${message}`)
        }
    
    }


    // TODO:
    const onDelete = async( method: () => Promise<{ confirm: boolean }> ) => {

        const { confirm } = await method()

        if(!confirm){
            setShowDeleteModal(false)
            console.log('Cancelado...');
            return
        }
        setLoadingDelete(true)
        const { hasError } = await deleteCategory(category._id!)
        if( hasError ){ return }
        router.replace('/')
    }


    return (
        <>
            <ModalDelete
                toShow={showDeleteModal} 
                processing={loadingDelete}
                title={'Eliminar esta categoría'} 
                subtitle={`¿Desde eliminar la categoría ${ category.name }?`} 
                onResult={onDelete}
            />
            <NavBar />
            <main>
                <div className='flex items-center gap-4 group mb-5'>
                    {
                        !showForm 
                            ? (
                                <h1 className='text-3xl font-bold text-sky-500'>
                                    {category.name}
                                </h1>
                            ):(
                                <form onSubmit={ handleSubmit( onEdith ) } className="flex">
                                    {
                                        loadingUpdate && (
                                            <div className='inline-flex items-center font-semibold leading-6 text-sm rounded-md text-sky-800 transition ease-in-out duration-150 cursor-not-allowed'>
                                                <svg className="animate-spin -ml-1 mr-1 h-5 w-5 text-sky-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                                            </div>
                                        )
                                    }
                                    <input
                                        type="text"
                                        disabled={loadingUpdate}
                                        placeholder='Nombre de la categoría'
                                        onKeyUp={({ code })=> code === 'Escape' ? cancelForm() : undefined}
                                        className={`w-full bg-sky-50 border-b-2 border-b-slate-300 px-2 py-1 outline-none disabled:opacity-50 ${ !!errors.name ? 'hover:border-b-red-600 focus:border-b-red-600' : 'hover:border-b-sky-800 focus:border-b-sky-800 ' } transition-all`}
                                        { ...register('name', {
                                            required: 'Este campo es requerido',
                                        })}
                                    />
                                </form>
                            )
                    }
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={()=>setShowDeleteModal(true)}
                            className="items-center text-red-600 hover:text-white bg-red-100 hover:bg-red-500 font-bold text-sm py-2 px-2 rounded-md hidden group-hover:flex">
                                <i className='bx bx-trash'></i>
                        </button>
                        <button
                            onClick={ onShowForm}
                            className="items-center text-sky-600 hover:text-white bg-sky-100 hover:bg-sky-500 font-bold text-sm py-2 px-2 rounded-md hidden group-hover:flex">
                               <i className='bx bx-edit-alt' ></i>
                        </button>
                    </div>
                </div>
                {
                    children
                }
            </main>
            
        </>
    )
}
