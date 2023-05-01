import { FC, useState } from "react"
import { ISectionWithGroups } from "../../interfaces"
import { CardGroup } from "./CardGroup"
import { useData } from '../../hooks/useData';


interface Props {
    section: ISectionWithGroups
    categoryId: string
}

export const CardSectionWithGroups: FC<Props> = ({ section, categoryId }) => {

    const [openGroups, setOpenGroups] = useState(false)

    const [deactivating, setDeactivating] = useState(false)
    const [activating, setActivating] = useState(false)

    const  { toggleActiveGroups } = useData()
    

    const onToggleActiveGroups = async( active = true ) => {

        if( active ){
            setActivating(true)
        }else {
            setDeactivating(true)
        }

        await toggleActiveGroups( section.category?._id!, active, section._id, active )
        
        if( active ){
            setActivating(false)
        }else {
            setDeactivating(false)
        }         
    }


    return (
        <div key={section._id} className={`bg-white mb-3 ${openGroups && section.groups.length > 0 ? 'h-auto shadow-lg' : 'h-22'}`}>
            <div className={`flex w-full justify-between items-center bg-white px-3 py-2 rounded border ${openGroups ? 'border-b' : ''}`}>
                <p className='font-bold text-xl py-2'>{section.title} <small>({ section.groups.length })</small></p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={()=>onToggleActiveGroups(false)} 
                        disabled = { !section.groups.some( group => group.active ) || activating || deactivating } 
                        className='bg-gradient-to-r from-gray-600 to-gray-500 text-white hover:from-gray-600 hover:to-gray-600 hover:bg-slate-100 rounded active:scale-95 py-1 px-2 w-[32px] h-[32px] disabled:opacity-30 disabled:scale-100 disabled:shadow-inner disabled:hover:from-gray-600 disabled:hover:to-gray-500'
                    >
                        {
                            deactivating
                            ? <svg className="animate-spin h-5 w-[0.9rem] text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                            :<i className='bx bx-block' ></i>
                        }
                    </button>
                    <button
                        onClick={()=>onToggleActiveGroups()}
                        disabled = { !section.groups.some( group => !group.active ) || activating || deactivating } 
                        className='bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-600 hover:to-green-600 hover:bg-slate-100 rounded active:scale-95 p-1 px-2 w-[32px] h-[32px] disabled:opacity-30 disabled:scale-100 disabled:shadow-inner disabled:hover:from-green-600 disabled:hover:to-green-500'
                    >
                        {
                            activating
                            ? <svg className="animate-spin h-5 w-[0.9rem] text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                            : <i className='bx bx-check'></i>
                        }
                    </button>

                    <button
                        onClick={() => setOpenGroups(!openGroups)}
                        disabled={section.groups!.length === 0}
                        className={`text-2xl p-1 rounded ${ section.groups!.length === 0 ? 'disabled:hover:bg-none opacity-20': 'hover:bg-slate-100 cursor-pointer' }`}
                    >
                        <i className={`bx bx-chevron-down transition-all ${openGroups && section.groups.length > 0 ? 'rotate-180' : ''}`}></i>
                    </button>
                </div>
            </div>
            <div className={`${openGroups && section.groups.length > 0 ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                {
                    section.groups.map(group => (
                        <CardGroup 
                            key={group._id} 
                            group={group} 
                            categoryId={categoryId}
                            classesName="even:bg-gray-100"
                        />
                    ))
                }
            </div>
        </div>
    )
}
