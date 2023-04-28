import { FC, useState } from "react"

import { useData } from "../../hooks/useData"
import { ModalDelete } from "../ui"
import { ModalFormSection } from "./ModalFormSection"

import { ISection } from "../../interfaces"


interface Props{
    section: ISection
}

export const CardSection:FC<Props> = ({ section }) => {

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showFormEdit, setShowFormEdit] = useState(false)

    const [loadingDelete, setLoadingDelete] = useState(false)


    const { deleteSection } = useData()


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



    const onDelete = async( method: ()=> Promise<{ confirm: boolean }> ) => {
        
        const { confirm } = await method()
        
        if( !confirm ){
            handleHiddenModalDelete()
            return
        }
        
        setLoadingDelete(true)

        const { hasError } = await deleteSection( section._id! )

        if( hasError ){ 
            return setLoadingDelete(false)
        }

        handleHiddenModalDelete()
    }

    return (
        <>
            <li className="flex w-full justify-between items-center bg-white px-3 py-2 rounded border mb-2">
                <div>
                    <p className="font-semibold sm:pl-2">{ section.title }</p>
                </div>

                <div className='flex items-center gap-2'>
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
                title={'Eliminar sección'} 
                subtitle={`¿ Desea eliminar la sección "${ section.title }" ?`} 
                onResult={onDelete}
            />
            {
                showFormEdit && (
                    <ModalFormSection
                        sectionEdit={ section }
                        category={section.category!}
                        setShowForm={setShowFormEdit}
                    />
                )
            }
        </>
    )
}
