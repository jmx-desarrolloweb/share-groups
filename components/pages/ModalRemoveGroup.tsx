import { FC } from "react"
import NextImage from "next/image"

import { IGroup } from "../../interfaces"

interface Props {
    toShow: boolean
    processing?: boolean
    titlePage: string
    group?: IGroup
    onResult: ( method: () => Promise<{ confirm: boolean }> ) => void
}

export const ModalRemoveGroup:FC<Props> = ({ toShow, processing = false, titlePage, group, onResult }) => {


    const resultConfirm = async() => {
        return { confirm: true }
    }
    
    const resultCancel = async() => {
        return { confirm: false }
    }


    return (
        <>
        {
            toShow && group && (
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all my-8 w-full sm:max-w-lg">
                                
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z" />
                                            </svg>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">Remover grupo</h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">¿Desea remover este grupo de la página <strong>{ titlePage }</strong> ?</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <div className={`pl-10 pr-10 my-1 py-2 justify-between items-center even:bg-gray-100 opacity-100 flex border-b border-t`}>
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
                                                                <span className="font-bold text-xl uppercase">{group.name.slice(0, 1)}</span>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <p>
                                                    {group.name}    
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className='text-red-500 hover:text-red-600'
                                                >
                                                    <i className='bx bx-trash' ></i>
                                                </span>
                                                <span
                                                    className='text-blue-800 hover:text-blue-600'
                                                >
                                                    <i className='bx bx-share text-xl scale-x-[-1]'></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button 
                                        type="button" 
                                        disabled={processing}
                                        onClick={ ()=> onResult( resultConfirm ) }
                                        className="flex w-full justify-center items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-28 sm:text-sm disabled:bg-red-400 disabled:cursor-not-allowed">
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
                                            : 'Remover'
                                        }
                                    </button>
                                    <button
                                        type="button"
                                        disabled={processing} 
                                        onClick={ ()=> onResult(resultCancel) } 
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        </>
    )
}
