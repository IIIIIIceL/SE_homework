import axios from 'axios';
import { getToken, clearToken } from '../utils/tokenManager';
import { API_BASE_URL, ENABLE_DEBUG } from '../config/env';

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: attach Authorization header
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (ENABLE_DEBUG) {
    console.debug('[http:request]', config.method?.toUpperCase(), config.baseURL, config.url);
  }
  return config;
});

// Response interceptor: handle 401/403 globally
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (!error.response) {
      error.message = error.code === 'ECONNABORTED' ? '请求超时，请稍后重试。' : '网络异常，请检查后端服务是否已启动。';
    }

    if (status === 401) {
      clearToken();
      window.location.href = '/login';
    } else if (status === 403) {
      window.location.href = '/unauthorized';
    }

    if (ENABLE_DEBUG) {
      console.debug('[http:error]', status || 'NETWORK', error.message);
    }

    return Promise.reject(error);
  }
);

export default http;
