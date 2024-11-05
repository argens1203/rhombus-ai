import { configureStore, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { itemReducer } from './itemSlice';

export const store = configureStore({
    reducer: {
        item: itemReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppThunkDispatch<E = unknown> = ThunkDispatch<
    RootState,
    E,
    AnyAction
>;
