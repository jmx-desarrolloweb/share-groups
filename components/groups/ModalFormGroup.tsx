import { Dispatch, FC, SetStateAction, useEffect, useRef, useState, useMemo, ChangeEvent } from 'react';
import Image from "next/image";

import { toast } from 'react-toastify'
import { useForm } from "react-hook-form";

import { IPage } from '../../interfaces/IPage';

import profilePic from '../../public/img/facebook-page.jpg'
import axios from 'axios';
import { IGroup, ISection } from "../../interfaces";
import { useData } from "../../hooks/useData";
import { Checkbox } from "../ui";


const imageMimeType = /image\/(png|jpg|jpeg|gif|webp)/i;


interface Props {
    groupEdit?: IGroup
    categoryId: string
    setShowForm: Dispatch<SetStateAction<boolean>>

    processing?: boolean
}

export const ModalFormGroup: FC<Props> = ({ groupEdit, categoryId, setShowForm }) => {

    // file of images
    const [file, setFile] = useState(null)
    const [fileDataURL, setFileDataURL] = useState(null)
    const [imageEdit, setImageEdit] = useState<string>()

    const [loading, setLoading] = useState(false)

    const { addNewGroup, updateGroup, sections } = useData()

    const fileInputRef = useRef<any>(null)

    const { register, handleSubmit, formState:{ errors }, reset, getValues, setValue } = useForm<IGroup>({
        defaultValues: {
            name:'',
            url: '',
            section: '',
            active: true
        }
    })

    useEffect(()=>{
        if(groupEdit){
            reset({
                name: groupEdit.name,
                url: groupEdit.url,
                section: groupEdit.section ?  groupEdit.section : '',
                active: groupEdit.active,
            })
            setImageEdit(groupEdit.img)
        }
    },[groupEdit])
    

    const sectionsByCategory = useMemo(()=> {
        return sections.filter( section => section.category?._id === categoryId )

    },[sections])


    const handleFileChange = (e:any) => {
        if( !e.target.files || e.target.files.length === 0 ){
            return
        }

        const fileSelected = e.target.files[0]

        if (!fileSelected.type.match(imageMimeType)) {
            toast.error('Formato no válido', {
                theme: "colored",
                autoClose: 1000
            })
            return
        }
        setFile(fileSelected)
    }


    useEffect(() => {
        let fileReader:any;
        let isCancel: boolean = false;

        if (file) {
            fileReader = new FileReader()
            fileReader.onload = (e:any) => {
                const { result } = e.target
                if (result && !isCancel) {
                    setFile(file)
                    setFileDataURL(result)
                }
            }
            fileReader.readAsDataURL(file)
        }

        return () => {
            isCancel = true
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort()
            }
        }
    }, [file])
  

    const deleteImage = async() => {
        setFile(null)
        setFileDataURL(null)
        setImageEdit(undefined)
    }

    const updateImage = async(): Promise<string | undefined> => {
        if( !file ){ return }
        
        const formData = new FormData()
        formData.append('file', file)

        try {
            const { data } = await axios.post<{ message: string }>('/api/dashboard/images', formData)
            return data.message
       
        } catch (error) {
            setLoading(false)
            console.log('Hubo un error', error);
        }
    }

    const onChangeSection = async( { target }:ChangeEvent<HTMLSelectElement> ) => {

        setValue('section', target.value as string, { shouldValidate: true } )
    }

    const toggleGroupActive = () => {
        setValue('active', !getValues('active') ,{ shouldValidate: true })
    }

    const onCancel = async() => {
        setShowForm(false)
    }

    const onPageSubmit = async({ name, url, section, active }:IGroup) => {
        setLoading(true)
        
        const newGroup:IGroup = {
            name,
            url: url.trim(),
            category: categoryId,
            img: imageEdit,
            section,
            active
        }

        if(file){
            const imgUrl = await updateImage()
            newGroup.img = imgUrl
        }
        
        if (groupEdit){
            
            newGroup._id = groupEdit._id
            await updateGroup(newGroup)
            onCancel()

        } else {

            await addNewGroup(newGroup)
            onCancel()

        }
                
    }
    


    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <form
                        onSubmit={ handleSubmit(onPageSubmit) }
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg"
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:px-6 sm:pt-2 sm:pb-4">
                            <header className="flex justify-center py-3 border-b mb-8">
                                <h2 className="flex items-center text-2xl font-bold gap-1">
                                    <i className='bx bxs-user-circle text-3xl' ></i>
                                    { groupEdit ? 'Editar grupo' : 'Nuevo grupo'}
                                </h2>
                            </header>
                            {
                                fileDataURL || imageEdit
                                    ? (
                                        <div className="relative group mb-5 flex justify-center w-52 h-52 shadow mx-auto">
                                            <Image
                                                priority
                                                fill
                                                sizes="(max-width: 208px) 208px"
                                                src={ fileDataURL || imageEdit || profilePic}
                                                alt={'Nombre de pagina'}
                                                className='rounded-full cover p-3' 
                                            />
                                            <button
                                                onClick={deleteImage}
                                                type="button"
                                                disabled={loading} 
                                                className="absolute -top-3 -right-3 shadow text-white bg-red-500 rounded-full w-8 h-8 hover:bg-red-600 active:scale-95 hover:shadow-2xl hidden group-hover:block disabled:opacity-0">
                                                <i className='bx bx-trash'></i>
                                            </button>
                                        </div>

                                    ):(
                                        <div
                                            onClick={()=> fileInputRef.current?.click()} 
                                            className={`group mx-auto border-dashed border-2 py-10 flex justify-center mb-5 rounded ${loading ? '' : 'hover:border-slate-800 hover:cursor-pointer'}`}>
                                            <i className={`bx bxs-image-add text-4xl text-slate-800 opacity-50 ${ loading ? '' : 'group-hover:opacity-100' }`}></i>
                                        </div>
                                    )
                            }
                            <div className="flex flex-col gap-1 mb-4 w-full">
                                <label htmlFor="name" className="font-semibold">Nombre</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Nombre del grupo"
                                    {...register('name', {
                                            required: 'El nombre es requerido',
                                    })}
                                    className={`bg-admin rounded-md flex-1 border p-3 hover:border-slate-800 disabled:border-slate-200 ${ !!errors.name ? 'outline-red-500 border-red-500' :'' }`}
                                    disabled={loading}
                                />
                                {
                                    !!errors.name &&
                                    <p className="text-sm text-red-600 ml-1">{errors.name.message}</p>
                                }
                            </div>
                            <div className="flex flex-col gap-1 mb-4 w-full">
                                <label htmlFor="section" className="font-semibold">Sección</label>
                                <select 
                                    name="section" 
                                    id="section"
                                    value={getValues('section')!}
                                    onChange={onChangeSection}
                                    className={`bg-admin rounded-md flex-1 border p-3 hover:border-slate-800 disabled:border-slate-200 ${ !!errors.section ? 'outline-red-500 border-red-500' :'' }`}
                                >
                                    <option value="">Sin sección</option>
                                    {
                                        sectionsByCategory.map( section => (
                                            <option 
                                                key={section._id} 
                                                value={ section._id }
                                            >
                                                { section.title }
                                            </option>
                                        ))
                                    }
                                    
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 mb-4 w-full">
                                <label htmlFor="url" className="font-semibold">URL</label>
                                <input
                                    type="text"
                                    id="url"
                                    placeholder="https://www.facebook.com/groups/grupo"
                                    {...register('url', {
                                        required: 'El url es requerido',
                                        validate: ( value ) => !value.includes('https://') || value.trim().includes(' ') ? 'La url no es válida' : undefined,
                                    })}
                                    className={`bg-admin rounded-md flex-1 border p-3 hover:border-slate-800 disabled:border-slate-200 ${ !!errors.url ? 'outline-red-500 border-red-500' :'' }`}
                                    disabled={loading}
                                />
                                {
                                    !!errors.url &&
                                    <p className="text-sm text-red-600 mt-2">{errors.url.message}</p>
                                }
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <Checkbox 
                                    value={ getValues('active')! } 
                                    onCheckChange={toggleGroupActive} 
                                    label={'Activo'}
                                    disabled={loading}
                                />
                            </div>
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                disabled={loading}
                                ref={ fileInputRef }
                                accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                                onChange={handleFileChange}
                            />
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
    )
}
