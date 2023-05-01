import { createContext, Dispatch, SetStateAction } from 'react';
import { ICategory, IGroup, IPage, ISection } from "../../interfaces";


interface ContextProps {
    categories: ICategory[]
    pages     : IPage[]
    groups    : IGroup[]
    sections  : ISection[]
    updating  : boolean


    // Methods
    refreshCategories: () => Promise<{ hasError: boolean; categoriesResp: ICategory[]}>
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

    refreshSections: (category: string) => Promise<{ hasError: boolean; sectionsResp: ISection[]; }>
    addNewSection  : (section: ISection) => Promise<{ hasError: boolean; message: string; }>
    updateSection  : (section: ISection) => Promise<{ hasError: boolean; message: string; }>
    deleteSection  : ( sectionId: string ) => Promise<{ hasError: boolean; message: string; }>

    resetGroupsOfPages: (idCategory: string, random?:boolean) => Promise<{
        hasError: boolean;
        pagesResp: IPage[];
    }>

    toggleActiveGroups: (idCategory: string, activate?: boolean, idSection?: string, activeSection?: boolean) => Promise<{
        hasError: boolean;
    }>
}


export const DataContext = createContext({} as ContextProps)

