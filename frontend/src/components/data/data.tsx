import React from 'react';

type Props = {
    data: any[];
    type: Record<string, any>;
};

export function Data({ data, type }: Props) {
    console.log(data);
    console.log(type);
    return <div />;
}
