import { FC, useReducer, useEffect } from 'react';
import { AuthContext, authReducer } from './';

import Cookies from 'js-cookie'

import { IUser } from '../../interfaces';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Props {
    children: JSX.Element
}

export interface AuthState {
    isLoggedIn: boolean
    user?: IUser
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}

const cookieAuthKey = 'share_groups_session_ef32f43613d682c33c56fae2d4ba528a'


export const AuthProvider: FC<Props> = ({ children }) => {

    const router = useRouter()

    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)


    useEffect(()=>{
        checkToken()
    },[])

    const checkToken = async() => {

        if( !Cookies.get(cookieAuthKey) ){ return }
    
        try {
            const { data } = await axios.get('/api/auth/validate-session')
            const { token, user } = data
            
            Cookies.set(cookieAuthKey, token)
            dispatch({ type: '[Auth] - Login', payload: user })
            
        } catch (error) {

            Cookies.remove(cookieAuthKey)
        }
        
}


    const loginUser = async ( email: string, password:string ):Promise<{ hasError: boolean, message?: string }> => {
        try {

            const { data } = await axios.post('/api/auth/login', { email, password })
            const { token, user } = data

            Cookies.set( cookieAuthKey, token)
            dispatch({ type: '[Auth] - Login', payload: user })

            return {
                hasError: false,
                message : undefined
            }

        } catch (error) {
            if( axios.isAxiosError( error ) ){
                const { message } = error.response?.data as {message : string}
                return {
                    hasError: true,
                    message
                }
            }
            
            return {
                hasError: true,
                message: 'Usuario y/o Contaseña no válidos'
            }
        }
    }


    const registerUser = async( name:string, email:string, password:string ):Promise<{ hasError: boolean, message?: string }> => {

        try {
            // TODO: implementa endpoint
            const { data } = await axios.post('/api/auth/register', { name, email, password })
            const { token, user } = data

            Cookies.set(cookieAuthKey, token)
            dispatch({ type: '[Auth] - Login', payload: user })

            return {
                hasError: false,
                message : undefined
            }
            
        } catch (error) {

            if( axios.isAxiosError( error ) ){
                const { message } = error.response?.data as {message : string}
                return {
                    hasError: true,
                    message
                }
            }
            
            return {
                hasError: true,
                message: 'No se pudo crear el usuario, intente de nuevo'
            }
        }

    }

    const logout = () => {
        Cookies.remove( cookieAuthKey )
        router.reload()
    }

    return (
        <AuthContext.Provider value={{
            ...state,
            loginUser,
            registerUser,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}