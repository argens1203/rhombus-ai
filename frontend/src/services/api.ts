import axios from 'axios';

import { BASE_URL } from '../config';

const path = '/users';
const instance = axios.create({ baseURL: BASE_URL });
export const getDataApi = async () => {
    return instance.get(path);
};

// export const
