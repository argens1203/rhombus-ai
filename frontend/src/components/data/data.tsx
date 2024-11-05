import React from 'react';

import Table from 'react-bootstrap/Table';

import { useAppSelector } from '../../redux';
import { Item } from '../../redux/item.type';

import { Entry } from './data-cell';

export function Data() {
    const type = useAppSelector((state) => state.item.types);
    const data = useAppSelector((state) => state.item.value);
    console.log(data);
    console.log(type);

    const names = Object.keys(type);
    console.log('names', names);

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
                            {names.map((name: string, idx: number) => (
                                // eslint-disable-next-line
                                    <th key={idx}>{type[name]}</th>
                            ))}
                        </tr>
                        <tr>
                            {names.map((name: string) => (
                                <th key={name}>{name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(data).map((datum: Item) => (
                            <tr key={datum.id}>
                                {names.map((name: string) => (
                                    <Entry
                                        key={name}
                                        id={datum.id}
                                        attr={name}
                                    />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}
