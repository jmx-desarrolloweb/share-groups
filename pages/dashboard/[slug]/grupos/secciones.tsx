import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import { useData } from "../../../../hooks/useData"

import { LayoutApp, LayoutCategory } from "../../../../components/layouts"
import { ListSection, ModalFormSection } from "../../../../components/sections"
import { ICategory, ISection } from "../../../../interfaces"



const SeccionesPage = () => {

    const [category, setCategory] = useState<ICategory | null>(null)
    const [sectionsOfCategory, setSectionsOfCategory] = useState<ISection[]>([])
    const [showForm, setShowForm] = useState(false)

    const [loadingSections, setLoadingSections] = useState(false)



    const router = useRouter()
    const { query } = router

    const { categories, updating, sections, refreshSections } = useData()


    useEffect(() => {

        if (categories.length === 0 || !query.slug) { return }
        const categoryTemp = categories.find(cat => (cat.slug === query.slug))

        if (updating) {
            if (!categoryTemp) { return }
            setCategory(categoryTemp)
            return
        }


        if (!categoryTemp) {
            router.replace('/')
        } else {
            setCategory(categoryTemp)
        }

    }, [query, categories])

    const loadSections = async() => {

        if(!category?._id){ return }

        setLoadingSections(true)

        const { hasError, sectionsResp } = await refreshSections(category?._id)

        if( !hasError ){
            setSectionsOfCategory( sectionsResp )
        }

        setLoadingSections(false)
    }

    useEffect(()=> {

        setLoadingSections(true)

        const sectionsByCategory = sections.filter( section => section.category?._id === category?._id )
        if( sectionsByCategory.length === 0 ){
            loadSections()
            return
        }

        setSectionsOfCategory( sectionsByCategory )
        setLoadingSections(false)
    },[ category?._id, sections ])


    return (
        <LayoutApp>
            {
                !category
                    ? (
                        <div className="h-screen w-full flex justify-center items-center">
                            <span className="loader"></span>
                        </div>
                    ) : (
                        <LayoutCategory category={category}>
                            <section className='max-w-[600px] mx-auto'>
                                <div className="flex gap-4 items-center py-5">
                                    <button
                                        onClick={()=> router.replace(`/dashboard/${category.slug}/grupos`) } 
                                        className="text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-600 font-bold text-sm py-1 px-2 border border-blue-500 rounded-md"
                                    >
                                            <i className='bx bx-arrow-back' ></i>
                                    </button>
                                    <h1 className="font-bold text-xl text-blue-700 uppercase">Secciones de grupos</h1>
                                </div>
                                <ListSection sections={ sectionsOfCategory } />
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="group border-dashed border-2 border-slate-400 py-2 w-full flex justify-center items-center gap-4 mb-5 rounded hover:border-slate-800 hover:cursor-pointer"
                                >
                                    <div className='rounded-full h-8 w-8 flex justify-center items-center border border-slate-400 group-hover:border-slate-800'>
                                        <i className='bx bx-plus text-slate-400 group-hover:text-slate-800 text-xl'></i>
                                    </div>
                                    <p className='text-slate-400 group-hover:text-slate-800 font-semibold cursor-pointer'>Agregar sección</p>
                                </button>
                            </section>
                            {
                                showForm && (
                                    <ModalFormSection
                                        category={category}
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

export default SeccionesPage
