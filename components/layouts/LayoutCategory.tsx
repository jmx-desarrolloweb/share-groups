import React, { FC, ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ICategory } from '../../interfaces'
import { NavBar } from '../ui'


interface FormData {
    name: string
}

interface Props {
    children: ReactNode
    category: ICategory
}

export const LayoutCategory:FC<Props> = ({ children, category }) => {

    const [showForm, setShowForm] = useState<boolean>(false)

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
        // TODO:
        console.log('Editando...', name);
        
    }

    const onDelete = () => {
        // TODO:
        console.log('Eliminando...', category._id);
    }


    return (
        <>
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
                                <form onSubmit={ handleSubmit( onEdith ) }>
                                    <input
                                        type="text"
                                        placeholder='Nombre de la categoría'
                                        onKeyUp={({ code })=> code === 'Escape' ? cancelForm() : undefined}
                                        className={`w-full bg-sky-50 border-b-2 border-b-slate-300 px-2 py-1 outline-none ${ !!errors.name ? 'hover:border-b-red-600 focus:border-b-red-600' : 'hover:border-b-sky-800 focus:border-b-sky-800 ' } transition-all`}
                                        { ...register('name', {
                                            required: 'Este campo es requerido',
                                        })}
                                    />
                                </form>
                            )
                    }
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={onDelete}
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
