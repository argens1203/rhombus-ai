import axios from 'axios';

import { BASE_URL } from '../config';

const path = '/users';
const instance = axios.create({ baseURL: BASE_URL });

export const getDataApi = async () => {
    return instance.get(path);
};

export const parseCsvApi = async (file: File) => {
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

export const getItemApi = async (id: number) => {
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
