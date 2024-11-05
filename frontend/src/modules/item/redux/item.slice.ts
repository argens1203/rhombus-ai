import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Item } from '../item.type';

type CounterState = {
    value: Record<number, Item>;
    types: Record<string, any>;
    loading: boolean;
};

const initialState: CounterState = {
    value: {},
    types: {},
    loading: false,
};

const putStuffAction: CaseReducer<
    CounterState,
    PayloadAction<{ id: number; item: Item }>
> = (state, action) => {
    const { id, item } = action.payload;
    state.value[id] = item;
};

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

const putTypeAction: CaseReducer<
    CounterState,
    PayloadAction<Record<string, string>>
> = (state, action) => {
    state.types = { id: 'Int' };

    const types = action.payload;
    Object.entries(types).forEach(([k, v]) => {
        state.types[k] = parseType(v);
    });
};

export const itemSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        putStuff: putStuffAction,
        putType: putTypeAction,
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { putStuff, putType, setLoading } = itemSlice.actions;

export const itemReducer = itemSlice.reducer;
