


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
            refreshListGroups()
        }
    },[])

    const refreshListGroups = async():Promise<{ hasError:boolean; message: string }> => {

        try {
            
            const { data } = await axios.get('api/admin/categories')
            dispatch({ type: '[Data] - load Categories', payload: data })

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


    return (
        <DataContext.Provider value={{
            ...state,

            // ListGroups
      
        }}>
            {children}
        </DataContext.Provider>
    )
}
