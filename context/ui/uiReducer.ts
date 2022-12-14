import { UIState } from '.';


type UIActionType =
    | { type: '[UI] - Toggle SideMenu' }

export const uiReducer = (state: UIState, action: UIActionType): UIState => {

    switch (action.type) {

        case '[UI] - Toggle SideMenu':
            return {
                ...state,
                isSideMenuOpen: !state.isSideMenuOpen
            }

        default:
            return state
    }
}