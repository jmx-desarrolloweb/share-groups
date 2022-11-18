import NextLink from 'next/link'
import { useData } from '../../hooks/useData'


export const SiderBar = () => {

    const { categories } = useData()

    return (
        <div className="h-screen bg-white w-72 px-5 pt-5">
            <h1 className="font-bold py-5 text-center text-sky-800 uppercase mb-5 flex justify-center items-center gap-1">
                <i className='bx bxs-layer text-lg'></i> Share Groups
            </h1>
            <button className="w-full font-semibold text-sm rounded-md py-2 bg-indigo-600 text-white hover:shadow-lg hover:bg-indigo-700 transition-transform flex items-center justify-center gap-1">
                <i className='bx bx-plus text-lg'></i> List Group
            </button>
            <ul className='mt-10'>
                {
                    categories.map( category => (
                        <li key={category._id}>
                            <NextLink 
                                className='inline-block w-full py-3 px-3 rounded-md font-semibold hover:bg-sky-100 hover:text-sky-800' href={category.slug}>
                                { category.name }
                            </NextLink>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}
