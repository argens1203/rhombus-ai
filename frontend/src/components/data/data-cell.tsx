import React, { useState, RefObject, useEffect, useRef } from 'react';

import Complex from 'complex.js';
import { DateTime } from 'luxon';
import Form from 'react-bootstrap/Form';

import { useAppSelector } from '../../redux';

import { EntryDisplay } from './data-cell.display';
import { EntryEdit } from './data-cell.edit';
import { useGetType, useGetValue } from './data-cell.hooks';
import { parseValue } from './data-cell.util';

type Prop = {
    id: number;
    attr: string;
};

const useClickOutside = (
    ref: RefObject<HTMLElement | undefined>,
    callback: () => void
) => {
    const handleClick = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    });
};

function getParsedValue(type: string, value: any) {
    switch (type) {
        case 'Datetime':
            return DateTime.fromISO(value).toLocaleString();
        case 'Str':
            return value;
        case 'Complex':
            if (value.match(/.*nan.*/)) return Number.NaN.toString();
            const s = value.replace('j', 'i').replace('(', '').replace(')', '');
            console.log(s);
            return new Complex(s).toString();
        default:
            return value && value.toString();
    }
}

export function Entry({ id, attr }: Prop) {
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
                <EntryEdit id={id} attr={attr} />
            ) : (
                <EntryDisplay id={id} attr={attr} />
            )}
        </td>
    );
}
