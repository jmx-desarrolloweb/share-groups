import { FC } from "react"
import { IPage } from "../../interfaces"


interface Props {
    page: IPage
}

export const CardPage: FC<Props> = ({ page }) => {
    return (
        <div>
            <header>
                <div>

                </div>
                <h3>{ page.name }</h3>
            </header>
            <div>

            </div>
        </div>
    )
}
