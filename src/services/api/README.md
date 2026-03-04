# API Service

This module provides a configured Axios instance with interceptors for authentication and error handling.

## Features

- ✅ Pre-configured Axios instance with base URL
- ✅ Automatic Bearer token injection
- ✅ 401 Unauthorized auto-logout
- ✅ Centralized error handling
- ✅ Environment-based configuration

## Usage

### Making API Requests

```typescript
import { axiosInstance } from '@/services/api';

// GET request
const response = await axiosInstance.get('/users');

// POST request
const response = await axiosInstance.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// PUT request
const response = await axiosInstance.put('/users/1', {
  name: 'Jane Doe',
});

// DELETE request
const response = await axiosInstance.delete('/users/1');
```

### Managing Authentication Token

```typescript
import { setAuthToken, getAuthToken, removeAuthToken } from '@/services/api';

// Set token after login
setAuthToken('your-jwt-token-here');

// Get current token
const token = getAuthToken();

// Remove token on logout
removeAuthToken();
```

## Interceptors

### Auth Interceptor (Request)

Automatically adds `Authorization: Bearer <token>` header to all requests if a token exists in localStorage.

### Response Interceptor

- **Success**: Passes through the response
- **401 Unauthorized**: Automatically removes token and redirects to `/login`
- **Other Errors**: Extracts error message and rejects with a formatted error

## Configuration

Set the API base URL in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

If not set, defaults to `http://localhost:8080/api`.

## File Structure

```
api/
├── config.ts                    # Configuration with env variables
├── axiosInstance.ts             # Main axios instance
├── interceptors/
│   ├── authInterceptor.ts       # Auth token injection
│   ├── responseInterceptor.ts   # Error handling & 401 logout
│   └── index.ts                 # Barrel export
├── index.ts                     # Barrel export
└── README.md                    # This file
```
