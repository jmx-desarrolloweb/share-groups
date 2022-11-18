import { useRouter } from 'next/router';
import { LayoutApp } from '../../components/layouts';
import { NavBar } from '../../components/ui';
import { useEffect, useState } from 'react';
import { useData } from '../../hooks/useData';
import { ICategory } from '../../interfaces';




const CategoryPage = () => {

    const [category, setCategory] = useState<ICategory | null>(null)

    const router = useRouter()
    const { query } = router
    
    const { categories } =  useData()

    useEffect(()=> {

        if(categories.length === 0 || !query.slug){ return }

        const categoryTemp = categories.find( cat => ( cat.slug === query.slug ) )

        if(!categoryTemp){
            router.replace('/')
        }else {
            setCategory(categoryTemp)
        }
        
    },[query, categories])
    
    return (
        <LayoutApp>
            <NavBar />
            {
                !category
                ? <div>cargando...</div>
                : (
                    <main>
                        <h1 className='text-2xl font-bold'>
                            Share <a href="https://nextjs.org" className='text-sky-500'>{ query.slug }</a>
                        </h1>
                    </main>
                )
            }
        </LayoutApp>
    )
}

export default CategoryPage
