import React from 'react';

import Complex from 'complex.js';
import { DateTime } from 'luxon';
import Table from 'react-bootstrap/Table';

import { useAppSelector } from '../../redux';

type Prop2 = {
    type: string;
    value: any;
};

function Entry({ type, value }: Prop2) {
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

export function Data() {
    const type = useAppSelector((state) => state.item.types);
    const data = useAppSelector((state) => state.item.value);
    console.log(data);
    console.log(type);
    return (
        <div>
            {data && type && (
                <Table
                    striped
                    bordered
                    hover
                    variant="dark"
                    style={{ fontSize: 20 }}
                >
                    <thead>
                        <tr>
                            {Object.values(type).map(
                                (t: string, idx: number) => (
                                    // eslint-disable-next-line
                                    <th key={idx}>{t}</th>
                                )
                            )}
                        </tr>
                        <tr>
                            {Object.keys(type).map((key: string) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(data).map(([id, d]) => (
                            <tr key={id}>
                                {Object.entries(d).map(
                                    ([key, val]: [string, any]) => (
                                        <td key={key}>
                                            <Entry
                                                type={type[key]}
                                                value={val}
                                            />
                                        </td>
                                    )
                                )}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}
