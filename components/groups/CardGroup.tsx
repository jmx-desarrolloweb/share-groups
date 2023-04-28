import { FC, SetStateAction, useState, useEffect } from 'react';

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

    const [activeGroup, setActiveGroup] = useState<boolean>(group.active)

    const { deleteGroup, updateGroup } = useData()


    useEffect(()=>{
        setActiveGroup(group.active)
    },[group])


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

    const toggleActive = async() => {

        const beforeStateGroup = { ...group }
        setActiveGroup(!beforeStateGroup.active)
        
        const { hasError } = await updateGroup( { ...group, active: !beforeStateGroup.active} )
        
        if(hasError ){
            setActiveGroup(beforeStateGroup.active)
        }

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
                    <div className="relative w-[50px] h-[50px]">
                        {group.img
                            ? (
                                <NextImage
                                    priority
                                    fill
                                    sizes="(max-width: 50px) 50px"
                                    src={group.img}
                                    alt={group.name}
                                    className={`rounded-full shadow cover`}
                                />
                            ) : (
                                <div className={`w-[50px] h-[50px] shadow bg-slate-200 rounded-full flex justify-center items-center`}>
                                    <span className="font-bold text-xl uppercase">{group.name.slice(0, 1)}</span>
                                </div>
                            )
                        }
                        <a 
                        href={group.url}
                        target="_blank" 
                        rel="noreferrer" 
                        className="w-[50px] h-[50px] bg-white absolute top-0 left-0 right-0 bottom-0 rounded-full cursor-pointer block opacity-0 hover:opacity-30"></a>
                    </div>
                    <a 
                        href={group.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`font-semibold text-slate-800 hover:underline ${ group.active ? '': 'opacity-70' }`}
                    >
                        { group.name }
                    </a>
                </div>
                <div className='flex items-center gap-2'>
                    <label htmlFor={`group-toggle-${group._id}`} className="inline-flex relative items-center cursor-pointer">
                        <input
                            type="checkbox"
                            id={`group-toggle-${group._id}`}
                            checked={activeGroup}
                            onChange={toggleActive}
                            className="sr-only peer"
                        />
                        <div
                            className={`w-[2.8rem] h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-indigo-700 peer-checked:to-blue-700`}
                        >
                        </div>
                    </label>
                    <button
                        onClick={()=>setShowFormEdit(true)}
                        className="items-center text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-500 font-bold text-sm py-2 px-3 rounded-md"
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
                subtitle={`¿ Desea eliminar el grupo "${ group.name }" ?`} 
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
