import { createContext, Dispatch, SetStateAction } from 'react';
import { ICategory, IGroup, IPage } from "../../interfaces";


interface ContextProps {
    categories: ICategory[]
    pages     : IPage[]
    groups    : IGroup[]
    updating  : boolean


    // Methods
    addNewCategory: ( name: string ) => Promise<{ hasError:boolean; message: string; }>
    updateCategory: ( category: ICategory ) => Promise<{ hasError: boolean; message: string; }>
    setUpdating   : Dispatch<SetStateAction<boolean>>
    deleteCategory: ( categoryId: string ) => Promise<{ hasError: boolean; message: string;}>

    refreshPages  : ( category: string) => Promise<{ hasError: boolean; pagesResp: IPage[]; }>
    addNewPage    : ( page: IPage ) => Promise<{ hasError: boolean; message: string; }>
    updatePage    : (page: IPage) => Promise<{ hasError: boolean; message: string; }>
    deletePage    : ( idPage: string) => Promise<{ hasError: boolean; message: string; }>
    
    refreshGroups : ( category: string ) => Promise<{ hasError: boolean; groupsResp: IGroup[]; }>
    addNewGroup   : ( group: IGroup ) => Promise<{ hasError: boolean; message: string; }>
    updateGroup   : ( group: IGroup ) => Promise<{ hasError: boolean; message: string; }>
    deleteGroup   : ( grupoId: string ) => Promise<{ hasError: boolean; message: string; }>

    resetGroupsOfPages: (idCategory: string) => Promise<{
        hasError: boolean;
        pagesResp: IPage[];
    }>
}


export const DataContext = createContext({} as ContextProps)

