# Hooks

This directory contains custom React hooks.

## Structure

- Each hook should be in its own file
- Follow the `use*` naming convention
- Include TypeScript types and JSDoc comments

## Example

```
hooks/
├── useAuth.ts
├── useLocalStorage.ts
├── useFetch.ts
└── index.ts (barrel export)
```

## Best Practices

- Keep hooks focused on a single responsibility
- Make hooks reusable and generic when possible
- Add proper error handling
