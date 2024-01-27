import axios from 'axios';
import { AUTH_RESPONSE_SCOPE } from '@/config';
import { API_PREFIX } from '@/config/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export const BASE_URL = `${API_URL}/${API_PREFIX}`;

const api = axios.create({
  baseURL: BASE_URL
});

api.interceptors.request.use(
  (config) => {
    const session = localStorage.getItem(AUTH_RESPONSE_SCOPE);
    const token = JSON.parse(session || '{}')?.jwt || '';

    if (
      token &&
      token !== 'undefined' &&
      typeof config.headers?.Authorization === 'undefined'
    ) {
      // @ts-ignore
      config.headers!['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const fetcher = (_config: string | { url: string; params: any }) => {
  const url = typeof _config === 'string' ? _config : _config?.url;
  const params = typeof _config === 'string' ? undefined : _config?.params;

  if (!url) return Promise.reject('No url provided');

  return api.get(url, { params }).then((res) => res.data);
};

export { api, fetcher };
