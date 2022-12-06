import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'

import { DataProvider } from '../context/data'
import { AuthProvider } from '../context/auth'

import 'boxicons/css/boxicons.min.css'
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <DataProvider>
                <>
                    <ToastContainer />
                    <Component {...pageProps} />
                </>
            </DataProvider>
        </AuthProvider>
    )
}
