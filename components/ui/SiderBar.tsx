import { useState } from 'react';

import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { useForm } from "react-hook-form"


import { useData } from '../../hooks/useData'

interface FormData {
    name: string
}


export const SiderBar = () => {

    const [showForm, setShowForm] = useState<boolean>(false)

    const { register, handleSubmit, formState:{ errors }, setValue, setFocus,  } = useForm<FormData>()

    const router = useRouter()
    const { query } = router
    const { categories, addNewCategory } = useData()


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
      
        const { hasError, message }  = await addNewCategory(name)
        
        if( hasError ){ return }

        router.push(`/${message}`)
        
        cancelForm()
    }

    return (
        <div className="h-screen bg-white w-72 px-5 pt-5">
            <NextLink 
                href={'/'}
                className="font-bold py-5 text-center text-sky-800 uppercase mb-5 flex justify-center items-center gap-1">
                <i className='bx bxs-layer text-lg'></i> Share Groups
            </NextLink>
            {
                !showForm
                    ?(
                        <button
                            onClick={onShowForm} 
                            className="w-full font-semibold text-sm rounded-md py-2 bg-indigo-600 text-white hover:shadow-lg hover:bg-indigo-700 transition-transform flex items-center justify-center gap-1">
                            <i className='bx bx-plus text-lg'></i> Agregar categoria
                        </button>
                    ): (
                        <form onSubmit={ handleSubmit( onSubmitForm ) }>
                            <input
                                type="text"
                                placeholder='Nombre de la categoría'
                                onKeyUp={({ code })=> code === 'Escape' ? cancelForm() : undefined}
                                className={`w-full border-b border-b-slate-300 px-2 py-1 outline-none ${ !!errors.name ? 'hover:border-b-red-600 focus:border-b-red-600' : 'hover:border-b-sky-800 focus:border-b-sky-800 ' } transition-all`}
                                { ...register('name', {
                                    required: 'Este campo es requerido',
                                })}
                            />
                        </form>
                    )
            }

            <ul className='mt-10'>
                {
                    categories.map( category => (
                        <li key={category._id}>
                            <NextLink 
                                className={`inline-block w-full py-3 px-3 rounded-md font-semibold hover:bg-sky-100 hover:text-sky-800 mb-1 ${ query.slug === `${category.slug}` ? 'bg-sky-100 text-sky-800' : 'border-transparent'}`}
                                href={`/${category.slug}`}>
                                { category.name }
                            </NextLink>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}
