import { FC, SetStateAction, useState } from "react"

import NextImage from 'next/image'

import { IGroup } from "../../interfaces"
import { ModalDelete } from "../ui"
import { useData } from '../../hooks/useData';
import { ModalFormGroup } from './ModalFormGroup';


interface Props {
    group: IGroup
    categoryId: string
}

export const CardGroup:FC<Props> = ({ group, categoryId }) => {


    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showFormEdit, setShowFormEdit] = useState(false)

    const [loadingDelete, setLoadingDelete] = useState(false)

    const { deleteGroup } = useData()


    const handleShowModalDelete = () => {
        const body = document.querySelector<HTMLBodyElement >('body')
        body?.classList.add('fixed-body')
        setShowDeleteModal(true)
    }

    const handleHiddenModalDelete = () => {
        const body = document.querySelector<HTMLBodyElement>('body')
        body?.classList.remove('fixed-body')
        setShowDeleteModal(false)
    }

    const onDelete = async( method: () => Promise<{ confirm: boolean }> ) => {

        const { confirm } = await method()
            
        if(!confirm){
            handleHiddenModalDelete()
            return
        }

        setLoadingDelete(true)
        
        const { hasError } = await deleteGroup( group._id! )
        
        if( hasError ){ 
            return setLoadingDelete(false)
        }

        handleHiddenModalDelete()
    }



    return (
        <>
            <li className="flex w-full justify-between items-center bg-white px-3 py-2 rounded border mb-2">
                <div className="flex items-center gap-4">
                    <a href={group.url} target="_blank" rel="noreferrer">
                        {group.img
                            ? (
                                <NextImage
                                    priority
                                    width={48}
                                    height={48}
                                    src={group.img}
                                    alt={group.name}
                                    className='rounded-full shadow border'
                                />
                            ) : (
                                <div className="w-[48px] h-[48px] shadow bg-slate-200 rounded-full flex justify-center items-center">
                                    <span className="font-bold text-xl uppercase">{group.name.slice(0, 1)}</span>
                                </div>
                            )
                        }
                    </a>
                    <a 
                        href={group.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-slate-800 hover:underline"
                    >
                        { group.name }
                    </a>
                </div>
                <div className='flex gap-2'>
                    <button
                        onClick={()=>setShowFormEdit(true)}
                        className="items-center text-sky-600 hover:text-white bg-sky-100 hover:bg-sky-500 font-bold text-sm py-2 px-3 rounded-md"
                    >
                        <i className='bx bx-edit-alt' ></i>
                    </button>
                    <button
                        onClick={handleShowModalDelete}
                        className="items-center text-red-600 hover:text-white bg-red-100 hover:bg-red-500 font-bold text-sm py-2 px-3 rounded-md"
                    >
                        <i className='bx bx-trash'></i>
                    </button>
                </div>
            </li>
            <ModalDelete
                toShow={showDeleteModal} 
                processing={loadingDelete}
                title={'Eliminar grupo'} 
                subtitle={`¿ Desde eliminar el grupo "${ group.name }" ?`} 
                onResult={onDelete}
            />
            {
                showFormEdit && (
                    <ModalFormGroup
                        groupEdit={ group } 
                        categoryId={ categoryId } 
                        setShowForm={ setShowFormEdit }
                    />
                )
            }
        </>
    )
}
