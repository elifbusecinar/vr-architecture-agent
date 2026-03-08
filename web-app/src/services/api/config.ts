/**
 * Application configuration
 * Environment variables with fallback defaults
 */

export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5201/api',
    timeout: 30000, // 30 seconds
  },
} as const;
