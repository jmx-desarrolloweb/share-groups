import { createContext } from 'react';
import { ICategory } from "../../interfaces";


interface ContextProps {
    categories: ICategory[]
}


export const DataContext = createContext({} as ContextProps)

