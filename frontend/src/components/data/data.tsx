import React from 'react';

import Complex from 'complex.js';
import { DateTime } from 'luxon';
import Table from 'react-bootstrap/Table';

type Props = {
    data: any[];
    type: Record<string, any>;
};

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

function parseType(type: string) {
    if (type.includes('[') && type.includes(']')) {
        return type
            .replace('[', '')
            .replace(']', '')
            .replace(/'/gi, '')
            .split(' ')
            .join('/');
    }
    return type;
}

export function Data({ data, type }: Props) {
    console.log(data);
    console.log(type);
    return (
        <div>
            {data && data.length > 0 && type && (
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
                                    <th key={idx}>{parseType(t)}</th>
                                )
                            )}
                        </tr>
                        <tr>
                            <th>id</th>
                            {Object.keys(type).map((key: string) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((d) => (
                            <tr>
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
