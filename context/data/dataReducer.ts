

import { ICategory } from '../../interfaces';
import { DataState } from './';


type DataActionType =
    | { type: '[Data] - Load Categories', payload: ICategory[] }
    | { type: '[Data] - Add New Category', payload: ICategory }
    | { type: '[Data] - Update Category', payload: ICategory }
    | { type: '[Data] - Delete Category', payload: string }

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
        default:
            return state
    }
}