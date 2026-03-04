# Services

This directory contains service modules for external integrations and business logic.

## Structure

- API clients and HTTP request handlers
- Third-party service integrations
- Data transformation and business logic utilities

## Example

```
services/
├── api/
│   ├── client.ts
│   ├── endpoints.ts
│   └── index.ts
├── auth/
│   ├── authService.ts
│   └── index.ts
└── index.ts (barrel export)
```

## Best Practices

- Keep services stateless when possible
- Use proper error handling
- Add request/response type definitions
- Consider using axios or fetch with proper interceptors
