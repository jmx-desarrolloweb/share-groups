import { SetStateAction, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useData } from '../../hooks/useData'
import { LayoutApp, LayoutCategory } from '../../components/layouts'

import { ICategory } from '../../interfaces'
import { ModalFormGroup } from '../../components/groups'

const Grupos = () => {

    const [category, setCategory] = useState<ICategory | null>(null)
    const [showForm, setShowForm] = useState(false)

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
                        <button
                        onClick={()=>setShowForm(true)}
                            className='bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 flex items-center justify-center rounded-lg p-1 text-3xl active:scale-95 fixed bottom-12 right-12'
                        >
                            <i className='bx bx-plus'></i>
                        </button>
                        {
                            showForm && (                                
                                <ModalFormGroup
                                    categoryId={ category._id! }
                                    setShowForm={ setShowForm }
                                />
                            )
                        }
                    </LayoutCategory>
                )
            }

        </LayoutApp>
    )
}

export default Grupos