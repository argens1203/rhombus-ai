import { useAppSelector } from '../../redux';

import { parseValue } from './data-cell.util';

export const useGetType = (attr: string) =>
    useAppSelector((state) => state.item.types[attr]);
export const useGetValue = (id: number, attr: string) => {
    const type = useGetType(attr);
    const value = useAppSelector((state) => state.item.value[id][attr]);
    return parseValue(type, value);
};
