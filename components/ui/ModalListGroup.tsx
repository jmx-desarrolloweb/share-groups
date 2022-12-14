import { FC, useEffect, useState } from 'react';
import NextImage from 'next/image'

import { useData } from '../../hooks/useData';
import { IGroup } from '../../interfaces'

interface Props {
    idCategory: string
    pageName: string
    loadingGroups: boolean
    processing: boolean
    currentGroups: IGroup[]
    handleAddGroup: (newGroup: IGroup | undefined) => Promise<void>
}

export const ModalListGroup:FC<Props> = ({ idCategory, pageName, processing=false, loadingGroups, currentGroups, handleAddGroup }) => {

    const [groupsOfCategory, setGroupsOfCategory] = useState<IGroup[]>([])
    const [groupActive, setGroupActive] = useState<IGroup>()


    const { groups } = useData()    

    useEffect(()=>{

        if(currentGroups.length === 0){
            const groupsByCategory = groups.filter( group => group.category === idCategory && group.active )
            setGroupsOfCategory( groupsByCategory )
            return
        }

        const idsCurrentGroups = currentGroups.map( g => g._id )
        const groupsByCategory = groups.filter( group => group.category === idCategory && group.active && !idsCurrentGroups.includes(group._id) )

        setGroupsOfCategory( groupsByCategory )


    },[idCategory, groups])



    const selectedGroup = ( group: IGroup ) => {

        if( group._id === groupActive?._id ){
            setGroupActive(undefined)
            return
        }

        setGroupActive( group)
    }

    
    const onAddNewGroup = () => {
        if(!groupActive){
            return
        }

        handleAddGroup( groupActive )
    }


    return (
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 z-20 shadow">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <i className='bx bxs-user-circle text-emerald-600 text-xl'></i>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">Añadir grupo</h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">Seleccione el grupo que desee añadir a <strong>{pageName}</strong></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='px-5' >
                                    {
                                        loadingGroups 
                                        ?(
                                            <div className=" py-40 w-full flex justify-center items-center">
                                                <span className="loader"></span>
                                            </div>
                                        ):(
                                            <>
                                                {
                                                    groupsOfCategory.length === 0 
                                                    ? (
                                                        <div className='px-5 py-10 flex gap-5 justify-center flex-col items-center'>
                                                            <span className='text-5xl text-gray-300'>
                                                                <i className='bx bx-collection'></i>
                                                            </span>
                                                            <p className='text-xl font-bold text-gray-300'>No hay grupos para agregar</p>
                                                        </div>
                                                    ):(
                                                        <ul className='max-h-[500px] overflow-y-auto custom-scroll py-3'>
                                                            {
                                                                groupsOfCategory.map( group => {
                                                                    return (
                                                                            <li 
                                                                                key={group._id}
                                                                                onClick={ ()=>selectedGroup( group ) } 
                                                                                className={`pl-10 pr-10 py-2 justify-between items-center opacity-100 flex border-2 cursor-pointer border-transparent hover:bg-blue-100 hover:shadow-md rounded ${ group._id === groupActive?._id ? ' border-blue-700 bg-blue-100 shadow-xl' : 'even:bg-gray-100'}`}
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="relative w-[40px] h-[40px]">
                                                                                        {group.img
                                                                                            ? (
                                                                                                <NextImage
                                                                                                    priority
                                                                                                    fill
                                                                                                    sizes="(max-width: 40px) 40px"
                                                                                                    src={group.img}
                                                                                                    alt={group.name}
                                                                                                    className='rounded-full shadow cover'
                                                                                                />
                                                                                            ) : (
                                                                                                <div className="w-[40px] h-[40px] shadow bg-slate-200 rounded-full flex justify-center items-center">
                                                                                                    <span className="font-bold text-xl uppercase cursor-default">{group.name.slice(0, 1)}</span>
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                    <p>
                                                                                        {group.name}    
                                                                                    </p>
                                                                                </div>
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                    )
                                                }
                                            </>
                                        )
                                        
                                    }
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t">
                                    <button 
                                        type="button" 
                                        disabled={processing || !groupActive }
                                        onClick={ onAddNewGroup }
                                        className="flex w-full justify-center items-center rounded-md border border-transparent bg-gradient-to-r from-indigo-700 to-blue-700 hover:from-indigo-800 hover:to-blue-800 px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:ml-3 sm:w-28 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                                            {
                                                processing
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
                                                    : 'Agregar'
                                            }
                                    </button>
                                    <button
                                        type="button"
                                        disabled={processing} 
                                        onClick={ ()=> handleAddGroup( undefined ) } 
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}
