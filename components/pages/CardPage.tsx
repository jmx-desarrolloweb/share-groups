import { FC, useState } from "react"
import NextImage from 'next/image'

import { ModalDelete } from "../ui";
import { useData } from '../../hooks/useData';
import { ModalFormPage } from "./ModalFormPage";
import { IPage } from "../../interfaces"

interface Props {
    page: IPage
    categoryId: string
}

export const CardPage: FC<Props> = ({ page, categoryId }) => {


    const [showOptions, setShowOptions] = useState(false)
    const [showFormEdit, setShowFormEdit] = useState(false)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)


    const { deletePage } = useData()


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


    const handleDeletePage = async( method: () => Promise<{ confirm: boolean }> ) => {
        
        const { confirm } = await method()

        if( !confirm ){
            handleHiddenModalDelete()
            return
        }

        setLoadingDelete(true)
        
        const { hasError } = await deletePage( page._id! )

        if( hasError ){ 
            return setLoadingDelete(false)
        }

         handleHiddenModalDelete()
    }


    return (
        <div className="mb-2">
            <header className="flex justify-between items-center border bg-white rounded py-2 px-5">
                <div>
                    {page.img
                        ? (
                            <NextImage
                                priority
                                width={64}
                                height={64}
                                src={page.img}
                                alt={page.name}
                                className='rounded-full shadow'
                            />
                        ) : (
                            <div className="w-[64px] h-[64px] shadow bg-slate-200 rounded-full flex justify-center items-center">
                                <span className="font-bold text-xl uppercase">{page.name.slice(0, 1)}</span>
                            </div>
                        )
                    }
                </div>
                <h3 className="text-slate-800 text-xl font-bold">{ page.name }</h3>
                <div
                    // onMouseOut={()=>setShowOptions(false)}
                    className='relative'
                >
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className='hover:bg-slate-100 rounded active:scale-95 p-1'
                    >
                        <i className='bx bx-dots-vertical text-slate-800'></i>
                    </button>
                    {
                        showOptions &&
                        <div className="origin-top-right absolute right-0 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu">
                        <div className="py-2" role="none">
                            <button
                                onClick={ () => setShowFormEdit(true) } 
                                className="w-full text-left text-gray-700 flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900">
                                <i className='bx bx-edit-alt text-sky-600 text-xl' ></i>
                                <span>Editar</span>
                            </button>
                            <button 
                                onClick={handleShowModalDelete}
                                className="w-full text-left text-gray-700 flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900">
                                <i className='bx bx-trash text-red-600 text-xl'></i>
                                <span>Eliminar</span>
                            </button>
                        </div>
                    </div>
                    }
                </div>
            </header>
            <div>

            </div>
            <ModalDelete
                toShow={showDeleteModal} 
                processing={loadingDelete}
                title={'Eliminar grupo'} 
                subtitle={`¿ Desde eliminar la página "${ page.name }" ?`} 
                onResult={handleDeletePage}
            />
            {
                showFormEdit && (
                    <ModalFormPage
                        pageEdit={ page }
                        categoryId={categoryId}
                        setShowForm={setShowFormEdit}
                    />
                )
            }
        </div>
    )
}
