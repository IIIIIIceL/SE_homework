const fallbackApiBaseUrl = 'http://localhost:3001';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl).trim();
export const ENABLE_DEBUG = import.meta.env.VITE_ENABLE_DEBUG === 'true';
