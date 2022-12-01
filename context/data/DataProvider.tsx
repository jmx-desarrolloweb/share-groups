import { FC, useEffect, useReducer, useState } from 'react';

import axios from 'axios';

import { DataContext, dataReducer } from './';

import { ICategory, IPage } from '../../interfaces';



interface Props {
    children: JSX.Element
}

export interface DataState {
    categories: ICategory[];
    pages: IPage[];
}

const DATA_INITIAL_STATE: DataState = {
    categories: [],
    pages: [],
}


export const DataProvider: FC<Props> = ({ children }) => {

    const [updating, setUpdating] = useState(false)

    const [state, dispatch] = useReducer(dataReducer, DATA_INITIAL_STATE)

    useEffect(()=> {
        if( state.categories.length === 0 ){
            refreshCategories()
        }
    },[])


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
    // TODO:
    const refreshPages = async( category:string ):Promise<{ hasError:boolean; pagesResp: IPage[] }> => {
        
        try {
            const { data } = await axios.get<IPage[]>('/api/dashboard/pages', { params: { category } })
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
            addNewPage
      
        }}>
            {children}
        </DataContext.Provider>
    )
}
