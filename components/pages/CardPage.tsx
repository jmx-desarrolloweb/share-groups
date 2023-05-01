import { FC, useState } from "react"
import NextImage from 'next/image'

import { ModalDelete, ModalListGroup } from "../ui";
import { useData } from '../../hooks/useData';
import { ModalFormPage } from "./ModalFormPage";
import { IGroup, IPage } from "../../interfaces"
import { ModalRemoveGroup } from "./ModalRemoveGroup";

interface Props {
    page: IPage
    categoryId: string
}

export const CardPage: FC<Props> = ({ page, categoryId }) => {

    const [showFormEdit, setShowFormEdit] = useState(false)
    const [openGroups, setOpenGroups] = useState(false)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    

    const [loadingUpdatingPage, setLoadingUpdatingPage] = useState(false)

    const [showModalListGroup, setShowModalListGroup] = useState(false)
    const [loadingGroups, setLoadingGroups] = useState(false)

    const [showModalRemoveGroup, setShowModalRemoveGroup] = useState(false)
    const [groupRemove, setGroupRemove] = useState<IGroup>()



    const { deletePage, updatePage, groups, refreshGroups } = useData()


    // Modal Delete Page
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

    // Modal Add New Group
    const handleShowModalListGroup = async( ) => {
        const body = document.querySelector<HTMLBodyElement >('body')
        body?.classList.add('fixed-body')

        setLoadingGroups(true)
        setShowModalListGroup(true)

        const groupsByCategory = groups.filter( group => group.category === categoryId )
        
        if(groupsByCategory.length === 0){
            await refreshGroups( categoryId ) 
        }

        setLoadingGroups(false)

    
    }

    const handleHiddenModalListGroup = ( ) => {
        const body = document.querySelector<HTMLBodyElement>('body')
        body?.classList.remove('fixed-body')
        setShowModalListGroup(false)
    }

    // Modal remove group
    const handleShowModalRemoveGroup = ( group: IGroup ) => {
        const body = document.querySelector<HTMLBodyElement>('body')
        body?.classList.remove('fixed-body')
        setGroupRemove(group)
        setShowModalRemoveGroup(true)
    }
    const handleHiddenModalRemoveGroup = () => {
        const body = document.querySelector<HTMLBodyElement>('body')
        body?.classList.remove('fixed-body')
        setShowModalRemoveGroup(false)
        setGroupRemove(undefined)
    }


    const openAll = async() => {

        await window.open(page.url, '_blank')

        if(!page.groups || page.groups?.length === 0){ return}
        
        for await(const group of page.groups) {
            await window.open(group.url, '_blank')
        }
        
    }


    const handleAddGroup = async ( newGroup: IGroup | undefined ) => {

        if( !newGroup ){
            handleHiddenModalListGroup()
            return
        }

        setLoadingUpdatingPage(true)

        const { hasError } = await updatePage({ 
            ...page, 
            groups: [...page.groups!, newGroup] 
        })

        setLoadingUpdatingPage(false)

        if( hasError ){ return }

        handleHiddenModalListGroup()
        setOpenGroups(true)

    }

    const handleRemoveGroup = async( method: () => Promise<{ confirm: boolean }> ) => {

        const { confirm } = await method()

        if( !confirm ){
            handleHiddenModalRemoveGroup()
            return
        }
        setLoadingUpdatingPage(true)
        const pageUdate:IPage = {
            ...page,
            groups: page.groups?.filter( g => g._id !== groupRemove?._id )
        }

        const { hasError } = await updatePage(pageUdate)
        setLoadingUpdatingPage(false)

        if(hasError){ return }

        handleHiddenModalRemoveGroup()
        
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
        <div className={`mb-3 bg-white border rounded ${openGroups ? 'h-auto shadow-lg' : 'h-22'}`}> 
            <header className={`flex justify-between items-center bg-white rounded py-2 px-5 ${openGroups ? 'border-b' : ''}`}>
                <div className="relative w-[64px] h-[64px]">
                    {page.img
                        ? (
                            <NextImage
                                priority
                                fill
                                sizes="(max-width: 64px) 64px"
                                src={page.img}
                                alt={page.name}
                                className='rounded-full shadow cover'
                            />
                        ) : (
                            <div className="w-[64px] h-[64px] shadow bg-slate-200 rounded-full flex justify-center items-center">
                                <span className="font-bold text-xl uppercase">{page.name.slice(0, 1)}</span>
                            </div>
                        )
                    }
                    <a 
                        href={page.url}
                        target="_blank" 
                        rel="noreferrer" 
                        className="w-[64px] h-[64px] bg-white absolute top-0 left-0 right-0 bottom-0 rounded-full cursor-pointer block opacity-0 hover:opacity-30"></a>
                </div>
                <a href={ page.url } target="_blank" rel="noreferrer" className="text-slate-800 sm:text-xl font-bold hover:underline flex-1 ml-2 sm:flex-initial sm:ml-0">{ page.name }</a>
                <div className="flex items-center">
                    <div className='group relative' >
                        <button className='hover:bg-slate-100 rounded active:scale-95 p-2'>
                            <i className='bx bx-dots-horizontal-rounded text-slate-800'></i>
                        </button>
                        <div 
                            className="origin-top-right absolute right-0 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 hidden group-hover:block"
                            role="menu"
                        >
                            <div className="py-2" role="none">
                                <button
                                    onClick={ handleShowModalListGroup } 
                                    className="w-full text-left text-gray-700 flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900">
                                    <i className='bx bx-plus text-emerald-600 text-xl'></i>
                                    <span>Añadir grupo</span>
                                </button>
                                <button
                                    onClick={ () => setShowFormEdit(true) } 
                                    className="w-full text-left text-gray-700 flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900">
                                    <i className='bx bx-edit-alt text-blue-500 text-xl' ></i>
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
                    </div>
                    <button
                        onClick={() => setOpenGroups(!openGroups)}
                        disabled={page.groups!.length === 0}
                        className={`text-2xl p-1 hover:bg-slate-100 rounded ${page.groups!.length > 0 ? 'opacity-100' : 'opacity-10'}`}
                    >
                        <i className={`bx bx-chevron-down transition-all ${openGroups && page.groups!.length > 0 ? 'rotate-180' : ''}`}></i>
                    </button>
                    <button
                        onClick={ openAll } 
                        className="hover:text-gray-900 hover:bg-slate-100 rounded active:scale-95 p-2">
                        <i className='bx bx-link-external text-slate-600'></i>
                    </button>
                </div>
            </header>
            <div>
            {
                    page.groups!.length > 0 &&
                    <div>
                        {
                            page.groups!.map(group => {
                                    return (
                                        <div key={group._id} className={`pl-10 pr-10 my-1 py-4 justify-between items-center even:bg-gray-100 ${openGroups ? 'opacity-100 flex' : 'opacity-0 hidden'}`}>
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
                                                    <a 
                                                        href={group.url}
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="w-[40px] h-[40px] bg-white absolute top-0 left-0 right-0 bottom-0 rounded-full cursor-pointer block opacity-0 hover:opacity-30"
                                                    ></a>
                                                </div>
                                                <a 
                                                    href={ group.url }  
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="hover:underline text-sm sm:text-base"
                                                >
                                                    {group.name}    
                                                </a>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    className='text-red-500 hover:text-red-600'
                                                    onClick={() => handleShowModalRemoveGroup(group)}
                                                >
                                                    <i className='bx bx-trash' ></i>
                                                </button>
                                                <a
                                                    href={group.url}
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className='text-gray-600 hover:text-blue-600'
                                                >
                                                    <i className='bx bx-link-alt text-xl'></i>
                                                </a>
                                            </div>
                                        </div>
                                    )
                            })
                        }
                    </div>
                }
            </div>
            {
                showModalListGroup && (
                    <ModalListGroup 
                        processing={loadingUpdatingPage}
                        pageName={ page.name }
                        loadingGroups={loadingGroups}
                        idCategory={ categoryId }
                        currentGroups = {page.groups as IGroup[]}
                        handleAddGroup={ handleAddGroup }
                    />
                )
            }
            
            <ModalRemoveGroup
                processing={loadingUpdatingPage} 
                toShow={showModalRemoveGroup} 
                titlePage={page.name} 
                group={groupRemove} 
                onResult={ handleRemoveGroup }
            />
            <ModalDelete
                toShow={showDeleteModal} 
                processing={loadingDelete}
                title={'Eliminar grupo'} 
                subtitle={`¿ Desea eliminar la página "${ page.name }" ?`} 
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
