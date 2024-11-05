import React from 'react';

import { useGetType, useGetValue } from './data-cell.hooks';
import { parseValue } from './data-cell.util';

type Prop = {
    id: number;
    attr: string;
};

export function EntryDisplay({ id, attr }: Prop) {
    const type = useGetType(attr);
    const value = useGetValue(id, attr);
    if (type === 'Datetime') return value.toLocaleString();
    if (type === 'Complex') {
        if (!value) return Number.NaN.toString();
        return value.toString();
    }
    return value !== null && value.toString();
}
