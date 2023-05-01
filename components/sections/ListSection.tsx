import { FC } from 'react';
import { ISection } from '../../interfaces';
import { CardSection } from './CardSection';

interface Props {
    sections: ISection[]
}

export const ListSection:FC<Props> = ({ sections }) => {
    return (
        <ul>
            {
                sections.map( section => (
                    <CardSection key={ section._id } section={ section } />
                ))
            }
        </ul>
    )
}
