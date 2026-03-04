# Frontend Source Structure

This document outlines the organization of the frontend source code.

## Directory Overview

```
src/
├── components/     # Reusable UI components
├── pages/          # Page-level route components
├── hooks/          # Custom React hooks
├── services/       # API clients and external services
├── context/        # React Context providers
├── assets/         # Static assets (images, fonts, etc.)
└── App.tsx         # Root application component
```

## Folder Purposes

### `/components`

Reusable React components that can be used across multiple pages. Each component should be self-contained with its own styles and tests.

**Example:** Button, Card, Modal, Navbar

### `/pages`

Page-level components that represent different routes in the application. These compose multiple components together.

**Example:** HomePage, DashboardPage, ProfilePage

### `/hooks`

Custom React hooks for shared stateful logic. Follow the `use*` naming convention.

**Example:** useAuth, useFetch, useLocalStorage

### `/services`

Service modules for external integrations, API calls, and business logic utilities.

**Example:** apiService, authService, storageService

### `/context`

React Context providers for global state management. Each context should include a provider and a custom hook.

**Example:** AuthContext, ThemeContext, UserContext

## Import Guidelines

Use barrel exports for cleaner imports:

```typescript
// ✅ Good - Using barrel exports
import { Button, Card } from '@/components';
import { HomePage } from '@/pages';
import { useAuth } from '@/hooks';

// ❌ Avoid - Direct file imports (when barrel export exists)
import Button from '@/components/Button/Button';
```

## Best Practices

1. **Keep it modular** - Each directory should have a single, clear responsibility
2. **Use TypeScript** - Add proper type definitions for all exports
3. **Document your code** - Add JSDoc comments for complex logic
4. **Follow naming conventions** - Use PascalCase for components, camelCase for hooks/services
5. **Write tests** - Include unit tests for components and utilities
6. **Keep it DRY** - Don't repeat yourself, extract reusable logic

## Adding New Code

When adding new files:

1. Place them in the appropriate directory
2. Create necessary subdirectories for complex modules
3. Update the barrel export (`index.ts`) in that directory
4. Add documentation if the module is non-trivial

---

For more details on each directory, see the README.md file in each folder.
