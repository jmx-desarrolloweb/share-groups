

import { DataState } from './';
import { ICategory, IGroup, IPage, ISection } from '../../interfaces';


type DataActionType =
    | { type: '[Data] - Load Categories', payload: ICategory[] }
    | { type: '[Data] - Add New Category', payload: ICategory }
    | { type: '[Data] - Update Category', payload: ICategory }
    | { type: '[Data] - Delete Category', payload: string }

    | { type: '[Data] - Load Pages', payload: IPage[] }
    | { type: '[Data] - Add New Page', payload: IPage }
    | { type: '[Data] - Update Page', payload: IPage }
    | { type: '[Data] - Delete Page', payload: string }
    
    | { type: '[Data] - Load Groups', payload: IGroup[] }
    | { type: '[Data] - Add New Group', payload: IGroup }
    | { type: '[Data] - Update Group', payload: IGroup }
    | { type: '[Data] - Delete Group', payload: string }

    | { type: '[Data] - Load Sections', payload: ISection[] }
    | { type: '[Data] - Add New Section', payload: ISection }


    | { type: '[Data] - Reset Groups Of Pages', payload: IPage[] }

    | { type: '[Data] - Toggle Active Groups', payload: { idCategory:string, activate: boolean }  }


export const dataReducer = (state: DataState, action: DataActionType): DataState => {

    switch (action.type) {
        
        case '[Data] - Load Categories':
            return {
                ...state,
                categories: [...action.payload ]
            }

        case '[Data] - Add New Category':
            return {
                ...state,
                categories: [ action.payload, ...state.categories ]
            }

        case '[Data] - Update Category':
            return {
                ...state,
                categories: state.categories.map( category =>  category._id === action.payload._id ? action.payload : category )
            }

        case '[Data] - Delete Category':
            return {
                ...state,
                categories: state.categories.filter( category =>  category._id !== action.payload )
            }
            
        // Pages
        case '[Data] - Load Pages':
            return {
                ...state,
                pages: [...state.pages, ...action.payload ]
            }

        case '[Data] - Add New Page':
            return {
                ...state,
                pages: [ ...state.pages, action.payload ]
            }

        case '[Data] - Update Page':
            return {
                ...state,
                pages: state.pages.map( page => page._id === action.payload._id ? action.payload : page ) 
            }
        
        case '[Data] - Delete Page':
            return {
                ...state,
                pages: state.pages.filter( page => page._id !== action.payload ) 
            }
        
        // Groups
        case '[Data] - Load Groups':
            return {
                ...state,
                groups: [ ...state.groups, ...action.payload ]
            }
                    
        case '[Data] - Add New Group':
            return {
                ...state,
                groups: [ ...state.groups, action.payload ]
            }
        case '[Data] - Update Group':
            return {
                ...state,
                groups: state.groups.map( group => group._id === action.payload._id ? action.payload : group )
            }

        case '[Data] - Delete Group':
            return {
                ...state,
                groups: state.groups.filter( group => group._id !== action.payload )
            }

        // Sections TODO:
        case '[Data] - Load Sections':
            return {
                ...state,
                sections: [ ...state.sections, ...action.payload ]
            }

        case '[Data] - Add New Section':
            return {
                ...state,
                sections: [...state.sections, action.payload]
            }

        // Reset groups
        case '[Data] - Reset Groups Of Pages':
            return {
                ...state,
                pages: [ ...action.payload ]
            }

        case '[Data] - Toggle Active Groups':
            return {
                ...state,
                groups: state.groups.map( group => group.category === action.payload.idCategory ? ({ ...group, active: action.payload.activate }) : group )
            }

        default:
            return state
    }
}