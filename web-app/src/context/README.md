# Context

This directory contains React Context providers for global state management.

## Structure

- Each context should include:
  - Context creation
  - Provider component
  - Custom hook for consuming the context

## Example

```
context/
├── AuthContext/
│   ├── AuthContext.tsx
│   ├── AuthProvider.tsx
│   ├── useAuth.ts
│   └── index.ts
├── ThemeContext/
│   ├── ThemeContext.tsx
│   └── index.ts
└── index.ts (barrel export)
```

## Best Practices

- Always create a custom hook for consuming context
- Split large contexts into smaller, focused ones
- Consider using useReducer for complex state logic
- Memoize context values to prevent unnecessary re-renders
