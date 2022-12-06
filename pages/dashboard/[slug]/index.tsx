import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { LayoutApp, LayoutCategory } from '../../../components/layouts';
import { useData } from '../../../hooks/useData';

import { ICategory, IPage } from '../../../interfaces';
import { ListPage, ModalFormPage } from '../../../components/pages';




const CategoryPage = () => {

    const [category, setCategory] = useState<ICategory | null>(null)
    const [pagesOfCategory, setPagesOfCategory] = useState<IPage[]>([])
    const [showForm, setShowForm] = useState(false)

    const router = useRouter()
    const { query } = router
    
    const { categories, updating, pages, refreshPages } =  useData()

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

    // TODO: Loading para cargar páginas
    const loadPages = async() => {
        if(!category?._id){ return }
        // Cargardo... start
        const { hasError, pagesResp } = await refreshPages(category?._id)
        if(!hasError) {
            setPagesOfCategory(pagesResp)
        }
        // Cargardo... end
    }


    useEffect(()=>{

        const pageByCategory = pages.filter( page => page.category === category?._id )
        
        if( pageByCategory.length === 0 ){            
            loadPages()
            return
        }

        setPagesOfCategory(pageByCategory)
        
    },[category?._id, pages])
    
    return (
        <LayoutApp>
            {
                !category
                ? <div>cargando...</div>
                : (
                    <LayoutCategory category={category}>
                        <section className='max-w-[600px] mx-auto'>
                            <ListPage 
                                pages={pagesOfCategory}
                                categoryId={category._id!}
                            />
                            <button
                                onClick={()=>setShowForm(true)}
                                className="group border-dashed border-2 border-slate-400 py-4 w-full flex justify-center items-center gap-4 mb-5 rounded hover:border-slate-800 hover:cursor-pointer"
                            >
                                <div className='rounded-full h-12 w-12 flex justify-center items-center border border-slate-400 group-hover:border-slate-800'>
                                    <i className='bx bx-plus text-slate-400 group-hover:text-slate-800 text-2xl'></i>
                                </div>
                                <p className='text-slate-400 group-hover:text-slate-800 font-semibold'>Agregar página</p>
                            </button>
                        </section>
                        {
                            showForm && (
                                <ModalFormPage 
                                    categoryId={category._id!}
                                    setShowForm={setShowForm}
                                />
                            )
                        }
                    </LayoutCategory>
                )
            }
        </LayoutApp>
    )
}

export default CategoryPage
