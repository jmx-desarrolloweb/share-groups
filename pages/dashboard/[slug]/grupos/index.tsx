import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import { useData } from '../../../../hooks/useData'
import { LayoutApp, LayoutCategory } from '../../../../components/layouts'

import { ICategory, IGroup, ISection } from '../../../../interfaces'
import { CardGroup, ListGroup, ListSectionsWithGroups, ModalFormGroup } from '../../../../components/groups'

const GruposPage = () => {

    const [category, setCategory] = useState<ICategory | null>(null)
    const [groupsOfCategory, setGroupsOfCategory] = useState<IGroup[]>([])
    const [showForm, setShowForm] = useState(false)

    const [loadingGroups, setLoadingGroups] = useState(false)
    const [loadingToggleGroups, setLoadingToggleGroups] = useState(false)

    const [sectionsOfCategory, setSectionsOfCategory] = useState<ISection[]>([])

    const router = useRouter()
    const { query } = router
    
    const { categories, updating, groups, refreshGroups, toggleActiveGroups, /*  */ sections, refreshSections } =  useData()

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


    const loadSections = async() => {

        if(!category?._id){ return }
        setLoadingGroups( true )

        const { hasError, sectionsResp } = await refreshSections( category._id )
        
        if( !hasError ){
            setSectionsOfCategory( sectionsResp )
        }

        setLoadingGroups( false )
    }

    useEffect(()=> {
        setLoadingGroups(true)
        const sectionsByCategory = sections.filter( section => section.category?._id === category?._id )
        
        if(sectionsByCategory.length === 0){
            loadSections()
            return
        }
        setSectionsOfCategory(sectionsByCategory)
        setLoadingGroups(false)

    },[category?._id, sections])



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


    
    const sectionsWithGroups = useMemo( ()=> {
        return sectionsOfCategory.map( section => {
            const newSection = {
                ...section,
                groups: groupsOfCategory.filter( group => group.section === section._id )
            }            
            return newSection
        })
    }, [ sectionsOfCategory, groupsOfCategory ])   


    const onToggleActiveGroups = async( activate = true ) => {
        setLoadingToggleGroups(true)
        await toggleActiveGroups( category?._id!, activate )
        setLoadingToggleGroups(false)
    }


    return (
        <>
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
                                    <>
                                        <div className="max-w-[600px] mx-auto mt-10">
                                            <div className="flex justify-between flex-col sm:flex-row gap-4 mb-5">
                                                <button
                                                    disabled={loadingToggleGroups}
                                                    onClick={ ()=> router.push(`/dashboard/${category.slug}/grupos/secciones`) } 
                                                    className="w-full sm:w-auto font-semibold text-sm rounded-md py-2 px-5 transition-all text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-600 border border-blue-500">
                                                    Secciones
                                                </button>
                                                <div className='flex gap-4'>
                                                    <button 
                                                        disabled={loadingToggleGroups}
                                                        onClick={()=> onToggleActiveGroups( false )} 
                                                        className="w-full sm:w-auto font-semibold text-sm rounded-md py-3 px-5 bg-gradient-to-r from-gray-600 to-gray-500 text-white hover:from-gray-600 hover:to-gray-600">
                                                        Desactivar todos
                                                    </button>
                                                    <button
                                                        disabled={loadingToggleGroups} 
                                                        onClick={ ()=> onToggleActiveGroups( true ) } 
                                                        className="w-full sm:w-auto font-semibold text-sm rounded-md py-3 px-5 bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-600 hover:to-green-600">
                                                        Activar todos
                                                    </button>
                                                </div>
                                            </div>
                                            <section className='max-w-[600px] mx-auto'>
                                                <div className="mb-10">
                                                    <ListSectionsWithGroups sections={sectionsWithGroups} categoryId={category._id!} />
                                                </div>
                                                {
                                                    groupsOfCategory.filter( g => !g.section ).length > 0
                                                    && (
                                                        <>
                                                            <h2 className="font-bold text-xl mb-5">Grupos sin asignar</h2>
                                                            <ListGroup 
                                                                groups={groupsOfCategory.filter( g => !g.section )} 
                                                                categoryId={ category._id! } 
                                                            />
                                                        </>
                                                    )
                                                }
                                                <button
                                                    onClick={()=>setShowForm(true)}
                                                    className="group border-dashed border-2 border-slate-400 py-2 w-full flex justify-center items-center gap-4 mb-5 rounded hover:border-slate-800 hover:cursor-pointer mt-2"
                                                >
                                                    <div className='rounded-full h-10 w-10 flex justify-center items-center border border-slate-400 group-hover:border-slate-800'>
                                                        <i className='bx bx-plus text-slate-400 group-hover:text-slate-800 text-xl'></i>
                                                    </div>
                                                    <p className='text-slate-400 group-hover:text-slate-800 font-semibold'>Agregar grupo</p>
                                                </button>
                                            </section>
                                        </div>
                                    </>
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
                            {
                                loadingToggleGroups && (
                                    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                        <div className="fixed inset-0 bg-gray-500 bg-opacity-60 transition-opacity flex justify-center items-center">
                                            <svg className="animate-spin h-7 sm:h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4">
                                                </circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                </path>
                                            </svg>
                                        </div>
                                    </div>
                                )
                            }
                        </LayoutCategory>
                    )
                }

            </LayoutApp>
        </>
    )
}

export default GruposPage