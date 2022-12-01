import { FC } from 'react';
import { IPage } from '../../interfaces';
import { CardPage } from './CardPage';


interface Props {
    pages: IPage[]
}

export const ListPage: FC<Props> = ({ pages }) => {
    return (
        <div>
            {
                pages.map( page => {
                    return (
                        <CardPage key={page._id} page={page} />
                    )
                })
            }
        </div>
    )
}
