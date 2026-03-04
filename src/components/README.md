# Components

This directory contains reusable React components.

## Structure

- Each component should have its own directory
- Include component file, styles, tests, and types
- Use barrel exports (index.ts) for cleaner imports

## Example

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.module.css
│   ├── Button.test.tsx
│   └── index.ts
└── index.ts (barrel export)
```
