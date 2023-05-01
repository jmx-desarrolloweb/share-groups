import { FC } from "react"
import { IGroup } from "../../interfaces"
import { CardGroup } from "./CardGroup"



interface Props {
    groups: IGroup[]
    categoryId: string
}

export const ListGroup:FC<Props> = ({ groups, categoryId }) => {
    return (
        <ul className="flex flex-col gap-2">
            {
                groups.map( group => {
                    return (
                        <CardGroup 
                            key={group._id} 
                            group={group}
                            categoryId={ categoryId }
                            classesName="border"
                        />
                    )
                })
            }
        </ul>
    )
}
