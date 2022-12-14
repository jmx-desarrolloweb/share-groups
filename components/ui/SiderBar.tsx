import { useState } from 'react';

import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { useForm } from "react-hook-form"


import { useData } from '../../hooks/useData'
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';

interface FormData {
    name: string
}


export const SiderBar = () => {

    const [showForm, setShowForm] = useState<boolean>(false)
    const [showOptions, setShowOptions] = useState(false)
    const [loading, setLoading] = useState(false)


    const { register, handleSubmit, formState:{ errors }, setValue, setFocus,  } = useForm<FormData>()

    const router = useRouter()
    const { query } = router

    const { logout } = useAuth()
    const { categories, addNewCategory } = useData()
    const { toggleSideMenu } = useUI()


    const navigateTo = (url: string) => {
        router.push(url)
        toggleSideMenu()
    }

    const onShowForm = () => {
        setShowForm(true)
        setTimeout(() => {
            setFocus("name", { shouldSelect: true })
        }, 100);
    }

    const cancelForm = () => {
        setShowForm(false)
        setValue('name', '')
    }


    const onSubmitForm = async({ name }:FormData) => {
        
        setLoading(true)

        const { hasError, message }  = await addNewCategory(name)
        
        if( hasError ){ return }

        router.push(`/dashboard/${message}`)
        
        cancelForm()
        setLoading(false)
        toggleSideMenu()
    }


    return (
        <div className="h-screen sticky top-0 bg-white w-72 px-5 pt-5 shadow">
            <div className='flex justify-between items-center pb-5 mb-5'>
                <div 
                    className='relative'
                >
                    <button 
                        onClick={() => setShowOptions(!showOptions)}
                        className='hover:bg-slate-100 rounded active:scale-95 p-1'
                    >
                        <i className='bx bx-dots-vertical text-sky-800'></i>
                    </button>
                    {
                        showOptions &&
                        <div className="origin-top-right absolute left-2 mt-0 w-40 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none flex justify-center hover:bg-gray-100" role="menu">
                            <button
                                onClick={ logout } 
                                className="text-gray-700 flex items-center justify-center text-sm gap-1 px-2 py-2 hover:text-gray-900">
                                <i className='bx bx-log-out' ></i>
                                <span>Cerrar sesión</span>
                            </button>
                        </div>
                    }
                </div>
                <button 
                    onClick={ ()=> navigateTo('/') }
                    className="font-bold text-center text-blue-800 uppercase flex justify-center items-center gap-1">
                    <i className='bx bxs-layer text-lg'></i> Share Groups
                </button>
                <button
                    onClick={ ()=> toggleSideMenu() } 
                    className='text-2xl px-1 mt-1 rounded text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 hover:shadow-lg active:scale-95 block sm:hidden'
                >
                    <i className='bx bx-x'></i>
                </button>
                <div className='hidden sm:block'></div>
            </div>
            {
                !showForm
                    ?(
                        <button
                            onClick={onShowForm} 
                            className="w-full font-semibold text-sm rounded-md py-3 bg-gradient-to-r from-indigo-700 to-blue-600 text-white hover:shadow-lg hover:from-indigo-800 hover:to-blue-700 transition-transform flex items-center justify-center gap-1">
                            <i className='bx bx-plus text-lg'></i> Agregar categoria
                        </button>
                    ): (
                        <form onSubmit={ handleSubmit( onSubmitForm ) }>
                            <input
                                type="text"
                                disabled={loading}
                                placeholder='Nombre de la categoría'
                                onKeyUp={({ code })=> code === 'Escape' ? cancelForm() : undefined}
                                className={`w-full border-b border-b-slate-300 px-2 py-1 outline-none ${ !!errors.name ? 'hover:border-b-red-600 focus:border-b-red-600' : 'hover:border-b-blue-800 focus:border-b-blue-800 ' } transition-all`}
                                { ...register('name', {
                                    required: 'Este campo es requerido',
                                })}
                            />
                        </form>
                    )
            }

            <ul className='mt-10'>
                { categories.length > 0 &&
                    categories.map( category => (
                        <li key={category._id}>
                            <button 
                                className={`inline-block w-full py-3 px-3 rounded-md font-semibold hover:bg-blue-100 hover:text-sky-800 mb-1 text-left ${ query.slug === `${category.slug}` ? 'bg-blue-100 text-sky-800' : 'border-transparent'}`}
                                onClick={ ()=> navigateTo(`/dashboard/${category.slug}`) }>
                                { category.name }
                            </button>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}
