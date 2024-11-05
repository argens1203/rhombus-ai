import React from 'react';

import Complex from 'complex.js';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

import { useAppDispatch } from '../../../redux';
import { useGetType, useGetValue } from '../item.hook';
import { updateItem } from '../redux/item.thunk';

type Prop = {
    id: number;
    attr: string;
};

export function ItemCellEdit({ id, attr }: Prop) {
    const type = useGetType(attr);
    const value = useGetValue(id, attr);
    const dispatch = useAppDispatch();

    const update = (v: any) => {
        dispatch(updateItem(id, { [attr]: v }));
    };

    switch (type) {
        case 'Datetime':
            return (
                <Form.Control
                    type="date"
                    defaultValue={
                        value && `${value.year}-${value.month}-${value.day}`
                    }
                    onBlur={(e) => {
                        const date = e.target.value; // 2024-11-22
                        if (!date) return;
                        update(date);
                    }}
                />
            );
        case 'Int':
        case 'Float':
            return (
                <Form.Control
                    type="text"
                    defaultValue={value && value.toString()}
                    onBlur={(e) => {
                        const text = e.target.value;
                        if (!text) {
                            update(null);
                            return;
                        }
                        const val = Number(text);
                        if (Number.isNaN(val)) return;
                        update(val);
                    }}
                />
            );
        case 'Bool':
            return (
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {value !== null && value.toString()}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={() => {
                                update(true);
                            }}
                        >
                            True
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => {
                                update(false);
                            }}
                        >
                            False
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            );
        case 'Complex':
            return (
                <Form.Control
                    type="text"
                    defaultValue={!!value && value.toString()}
                    onBlur={(e) => {
                        const text = e.target.value;
                        if (!text) update(null);
                        console.log('is here?');
                        try {
                            const val = new Complex(text);
                            update(`(${val.re}+${val.im}j)`);
                        } catch (ex) {
                            console.error(ex);
                        }
                    }}
                />
            );
        default:
            if (type.includes('/')) {
                return (
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {value}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {type.split('/').map((opt: string) => (
                                <Dropdown.Item
                                    key={opt}
                                    onClick={() => {
                                        update(opt);
                                    }}
                                >
                                    {opt}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                );
            }
            return (
                <Form.Control
                    type="text"
                    defaultValue={value || ''}
                    onBlur={(e) => {
                        const text = e.target.value;
                        if (!text) update(null);
                        update(text);
                    }}
                />
            );
    }
}

// if is_complex_dtype(dtype):
// return 'Complex'
// if isinstance(dtype, pd.CategoricalDtype):
// return str(dtype.categories._data)
// if is_bool_dtype(dtype):
// return 'Bool'
// if is_integer_dtype(dtype):
// return 'Int'
// if is_float_dtype(dtype):
// return 'Float'
// if is_datetime64_any_dtype(dtype):
// return 'Datetime'
// return 'Str'
