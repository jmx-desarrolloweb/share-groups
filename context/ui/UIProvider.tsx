import { FC, useReducer } from 'react';
import { UIContext, uiReducer } from './';


interface Props {
    children: JSX.Element
}

export interface UIState {
    isSideMenuOpen: boolean;
}

const UI_INITIAL_STATE: UIState = {
    isSideMenuOpen: false,
}


export const UIProvider: FC<Props> = ({ children }) => {


    const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE)

    const toggleSideMenu = () => {        
        dispatch({ type:'[UI] - Toggle SideMenu' })
    }


    return (
        <UIContext.Provider value={{
            ...state,
            toggleSideMenu
        }}>
            {children}
        </UIContext.Provider>
    )
}
