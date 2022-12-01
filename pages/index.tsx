// import profilePic from '../../public/img/facebook-page.jpg'
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '../hooks/useAuth';
import { IUser } from '../interfaces';

const IniciarSesionPage = () => {

    const [loading, setLoading] = useState(false)
    const [msgError, setMsgError] = useState<string | undefined>()
    const router = useRouter()

    const { register, handleSubmit, formState:{ errors } } = useForm<IUser>()    
    const { loginUser } = useAuth()


    const onLoginSubmit = async( data:IUser ) => {

        setLoading(true)

        const { hasError, message } = await loginUser( data.email, data.password )

        if(hasError){
            setLoading(false)
            setMsgError(message)
            setTimeout(() => {
                setMsgError(undefined)
            }, 3000);
            return
        }

        router.replace('/dashboard')
    }

    return (
        <div className='h-screen'>
            <img 
                src="/img/bg-login.png"
                alt="bg login"
                className="absolute h-screen w-full object-cover"
            />
            <div className="relative flex justify-center items-center w-full h-full">
                <form 
                    onSubmit={ handleSubmit( onLoginSubmit ) }
                    className="relative sm:w-1/2 max-w-[500px] py-14 px-10 bg-white/60 border-2 border-white/75 rounded-2xl shadow-md backdrop-blur-md"
                >
                    <header className="mb-7">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3"><span className="text-indigo-600">Share</span> Groups</h1>
                        <p className="text-slate-500 font-medium">Lorem ipsum dolor sit amet consectetur adipisicing elit aspernatur.</p>
                    </header>
                    <div className="flex flex-col mb-5">
                        <label htmlFor="user" className="font-bold ml-1 text-slate-800 mb-1">Usuario</label>
                        <input 
                            type="text"
                            placeholder="Ingrese su usuario"
                            id="user"
                            className="bg-admin rounded-md flex-1 border p-3 hover:border-slate-800"
                            {...register('email', {
                                required: 'Ingrese su usuario'
                            })}
                        />
                        {
                            !!errors.email &&
                            <p className="text-sm text-red-600 ml-1">{ errors.email.message }</p>
                        }
                    </div>
                    <div className="flex flex-col mb-10">
                        <label htmlFor="password" className="font-bold ml-1 text-slate-800 mb-1">Password</label>
                        <input 
                            type="password"
                            placeholder="Ingrese su contraseña"
                            id="password"
                            className="bg-admin rounded-md flex-1 border p-3 hover:border-slate-800"
                            {...register('password', {
                                required: 'Ingrese su contraseña'
                            })}
                        />
                        {
                            !!errors.password &&
                            <p className="text-sm text-red-600 ml-1">{ errors.password.message }</p>
                        }
                    </div>
                    <button
                        type="submit"
                        value="Iniciar Sesión"
                        disabled={ loading }
                        className="uppercase font-bold text-white text-center py-3 w-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-md cursor-pointer hover:from-indigo-600 hover:to-blue-600 flex justify-center items-center disabled:from-indigo-300 disabled:to-blue-400 disabled:cursor-not-allowed"
                    >
                        { loading
                            ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4">
                                    </circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                            )
                            : 'Iniciar Sesión'
                        }
                    </button>
                    {
                        msgError &&
                        <div className="absolute -top-5 left-0 right-0 w-full shadow-lg flex p-4 mb-4 text-sm border border-red-400 text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                            <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                            <span className="sr-only">Info</span>
                            <div>
                                <span className="font-semibold">¡Error!</span> { msgError }
                            </div>
                        </div>
                    }
                </form>
            </div>

        </div>
    )
}

export default IniciarSesionPage