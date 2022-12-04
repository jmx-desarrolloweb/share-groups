import { FC } from "react"
import { IGroup } from "../../interfaces"
import { CardGroup } from "./CardGroup"



interface Props {
    groups: IGroup[]
}

export const ListGroup:FC<Props> = ({ groups }) => {
    return (
        <ul>
            {
                groups.map( group => {
                    return (
                        <CardGroup key={group._id} group={group} />
                    )
                })
            }
        </ul>
    )
}
