import { FC, useState } from "react"
import { ISectionWithGroups } from "../../interfaces"
import { CardGroup } from "./CardGroup"


interface Props {
    section: ISectionWithGroups
    categoryId: string
}

export const CardSectionWithGroups: FC<Props> = ({ section, categoryId }) => {

    const [openGroups, setOpenGroups] = useState(false)


    return (
        <div key={section._id} className={`bg-white mb-3 ${openGroups ? 'h-auto shadow-lg' : 'h-22'}`}>
            <div className={`flex w-full justify-between items-center bg-white px-3 py-2 rounded border ${openGroups ? 'border-b' : ''}`}>
                <p className='font-bold text-xl text-center w-full py-3'>{section.title}</p>
                <div>
                    <button
                        onClick={() => setOpenGroups(!openGroups)}
                        disabled={section.groups!.length === 0}
                        className={`text-2xl p-1 hover:bg-slate-100 rounded`}
                    >
                        <i className={`bx bx-chevron-down transition-all ${false ? 'rotate-180' : ''}`}></i>
                    </button>
                </div>
            </div>
            <div className={`${openGroups ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
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
