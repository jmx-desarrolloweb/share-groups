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

    const [loadingPages, setLoadingPages] = useState(false)

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

    const loadPages = async() => {
        if(!category?._id){ return }
        setLoadingPages(true)

        const { hasError, pagesResp } = await refreshPages(category?._id)
        if(!hasError) {
            setPagesOfCategory(pagesResp)
        }
        setLoadingPages(false)
    }


    useEffect(()=>{
        setLoadingPages(true)
        const pageByCategory = pages.filter( page => page.category === category?._id )
        
        if( pageByCategory.length === 0 ){            
            loadPages()
            return
        }

        setPagesOfCategory(pageByCategory)
        setLoadingPages(false)

        
    },[category?._id, pages])
    
    return (
        <LayoutApp>
            {
                !category
                ? (
                    <div className="h-screen w-full flex justify-center items-center">
                        <span className="loader"></span>
                    </div>
                )
                : (
                    <LayoutCategory category={category}>
                        {
                            loadingPages 
                            ?(
                                <div className="flex justify-center flex-col max-w-[600px] mx-auto">
                                    {
                                        [1,2,3,4,5].map( item => (
                                            <div key={item} className="border rounded-md py-2 px-5 w-full mx-auto bg-white flex justify-between items-center mb-3">
                                                <div className="rounded-full bg-slate-200 w-[64px] h-[64px]"></div>
                                                <div className="h-3 w-48 bg-slate-200 rounded"></div>
                                                <div className='flex items-center gap-2'>
                                                    <div className="h-4 w-4 bg-slate-200 rounded"></div>
                                                    <div className="h-4 w-4 bg-slate-200 rounded"></div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            ):(
                                <section className='max-w-[600px] mx-auto'>
                                    <ListPage 
                                        pages={pagesOfCategory}
                                        categoryId={category._id!}
                                    />
                                    <button
                                        onClick={()=>setShowForm(true)}
                                        className="group border-dashed border-2 border-slate-400 py-4 w-full flex justify-center items-center gap-4 mb-5 mt-3 rounded hover:border-slate-800 hover:cursor-pointer"
                                    >
                                        <div className='rounded-full h-12 w-12 flex justify-center items-center border border-slate-400 group-hover:border-slate-800'>
                                            <i className='bx bx-plus text-slate-400 group-hover:text-slate-800 text-2xl'></i>
                                        </div>
                                        <p className='text-slate-400 group-hover:text-slate-800 font-semibold'>Agregar página</p>
                                    </button>
                                </section>
                            )
                        }
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
