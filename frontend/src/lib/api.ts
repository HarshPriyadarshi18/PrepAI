import axios, { AxiosInstance } from 'axios';

export const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    // ignore
  }
  return config;
});

export default api;