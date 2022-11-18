

import { ICategory } from '../../interfaces';
import { DataState } from './';


type DataActionType =
    | { type: '[Data] - load Categories', payload: ICategory[] }

export const dataReducer = (state: DataState, action: DataActionType): DataState => {

    switch (action.type) {
        case '[Data] - load Categories':
            return {
                ...state,
                categories: [...action.payload ]
            }
        default:
            return state
    }
}