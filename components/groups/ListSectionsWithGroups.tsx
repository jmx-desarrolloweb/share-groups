import { FC } from "react"

import { ISectionWithGroups } from "../../interfaces"
import { CardSectionWithGroups } from "./CardSectionWithGroups"



interface Props {
    sections: ISectionWithGroups[]
    categoryId: string
}

export const ListSectionsWithGroups:FC<Props> = ({ sections, categoryId }) => {
    return (
        <>
            {
                sections.map(section => (
                    <CardSectionWithGroups key={ section._id }  section={section} categoryId={ categoryId } />
                ))
            }
        </>
    )
}
