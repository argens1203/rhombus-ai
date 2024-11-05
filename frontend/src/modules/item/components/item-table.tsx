import React from 'react';

import Table from 'react-bootstrap/Table';

import { useAppSelector } from '../../../redux';
import { Item } from '../item.type';

import { ItemCell } from './item-cell';

export function ItemTable() {
    const type = useAppSelector((state) => state.item.types);
    const data = useAppSelector((state) => state.item.value);

    const names = Object.keys(type);

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
                                    <ItemCell
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
