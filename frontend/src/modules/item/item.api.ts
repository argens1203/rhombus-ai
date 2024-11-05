import axios, { AxiosResponse } from 'axios';

import { BASE_URL } from '../../config';

import { Item } from './item.type';

const path = '/users';
const instance = axios.create({ baseURL: BASE_URL });
instance.interceptors.response.use((resp: AxiosResponse) => resp.data);

export const getAllItemsApi: () => Promise<Item[]> = async () => {
    return instance.get(path);
};

export const parseCsvApi: (
    file: File
) => Promise<Record<string, string>> = async (file: File) => {
    const url = `${path}/parse_csv`;
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
        },
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    return instance.post(url, formData, config);
};

export const getItemApi: (id: number) => Promise<Item> = async (id: number) => {
    const url = `${path}/${id}`;
    return instance.get(url);
};

export const updateItemApi = async (
    id: number,
    partial: Record<string, any>
) => {
    const url = `${path}/${id}`;
    return instance.put(url, partial);
};

export const createItemApi: () => Promise<Item> = async () => {
    const url = `${path}/create`;
    return instance.post(url);
};
