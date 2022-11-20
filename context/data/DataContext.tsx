import { createContext } from 'react';
import { ICategory } from "../../interfaces";


interface ContextProps {
    categories: ICategory[]

    // Methods
    addNewCategory: (name: string) => Promise<{hasError:boolean; message: string }>
}


export const DataContext = createContext({} as ContextProps)

