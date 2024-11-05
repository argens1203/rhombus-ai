import { putStuff } from './itemSlice';
import { AppThunkDispatch } from './store';

const updateItemApi = async (id: number, action: Record<string, any>) => {};

export function updateItem(id: number, item: Record<string, any>) {
    return async function (dispatch: AppThunkDispatch) {
        // dispatch(setLoading(true));
        await updateItemApi(id, item).then(() => {
            putStuff({ id, item });
        });
    };
}
