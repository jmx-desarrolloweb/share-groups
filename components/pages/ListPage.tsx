import { FC } from 'react';
import { IPage } from '../../interfaces';
import { CardPage } from './CardPage';


interface Props {
    pages: IPage[]
    categoryId: string
}

export const ListPage: FC<Props> = ({ pages, categoryId }) => {
    return (
        <div>
            {
                pages.map( page => {
                    return (
                        <CardPage
                            key={page._id}
                            page={page}
                            categoryId={categoryId}
                        />
                    )
                })
            }
        </div>
    )
}
