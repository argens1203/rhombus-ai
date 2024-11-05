import { RefObject, useEffect } from 'react';

import { useAppSelector } from '../../redux';

import { parseValue } from './item.util';

export const useGetType = (attr: string) =>
    useAppSelector((state) => state.item.types[attr]);

export const useGetValue = (id: number, attr: string) => {
    const type = useGetType(attr);
    const value = useAppSelector((state) => state.item.value[id][attr]);
    return parseValue(type, value);
};
export const useIsLoading = () => useAppSelector((state) => state.item.loading);

export const useClickOutside = (
    ref: RefObject<HTMLElement | undefined>,
    callback: () => void
) => {
    const handleClick = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    });
};
