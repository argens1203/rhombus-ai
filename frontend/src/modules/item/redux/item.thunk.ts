import { AppThunkDispatch } from '../../../redux/store';
import {
    getItemApi,
    updateItemApi,
    parseCsvApi,
    getAllItemsApi,
} from '../item.api';
import { Item } from '../item.type';

import { putStuff, setLoading, putType } from './item.slice';

export function updateItem(id: number, partial: Partial<Item>) {
    return async function (dispatch: AppThunkDispatch) {
        dispatch(setLoading(true));
        updateItemApi(id, partial)
            .catch(console.error)
            .then(() => getItemApi(id))
            .then((item) => {
                dispatch(putStuff({ id, item }));
            })

            .catch(console.error)
            .finally(() => dispatch(setLoading(false)));
    };
}

export function parseCsv(file: File) {
    return async function (dispatch: AppThunkDispatch) {
        dispatch(setLoading(true));
        parseCsvApi(file)
            .then((data) => {
                dispatch(putType(data));
            })
            .catch((err) => console.error(err))
            .finally(() => dispatch(setLoading(false)));

        dispatch(getData());
    };
}

export function getData() {
    return async function (dispatch: AppThunkDispatch) {
        dispatch(setLoading(true));
        getAllItemsApi()
            .then((data) => {
                data.forEach((item: { id: number } & Record<string, any>) => {
                    dispatch(putStuff({ id: item.id, item }));
                });
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };
}
