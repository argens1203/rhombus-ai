import { getItemApi, updateItemApi } from '../services/api';

import { Item } from './item.type';
import { putStuff, setLoading } from './itemSlice';
import { AppThunkDispatch } from './store';

export function updateItem(id: number, item: Partial<Item>) {
    return async function (dispatch: AppThunkDispatch) {
        dispatch(setLoading(true));
        await updateItemApi(id, item)
            .catch(console.error)
            .then(() => getItemApi(id))
            .then((res) => {
                console.log(res.data);
                dispatch(putStuff({ id, item: res.data }));
            })

            .catch(console.error)
            .finally(() => dispatch(setLoading(false)));
    };
}
