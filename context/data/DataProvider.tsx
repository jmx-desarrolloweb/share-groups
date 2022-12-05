import { FC, useEffect, useReducer, useState } from 'react';

import axios from 'axios';

import { DataContext, dataReducer } from './';

import { ICategory, IGroup, IPage } from '../../interfaces';
import { useAuth } from '../../hooks/useAuth';



interface Props {
    children: JSX.Element
}

export interface DataState {
    categories: ICategory[];
    pages: IPage[];
    groups: IGroup[];
}

const DATA_INITIAL_STATE: DataState = {
    categories: [],
    pages: [],
    groups: [],
}


export const DataProvider: FC<Props> = ({ children }) => {

    const [updating, setUpdating] = useState(false)
    const { isLoggedIn } = useAuth()

    const [state, dispatch] = useReducer(dataReducer, DATA_INITIAL_STATE)

    useEffect(()=> {
        if(!isLoggedIn){ return }

        if( state.categories.length === 0 ){
            refreshCategories()
        }
    },[ isLoggedIn ])


    const refreshCategories = async():Promise<{ hasError:boolean; message: string }> => {

        try {
            const { data } = await axios.get('/api/dashboard/categories')
            dispatch({ type: '[Data] - Load Categories', payload: data })

            return {
                hasError: false,
                message: 'Listas cargadas correctamente',
            }
        } catch (error) {
        
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                return {
                    hasError: true,
                    message: message
                }
            }

            return {
                hasError: true,
                message: 'Hubo un error inesperado, comuniquese con soporte',
            }
        }
    }

    const addNewCategory = async( name: string ):Promise<{ hasError:boolean; message: string }>  => {
        try {

            const { data } = await axios.post('/api/dashboard/categories', { name })
            dispatch({ type: '[Data] - Add New Category', payload: data })

            return {
                hasError: false,
                message: data.slug
            }

        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                return {
                    hasError: true,
                    message: message
                }
            }

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

            return {
                hasError: false,
                message: data.slug
            }
            
        } catch (error) {

            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                setUpdating(false)
                return {
                    hasError: true,
                    message: message
                }
            }

            setUpdating(false)
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

            dispatch({ type: '[Data] - Delete Category', payload: data.message })

            return {
                hasError: false,
                message: ''
            }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                setUpdating(false)
                return {
                    hasError: true,
                    message: message
                }
            }

            setUpdating(false)
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
                return {
                    hasError: true,
                    pagesResp: []
                }
            }

            setUpdating(false)
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

            return {
                hasError: false,
                message: ''
            }

        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                setUpdating(false)
                return {
                    hasError: true,
                    message: message
                }
            }

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
            const { data } = await axios.get<IPage[]>('/api/dashboard/groups', { params: { category } })
            
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
                setUpdating(false)
                return {
                    hasError: true,
                    groupsResp: []
                }
            }

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

            return {
                hasError: false,
                message: ''
            }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                setUpdating(false)
                return {
                    hasError: true,
                    message: message
                }
            }

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
            console.log(data);
            
        return {
                hasError: false,
                message: ''
        }

        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                setUpdating(false)
                return {
                    hasError: true,
                    message: message
                }
            }

            setUpdating(false)
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


            return {
                hasError: false,
                message: ''
            }
            
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                setUpdating(false)
                return {
                    hasError: true,
                    message: message
                }
            }

            setUpdating(false)
            return {
                hasError: true,
                message: 'Hubo un error inesperado, comuniquese con soporte',
            }
        }
    }



    return (
        <DataContext.Provider value={{
            ...state,
            updating,
            // Categories
            addNewCategory,
            updateCategory,
            setUpdating,
            deleteCategory,

            // Pages
            refreshPages,
            addNewPage,

            // Groups
            refreshGroups,
            addNewGroup,
            updateGroup,
            deleteGroup,
      
        }}>
            {children}
        </DataContext.Provider>
    )
}
