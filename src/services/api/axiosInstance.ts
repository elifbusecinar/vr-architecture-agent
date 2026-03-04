import axios from 'axios';
import { config } from './config';
import { setupAuthInterceptor } from './interceptors/authInterceptor';
import { setupResponseInterceptor } from './interceptors/responseInterceptor';

/**
 * Axios instance with base configuration
 */
const axiosInstance = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup request interceptors
setupAuthInterceptor(axiosInstance);

// Setup response interceptors
setupResponseInterceptor(axiosInstance);

export default axiosInstance;
