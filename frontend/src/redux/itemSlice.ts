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

const putTypeAction: CaseReducer<
    CounterState,
    PayloadAction<Record<string, any>>
> = (state, action) => {
    const types = action.payload;
    state.types = { id: 'Int', ...types };
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
