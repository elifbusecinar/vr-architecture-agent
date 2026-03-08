import axios from 'axios';
import { config as apiConfig } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

const axiosInstance = axios.create({
    baseURL: apiConfig.api.baseURL,
    timeout: apiConfig.api.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('@access_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor for Refresh Token Flow
axiosInstance.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 array and original request wasn't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
        const requestUrl = originalRequest.url || '';
        const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => requestUrl.includes(ep));

        if (isAuthEndpoint) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const refreshToken = await AsyncStorage.getItem('@refresh_token');
            if (refreshToken) {
                // Try refresh using separate axios instance without interceptors
                const response = await axios.post(`${apiConfig.api.baseURL}/auth/refresh`, { refreshToken });
                const { accessToken, refreshToken: newRefreshToken } = response.data;

                await AsyncStorage.setItem('@access_token', accessToken);
                if (newRefreshToken) {
                    await AsyncStorage.setItem('@refresh_token', newRefreshToken);
                }

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }

                return axiosInstance(originalRequest);
            }
        } catch (refreshError) {
            // Refresh token failed, clean up and redirect to login
            await AsyncStorage.removeItem('@access_token');
            await AsyncStorage.removeItem('@refresh_token');
            router.replace('/login');
            return Promise.reject(refreshError);
        }

        // No refresh token available
        await AsyncStorage.removeItem('@access_token');
        await AsyncStorage.removeItem('@refresh_token');
        router.replace('/login');
    }

    return Promise.reject(error);
});

export default axiosInstance;
