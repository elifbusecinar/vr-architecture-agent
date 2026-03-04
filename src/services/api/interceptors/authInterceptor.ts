import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * Token storage key
 */
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const EXPIRES_KEY = 'auth_expires';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const setAuthData = (accessToken: string, refreshToken: string, expiry: string): void => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(EXPIRES_KEY, expiry);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
};

/**
 * Request interceptor to add auth token to headers
 */
const authTokenInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

/**
 * Setup authentication interceptor on axios instance
 */
export const setupAuthInterceptor = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.request.use(authTokenInterceptor, error => Promise.reject(error));
};
