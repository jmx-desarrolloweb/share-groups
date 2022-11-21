import { FC, useEffect, useReducer, useState } from 'react';

import axios from 'axios';

import { DataContext, dataReducer } from './';

import { ICategory } from '../../interfaces';



interface Props {
    children: JSX.Element
}

export interface DataState {
    categories: ICategory[];

}

const DATA_INITIAL_STATE: DataState = {
    categories: [],
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
            const { data } = await axios.get('/api/admin/categories')
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

            const { data } = await axios.post('/api/admin/categories', { name })
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
            const { data } = await axios.put('/api/admin/categories', category)
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
            const { data } = await axios.delete('/api/admin/categories', {
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


    return (
        <DataContext.Provider value={{
            ...state,
            updating,
            // ListGroups
            addNewCategory,
            updateCategory,
            setUpdating,
            deleteCategory,
      
        }}>
            {children}
        </DataContext.Provider>
    )
}
