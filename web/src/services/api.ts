import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, AuthResponse } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const syncToken = urlParams ? (urlParams.get('sync_token') || urlParams.get('token')) : null;
  const token = syncToken || localStorage.getItem('jobtrack_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Do not attempt refresh on authentication endpoints
    const requestUrl = originalRequest.url || '';
    if (
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/google')
    ) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('jobtrack_refresh_token');
    if (!refreshToken) {
      localStorage.removeItem('jobtrack_access_token');
      localStorage.removeItem('jobtrack_refresh_token');
      localStorage.removeItem('jobtrack_user');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
      // Use raw axios call to bypass api interceptor
      const refreshResponse = await axios.post<ApiResponse<AuthResponse>>(
        `${baseURL}/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (refreshResponse.data?.success && refreshResponse.data.data?.accessToken) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = refreshResponse.data.data;
        localStorage.setItem('jobtrack_access_token', newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('jobtrack_refresh_token', newRefreshToken);
        }
        if (user) {
          localStorage.setItem('jobtrack_user', JSON.stringify(user));
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } else {
        throw new Error('Refresh response missing token data');
      }
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      localStorage.removeItem('jobtrack_access_token');
      localStorage.removeItem('jobtrack_refresh_token');
      localStorage.removeItem('jobtrack_user');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
