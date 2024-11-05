import React, { useState, useRef } from 'react';

import { useClickOutside } from '../item.hook';

import { ItemCellDisplay } from './item-cell-display';
import { ItemCellEdit } from './item-cell-edit';

type Prop = {
    id: number;
    attr: string;
};

export function ItemCell({ id, attr }: Prop) {
    const [clicked, setClicked] = useState<boolean>(false);
    const ref = useRef<HTMLTableCellElement>(null);
    const onClickOutside = () => {
        console.log('outside');
        setClicked(false);
    };
    useClickOutside(ref, onClickOutside);

    const onClick = () => {
        if (attr !== 'id') setClicked(true);
    };
    return (
        // eslint-disable-next-line
        <td onClick={onClick} ref={ref}>
            {clicked ? (
                <ItemCellEdit id={id} attr={attr} />
            ) : (
                <ItemCellDisplay id={id} attr={attr} />
            )}
        </td>
    );
}
