import { FC, useEffect, useReducer, useState } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify'

import { DataContext, dataReducer } from './';

import { ICategory, IGroup, IPage, ISection } from '../../interfaces';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';



interface Props {
    children: JSX.Element
}

export interface DataState {
    categories: ICategory[];
    pages: IPage[];
    groups: IGroup[];
    sections: ISection[]
}

const DATA_INITIAL_STATE: DataState = {
    categories: [],
    pages: [],
    groups: [],
    sections: [],
}


export const DataProvider: FC<Props> = ({ children }) => {

    const [updating, setUpdating] = useState(false)
    const { isLoggedIn } = useAuth()

    const router = useRouter()

    const [state, dispatch] = useReducer(dataReducer, DATA_INITIAL_STATE)

    const notifySuccess = ( msg:string ) => toast.success(msg, {
        // theme: "colored",
        autoClose: 1000
    })
    const notifyError = ( msg:string ) => toast.error(msg, {
        // theme: "colored",
        autoClose: 3000
    })


    useEffect(()=> {
        if(!isLoggedIn){ return }

        if( state.categories.length === 0 ){
            refreshCategories()
        }
    },[ isLoggedIn ])



    // ============ ============ Categories ============ ============

    const refreshCategories = async():Promise<{ hasError:boolean; categoriesResp: ICategory[] }> => {

        try {
            const { data } = await axios.get('/api/dashboard/categories')
            dispatch({ type: '[Data] - Load Categories', payload: data })

            return {
                hasError: false,
                categoriesResp: data,
            }
        } catch (error) {
        
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                notifyError(message)
                return {
                    hasError: true,
                    categoriesResp: []
                }
            }

            notifyError('Hubo un error inesperado')
            return {
                hasError: true,
                categoriesResp: [],
            }
        }
    }

    const addNewCategory = async( name: string ):Promise<{ hasError:boolean; message: string }>  => {
        try {

            const { data } = await axios.post('/api/dashboard/categories', { name })
            dispatch({ type: '[Data] - Add New Category', payload: data })
            notifySuccess('Nueva categoria agregada')

            return {
                hasError: false,
                message: data.slug
            }

        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                notifyError(message)
                return {
                    hasError: true,
                    message: message
                }
            }
            notifyError('Hubo un error inesperado')
            return {
                hasError: true,
                message: 'Hubo un error inesperado, comuniquese con soporte',
            }
        }
    }

    const updateCategory = async( category:ICategory ):Promise<{ hasError:boolean; message: string }>  => {

        setUpdating(true)

        try {
            const { data } = await axios.put('/api/dashboard/categories', category)

            dispatch({ type: '[Data] - Update Category', payload: data })
            notifySuccess('Categoría actualizada')
            return {
                hasError: false,
                message: data.slug
            }
            
        } catch (error) {

            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                setUpdating(false)
                notifyError(message)
                return {
                    hasError: true,
                    message: message
                }
            }

            setUpdating(false)
            notifyError('Hubo un error inesperado')
            return {
                hasError: true,
                message: 'Hubo un error inesperado, comuniquese con soporte',
            }
        }
    }

    const deleteCategory = async( categoryId: string ): Promise<{ hasError: boolean; message: string;}> => {

        try {

            const { data } = await axios.delete('/api/dashboard/categories', {
                data: {
                    _id: categoryId
                }
            })

            await router.replace('/dashboard')

            dispatch({ type: '[Data] - Delete Category', payload: data.message })
            notifySuccess('Categoría eliminada')

            return {
                hasError: false,
                message: ''
            }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                setUpdating(false)
                notifyError(message)
                return {
                    hasError: true,
                    message: message
                }
            }

            setUpdating(false)
            notifyError('Hubo un error inesperado')
            return {
                hasError: true,
                message: 'Hubo un error inesperado, comuniquese con soporte',
            }
        }
    }



    // ============ ============ Pages ============ ============

    const refreshPages = async( category:string ):Promise<{ hasError:boolean; pagesResp: IPage[] }> => {
        
        try {
            const { data } = await axios.get<IPage[]>('/api/dashboard/pages', { params: { category } })
            
            if(data.length === 0){
                return {
                    hasError: false,
                    pagesResp: [],
                }
            }

            dispatch({ type: '[Data] - Load Pages', payload: data })
            return {
                hasError: false,
                pagesResp: data,
            }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                setUpdating(false)
                notifyError(message)
                return {
                    hasError: true,
                    pagesResp: []
                }
            }

            setUpdating(false)
            notifyError('Hubo un error inesperado')
            return {
                hasError: true,
                pagesResp: [],
            }
        }
    
    }

    const addNewPage = async( page: IPage ): Promise<{ hasError: boolean, message: string }> => {

        try {
            
            const { data } = await axios.post('/api/dashboard/pages', page )

            dispatch({ type: '[Data] - Add New Page', payload: data })
            notifySuccess('Página agregada')

            return {
                hasError: false,
                message: ''
            }

        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                setUpdating(false)
                notifyError(message)
                return {
                    hasError: true,
                    message: message
                }
            }

            setUpdating(false)
            notifyError('Hubo un error inesperado')
            return {
                hasError: true,
                message: 'Hubo un error inesperado, comuniquese con soporte',
            }
        }
    }

    const updatePage = async ( page: IPage ): Promise<{ hasError: boolean; message: string;}> => {

        try {

            const { data } = await axios.put('/api/dashboard/pages', page)

            dispatch({ type: '[Data] - Update Page', payload: data })            
            notifySuccess('Página actualizada')

            return {
                hasError: false,
                message: ''
            }

        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}

                notifyError(message)
                setUpdating(false)
                return {
                    hasError: true,
                    message: message
                }
            }

            notifyError('Hubo un error inesperado')
            setUpdating(false)
            return {
                hasError: true,
                message: 'Hubo un error inesperado, comuniquese con soporte',
            }
        }
    }

    const deletePage = async( idPage: string ): Promise<{ hasError:boolean; message:string; }> => {

        try {
            
            const { data } = await axios.delete('/api/dashboard/pages', {
                data: {
                    _id: idPage
                }
            })

            dispatch({ type: '[Data] - Delete Page', payload: data.message })
            notifySuccess('Página eliminada')

            return {
                hasError: false,
                message: ''
            }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}

                notifyError(message)
                setUpdating(false)
                return {
                    hasError: true,
                    message: message
                }
            }

            notifyError('Hubo un error inesperado')
            setUpdating(false)
            return {
                hasError: true,
                message: 'Hubo un error inesperado, comuniquese con soporte',
            }
        }
        

    }



    // ============ ============ Groups ============ ============

    const refreshGroups = async( category:string ):Promise<{ hasError:boolean; groupsResp: IGroup[] }> => {
        

        try {
            const { data } = await axios.get<IGroup[]>('/api/dashboard/groups', { params: { category } })
            
            if(data.length === 0){
                return {
                    hasError: false,
                    groupsResp: [],
                }
            }

            dispatch({ type: '[Data] - Load Groups', payload: data })
            return {
                hasError: false,
                groupsResp: data,
            }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                notifyError(message)
                setUpdating(false)

                return {
                    hasError: true,
                    groupsResp: []
                }
            }

            notifyError('Hubo un error inesperado')
            setUpdating(false)
            return {
                hasError: true,
                groupsResp: [],
            }
        }
    }

    const addNewGroup = async( group: IGroup ): Promise<{ hasError: boolean, message: string }> => {

        try {

            const { data } = await axios.post('/api/dashboard/groups', group)

            dispatch({ type:'[Data] - Add New Group', payload: data })
            notifySuccess('Grupo agregado')

            return {
                hasError: false,
                message: ''
            }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}

                notifyError(message)
                setUpdating(false)
                return {
                    hasError: true,
                    message: message
                }
            }

            notifyError('Hubo un error inesperado')
            setUpdating(false)
            return {
                hasError: true,
                message: 'Hubo un error inesperado, comuniquese con soporte',
            }
        }

    }

    const updateGroup = async ( group: IGroup ): Promise<{ hasError: boolean; message: string;}> => {
                

        try {
            
            const { data } = await axios.put('/api/dashboard/groups', group)

            dispatch({ type: '[Data] - Update Group', payload: data })
            notifySuccess('Grupo actualizado')

        return {
                hasError: false,
                message: ''
        }

        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                setUpdating(false)
                notifyError(message)

                return {
                    hasError: true,
                    message: message
                }
            }

            setUpdating(false)
            notifyError('Hubo un error inesperado')

            return {
                hasError: true,
                message: 'Hubo un error inesperado, comuniquese con soporte',
            }
        }

    }


    const deleteGroup = async( grupoId: string ): Promise<{ hasError: boolean; message: string;}> => {
        
        try {

            const { data } = await axios.delete('/api/dashboard/groups', {
                data: {
                    _id: grupoId
                }
            })

            dispatch({ type: '[Data] - Delete Group', payload: data.message })
            notifySuccess('Grupo eliminado')

            return {
                hasError: false,
                message: ''
            }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                setUpdating(false)
                notifyError(message)

                return {
                    hasError: true,
                    message: message
                }
            }

            setUpdating(false)
            notifyError('Hubo un error inesperado')

            return {
                hasError: true,
                message: 'Hubo un error inesperado, comuniquese con soporte',
            }
        }
    }

    // ============ ============ TODO: Section ============ ============

    const refreshSections = async(category: string):Promise<{ hasError:boolean; sectionsResp: ISection[] }> => {

        try {

            const { data } = await axios.get<ISection[]>('/api/dashboard/sections', { params: { category } })
            
            if(data.length === 0){
                return {
                    hasError: false,
                    sectionsResp: [],
                }
            }

            dispatch({ type: '[Data] - Load Sections', payload: data })

            return {
                hasError: false,
                sectionsResp: data,
            }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                notifyError(message)
                setUpdating(false)

                return {
                    hasError: true,
                    sectionsResp: []
                }
            }

            notifyError('Hubo un error inesperado')
            setUpdating(false)
            return {
                hasError: true,
                sectionsResp: [],
            }
        }
    } 

    const addNewSection = async( section: ISection  ):Promise<{ hasError: boolean, message: string }> => {


        try {

            const { data } = await axios.post('/api/dashboard/sections', section)

            dispatch({ type:'[Data] - Add New Section', payload: data })

            notifySuccess('Section agregada')
            return {
                hasError: false,
                message: ''
            }

        } catch (error) {
            
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}

                notifyError(message)
                setUpdating(false)
                return {
                    hasError: true,
                    message: message
                }
            }

            notifyError('Hubo un error inesperado')
            setUpdating(false)
            return {
                hasError: true,
                message: 'Hubo un error inesperado, comuniquese con soporte',
            }
        }
    }



    // ============ ============ Reset ============ ============

    const resetGroupsOfPages = async( idCategory:string, random = true ):Promise<{ hasError:boolean; pagesResp: IPage[] }> => {
        try {
            const { data } = await axios.post('/api/dashboard/reset-random-groups', { idCategory, random })

            if(data.length === 0){
                return {
                    hasError: false,
                    pagesResp: [],
                }
            }

            const newArray = state.pages.filter( page => page.category !== idCategory ) 
            dispatch({ type: '[Data] - Reset Groups Of Pages', payload: [ ...newArray, ...data ] })
            
            notifySuccess('Grupos reasignados')
            return {
                hasError: false,
                pagesResp: data,
            }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                setUpdating(false)
                notifyError(message)

                return {
                    hasError: true,
                    pagesResp: []
                }
            }

            setUpdating(false)
            notifyError('Hubo un error inesperado')

            return {
                hasError: true,
                pagesResp: []
            }
        }
    }

    const toggleActiveGroups = async( idCategory:string, activate = true ):Promise<{ hasError:boolean }> => {
        try {
            await axios.post('/api/dashboard/toggle-active-groups', { idCategory, activate })
            dispatch({ type: '[Data] - Toggle Active Groups', payload: { idCategory, activate } })

            if( activate ){
                notifySuccess('Grupos activados')
            }else {
                notifySuccess('Grupos desactivados')
            }

            return {
                hasError: false
            }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                setUpdating(false)
                notifyError(message)

                return {
                    hasError: true
                }
            }

            setUpdating(false)
            notifyError('Hubo un error inesperado')

            return {
                hasError: true
            }
        }
    }


    return (
        <DataContext.Provider value={{
            ...state,
            updating,
            // Categories
            refreshCategories,
            addNewCategory,
            updateCategory,
            setUpdating,
            deleteCategory,

            // Pages
            refreshPages,
            addNewPage,
            updatePage,
            deletePage,

            // Groups
            refreshGroups,
            addNewGroup,
            updateGroup,
            deleteGroup,

            // Sections
            refreshSections,
            addNewSection,

            // reset
            resetGroupsOfPages,

            // toggle groups
            toggleActiveGroups,
      
        }}>
            {children}
        </DataContext.Provider>
    )
}
