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
        // Cargardo... start

        const { hasError, groupsResp } = await refreshGroups(category?._id)

        if( !hasError ){
            setGroupsOfCategory( groupsResp )
        }
        // Cargardo... end
    }

    useEffect(()=>{

        const groupsByCategory = groups.filter( group => group.category === category?._id )

        if( groupsByCategory.length === 0 ){
            loadGroups()
            return
        }

        setGroupsOfCategory( groupsByCategory )
        
    },[category?._id, groups])


    return (
        <LayoutApp>
            {
                !category
                ? (
                    <div>cargando...</div>
                ):(
                    <LayoutCategory category={category}>
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