import { useForm } from "react-hook-form"
import { ICategory, ISection } from "../../interfaces"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { Checkbox } from "../ui"
import { useData } from "../../hooks/useData"


interface Props {
    sectionEdit?: ISection
    category: ICategory
    setShowForm: Dispatch<SetStateAction<boolean>>
}

export const ModalFormSection: FC<Props> = ({ sectionEdit, category, setShowForm }) => {

    const [loading, setLoading] = useState(false)

    const { addNewSection, updateSection } = useData()

    const { register, handleSubmit, formState: { errors }, reset, getValues, setValue } = useForm<ISection>({
        defaultValues: {
            title: '',
            active: true
        }
    })

    useEffect(()=> {
        if(sectionEdit){
            reset({
                title: sectionEdit.title,
                active: sectionEdit.active
            })
        }
    },[sectionEdit])
    
    const onCancel = async () => {
        setShowForm(false)
    }

    const onSectionSubmit = async({ title, active }:ISection) => {

        setLoading(true)

        const newSection: ISection = {
            title,
            category,
            active
        }

        if( sectionEdit ){

            newSection._id = sectionEdit._id
            await updateSection( newSection )
            onCancel()
            
        }else {
            await addNewSection( newSection )
            onCancel()
        }

    }

    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <form
                            onSubmit={handleSubmit(onSectionSubmit)}
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg"
                        >
                            <div className="bg-white px-4 pt-5 pb-4 sm:px-6 sm:pt-2 sm:pb-4">
                                <header className="flex justify-center py-3 border-b mb-8">
                                    <h2 className="flex items-center text-2xl font-bold gap-1">
                                        <i className='bx bxs-detail text-[1.75rem]' ></i>
                                        {sectionEdit ? 'Editar sección' : 'Nueva sección'}
                                    </h2>
                                </header>
                                <div className="flex flex-col gap-1 mb-4 w-full">
                                    <label htmlFor="name" className="font-semibold">Título</label>
                                    <input
                                        type="text"
                                        id="title"
                                        placeholder="Título de la sección"
                                        {...register('title', {
                                            required: 'El título es requerido',
                                        })}
                                        className={`bg-admin rounded-md flex-1 border p-3 hover:border-slate-800 disabled:border-slate-200 ${!!errors.title ? 'outline-red-500 border-red-500' : ''}`}
                                        disabled={loading}
                                    />
                                    {
                                        !!errors.title &&
                                        <p className="text-sm text-red-600 ml-1">{errors.title.message}</p>
                                    }
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full justify-center items-center rounded-md border border-transparent bg-gradient-to-r from-indigo-700 to-blue-700 hover:from-indigo-800 hover:to-blue-800 px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:ml-3 sm:w-28 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                                    {
                                        loading
                                            ? (
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                                            )
                                            : 'Guardar'
                                    }
                                </button>
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={onCancel}
                                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                                    Cancelar
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
