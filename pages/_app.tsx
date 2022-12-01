import type { AppProps } from 'next/app'
import { DataProvider } from '../context/data'
import { AuthProvider } from '../context/auth'

import '../styles/globals.css'
import 'boxicons/css/boxicons.min.css'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <DataProvider>
          <Component {...pageProps} />
      </DataProvider>
    </AuthProvider>
  )
}
