

import { ICategory } from '../../interfaces';
import { DataState } from './';


type DataActionType =
    | { type: '[Data] - Load Categories', payload: ICategory[] }
    | { type: '[Data] - Add New Categy', payload: ICategory }

export const dataReducer = (state: DataState, action: DataActionType): DataState => {

    switch (action.type) {
        case '[Data] - Load Categories':
            return {
                ...state,
                categories: [...action.payload ]
            }

        case '[Data] - Add New Categy':
            return {
                ...state,
                categories: [ ...state.categories, action.payload ]
            }
        default:
            return state
    }
}