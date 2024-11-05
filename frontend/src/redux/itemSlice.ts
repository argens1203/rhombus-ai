import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';

type CounterState = {
    value: Record<number, Record<string, any>>;
    types: Record<string, any>;
};

const initialState: CounterState = {
    value: {},
    types: {},
};

const putStuffAction: CaseReducer<
    CounterState,
    PayloadAction<{ id: number; item: Record<string, any> }>
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
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        putStuff: putStuffAction,
        putType: putTypeAction,
        // increment: (state) => {
        //     state.value += 1;
        // },
        // decrement: (state) => {
        //     state.value -= 1;
        // },
        // // Use the PayloadAction type to declare the contents of `action.payload`
        // incrementByAmount: (state, action: PayloadAction<number>) => {
        //     state.value += action.payload;
        // },
    },
});

export const { putStuff, putType } = itemSlice.actions;

export const itemReducer = itemSlice.reducer;
