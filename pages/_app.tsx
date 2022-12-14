import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'

import { AuthProvider } from '../context/auth'
import { UIProvider } from '../context/ui'
import { DataProvider } from '../context/data'

import 'boxicons/css/boxicons.min.css'
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <UIProvider>
                <DataProvider>
                    <>
                        <ToastContainer />
                        <Component {...pageProps} />
                    </>
                </DataProvider>
            </UIProvider>
        </AuthProvider>
    )
}
