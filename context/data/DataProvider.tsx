


import axios from 'axios';
import { FC, useEffect, useReducer } from 'react';
import { ICategory } from '../../interfaces';
import { DataContext, dataReducer } from './';


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
            dispatch({ type: '[Data] - Add New Categy', payload: data })

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

    const updateCategory = ( category:ICategory ) => {
        console.log('Editando...', category.name);
    }

    const deleteCategory = ( categoryId: string ) => {
        console.log('Eliminando...', categoryId);
    }


    return (
        <DataContext.Provider value={{
            ...state,

            // ListGroups
            addNewCategory
      
        }}>
            {children}
        </DataContext.Provider>
    )
}
