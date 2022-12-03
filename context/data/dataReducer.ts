

import { DataState } from './';
import { ICategory, IPage } from '../../interfaces';


type DataActionType =
    | { type: '[Data] - Load Categories', payload: ICategory[] }
    | { type: '[Data] - Add New Category', payload: ICategory }
    | { type: '[Data] - Update Category', payload: ICategory }
    | { type: '[Data] - Delete Category', payload: string }
    | { type: '[Data] - Load Pages', payload: IPage[] }
    | { type: '[Data] - Add New Page', payload: IPage }

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
                categories: [ ...state.categories, action.payload ]
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

        default:
            return state
    }
}