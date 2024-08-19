import { urls } from './endpoints';
const SERVER_URL: string | undefined = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

let tokenLocalStore: string | null = null;

if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');

  if (!token) {
    localStorage.removeItem('token');

    if (window.location.pathname !== urls.login && window.location.pathname !== urls.register) {
      window.location.href = urls.login;
    }
  }
  if (token) {
    tokenLocalStore = token;
  }
}

const globalConfig = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Token ${tokenLocalStore}`,
};

const request = (url: string, options: RequestInit) => {
  if (localStorage.getItem('token')) {
    if (typeof window !== 'undefined' && !!globalConfig) {
      const data = localStorage.getItem('token');

      if (data) {
        globalConfig.Authorization = `Bearer ${data}`;
      }
    }
    options.headers = globalConfig;
  }

  return fetch(`${SERVER_URL}${url}`, options)
    .then((response) => {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = urls.login;
      }
      return response;
    })
    .catch((error) => Promise.reject(error));
};

export const service = {
  get: (url: string, options?: RequestInit) => request(url, { method: 'GET', ...options }),
  post: (url: string, options?: RequestInit) => request(url, { method: 'POST', ...options }),
  put: (url: string, options?: RequestInit) => request(url, { method: 'PUT', ...options }),
  delete: (url: string, options?: RequestInit) => request(url, { method: 'DELETE', ...options }),
};
