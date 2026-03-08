import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { getRefreshToken, setAuthData } from './authInterceptor';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const setupErrorInterceptor = (axiosInstance: AxiosInstance) => {
  return async (error: any): Promise<any> => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error instanceof AxiosError && error.response?.status === 401 && !originalRequest._retry) {
      const requestUrl = originalRequest.url ?? '';
      const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => requestUrl.includes(ep));

      if (isAuthEndpoint) {
        const message = error.response?.data?.message || 'Authentication error.';
        return Promise.reject(new Error(message));
      }

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        originalRequest._retry = true;
        try {
          // Attempt refresh using a separate axios call
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken, expiry } = response.data;

          setAuthData(accessToken, newRefreshToken, expiry);

          // Update the original request's auth header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout
          // removeAuthToken();
          // window.location.href = '/login';
          return Promise.reject(new Error('Session expired. Please login again.'));
        }
      }

      // No refresh token, logout
      // removeAuthToken();
      // window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    // Handle other errors
    const data = error.response?.data;
    let message = data?.message || error.message || 'An error occurred';
    if (data?.error) message = `${message}: ${data.error}`;
    return Promise.reject(new Error(message));
  };
};

export const setupResponseInterceptor = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.response.use(responseInterceptor, setupErrorInterceptor(axiosInstance));
};
