import axios from 'axios';

// Resolve API Base URL (supports both VITE_API_BASE_URL and VITE_API_URL, auto-appends /api if omitted)
const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api').trim();
let resolvedBaseUrl = rawBaseUrl.replace(/\/+$/, '');

if (resolvedBaseUrl && resolvedBaseUrl !== '/api') {
  if (!resolvedBaseUrl.endsWith('/api')) {
    resolvedBaseUrl += '/api';
  }
}

const api = axios.create({
  baseURL: resolvedBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lifelink_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle HTML responses when API base URL is unconfigured
api.interceptors.response.use(
  (response) => {
    if (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE html')) {
      console.warn('LifeLink API Warning: Received HTML fallback instead of JSON. Check that VITE_API_BASE_URL is configured on your deployment platform.');
      return Promise.reject(new Error('API returned HTML instead of JSON. Check VITE_API_BASE_URL.'));
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;
