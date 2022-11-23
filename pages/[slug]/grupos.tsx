import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useData } from '../../hooks/useData'
import { LayoutApp, LayoutCategory } from '../../components/layouts'

import { ICategory } from '../../interfaces'

const Grupos = () => {

    const [category, setCategory] = useState<ICategory | null>(null)

    const router = useRouter()
    const { query } = router
    
    const { categories, updating } =  useData()

    useEffect(()=> {

        if(categories.length === 0 || !query.slug){ return }
        const categoryTemp = categories.find( cat => ( cat.slug === query.slug ) )

        if(updating){
            if(!categoryTemp){return}
            setCategory(categoryTemp)
            return
        }


        if(!categoryTemp){
            router.replace('/')
        }else {
            setCategory(categoryTemp)
        }
        
    },[query, categories])

    useEffect(()=>{
        // TODO: Load pages
        console.log('Cambio la categoría - Grupos', category);
        
    },[category?._id])


    return (
        <LayoutApp>
            {
                !category
                ? (
                    <div>cargando...</div>
                ):(
                    <LayoutCategory category={category}>
                        <p>content...</p>
                    </LayoutCategory>
                )
            }

        </LayoutApp>
    )
}

export default Grupos