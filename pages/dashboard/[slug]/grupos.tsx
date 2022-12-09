import { SetStateAction, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useData } from '../../../hooks/useData'
import { LayoutApp, LayoutCategory } from '../../../components/layouts'

import { ICategory, IGroup } from '../../../interfaces'
import { ListGroup, ModalFormGroup } from '../../../components/groups'

const GruposPage = () => {

    const [category, setCategory] = useState<ICategory | null>(null)
    const [groupsOfCategory, setGroupsOfCategory] = useState<IGroup[]>([])
    const [showForm, setShowForm] = useState(false)

    const [loadingGroups, setLoadingGroups] = useState(false)

    const router = useRouter()
    const { query } = router
    
    const { categories, updating, groups, refreshGroups } =  useData()

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


    const loadGroups = async() => {

        if(!category?._id){ return }
        setLoadingGroups(true)

        const { hasError, groupsResp } = await refreshGroups(category?._id)

        if( !hasError ){
            setGroupsOfCategory( groupsResp )
        }

        setLoadingGroups(false)
    }

    useEffect(()=>{
        setLoadingGroups(true)

        const groupsByCategory = groups.filter( group => group.category === category?._id )

        if( groupsByCategory.length === 0 ){
            loadGroups()
            return
        }

        setGroupsOfCategory( groupsByCategory )
        setLoadingGroups(false)
        
    },[category?._id, groups])


    return (
        <LayoutApp>
            {
                !category 
                ? (
                    <div className="h-screen w-full flex justify-center items-center">
                        <span className="loader"></span>
                    </div>
                ):(
                    <LayoutCategory category={category}>
                        {
                            loadingGroups 
                            ?(
                                <div className="flex justify-center flex-col max-w-[600px] mx-auto">
                                    {
                                        [1,2,3,4,5].map( item => (
                                            <div key={item} className="border rounded-md py-2 px-3 w-full mx-auto bg-white flex justify-between items-center mb-3">
                                                <div className='flex items-center gap-2'>
                                                    <div className="rounded-full bg-slate-200 w-[48px] h-[48px]"></div>
                                                    <div className="h-3 w-48 bg-slate-200 rounded"></div>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className="h-8 w-8 bg-slate-200 rounded"></div>
                                                    <div className="h-8 w-8 bg-slate-200 rounded"></div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            ):(
                                <section className='max-w-[600px] mx-auto'>
                                    <ListGroup 
                                        groups={groupsOfCategory} 
                                        categoryId={ category._id! } 
                                    />
                                    <button
                                        onClick={()=>setShowForm(true)}
                                        className="group border-dashed border-2 border-slate-400 py-2 w-full flex justify-center items-center gap-4 mb-5 rounded hover:border-slate-800 hover:cursor-pointer"
                                    >
                                        <div className='rounded-full h-10 w-10 flex justify-center items-center border border-slate-400 group-hover:border-slate-800'>
                                            <i className='bx bx-plus text-slate-400 group-hover:text-slate-800 text-xl'></i>
                                        </div>
                                        <p className='text-slate-400 group-hover:text-slate-800 font-semibold'>Agregar grupo</p>
                                    </button>
                                </section>
                            )
                        }
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

export default GruposPage