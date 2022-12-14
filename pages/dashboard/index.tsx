import { LayoutApp } from '../../components/layouts'
import { useUI } from '../../hooks/useUI';




export default function Home() {

    const { toggleSideMenu } = useUI()

    return (
        <LayoutApp>
            <div className='w-full h-screen flex justify-center items-center'>
                <div className='flex flex-col items-center' onClick={toggleSideMenu}>
                    <i className='bx bxs-layer text-5xl sm:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-600'></i>
                    <h1 className='text-2xl sm:text-4xl font-bold uppercase text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-600'>
                        Share Groups
                    </h1>
                </div>

            </div>

        </LayoutApp>
    )
}
