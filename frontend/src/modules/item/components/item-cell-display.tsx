import React from 'react';

import { useGetType, useGetValue } from '../item.hook';

type Prop = {
    id: number;
    attr: string;
};

export function ItemCellDisplay({ id, attr }: Prop) {
    const type = useGetType(attr);
    const value = useGetValue(id, attr);
    if (type === 'Datetime') return value?.toLocaleString();
    if (type === 'Complex') {
        if (!value) return Number.NaN.toString();
        return value.toString();
    }
    return value !== null && value.toString();
}
