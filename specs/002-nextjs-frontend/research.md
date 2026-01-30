# Research: Next.js Frontend with Better Auth

**Feature Branch**: `002-nextjs-frontend`
**Date**: 2026-01-15
**Status**: Complete

## Research Tasks

### 1. Better Auth JWT Plugin Configuration

**Decision**: Use Better Auth with JWT plugin for session management and token issuance

**Rationale**:
- Better Auth is the specified authentication library in the project constitution
- JWT plugin enables stateless authentication required for backend API integration
- Shared secret approach (BETTER_AUTH_SECRET) allows backend to verify tokens without session database lookup

**Implementation Notes**:
```typescript
// Server-side configuration (lib/auth.ts)
import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';

export const auth = betterAuth({
  database: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL!,
  },
  plugins: [
    jwt({
      secret: process.env.BETTER_AUTH_SECRET!,
      expiresIn: '7d',
    }),
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
});

// Client-side usage
import { createAuthClient } from 'better-auth/client';
export const authClient = createAuthClient();
```

**Alternatives Considered**:
- NextAuth.js: More complex setup, overkill for simple email/password auth
- Custom JWT implementation: Higher security risk, more code to maintain
- Session-only auth: Would require session store access from backend

---

### 2. Token Storage Strategy

**Decision**: Use localStorage for JWT token persistence

**Rationale**:
- Simpler implementation for SPA pattern
- Token accessible for manual inclusion in API requests
- Meets spec requirement for session persistence across browser sessions
- Backend API expects Bearer token in Authorization header

**Security Considerations**:
- XSS vulnerability: Mitigated by React's built-in escaping
- Token expiry: 7 days (per constitution)
- Clear token on logout and 401 response

**Implementation Pattern**:
```typescript
// lib/token.ts
const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
```

**Alternatives Considered**:
- HTTP-only cookies: More secure but complex for cross-origin API calls
- Session storage: Doesn't persist across browser sessions (spec requirement)
- In-memory only: Lost on page refresh (poor UX)

---

### 3. Next.js 16+ App Router Patterns

**Decision**: Use App Router with client components for interactive pages

**Rationale**:
- App Router is required by spec (Next.js 16+ constraint)
- Client components needed for auth state, form handling, API calls
- Server components for layout and static content

**Patterns Identified**:

1. **Protected Routes**: Client-side redirect using useAuth hook
2. **Form Pages**: 'use client' directive for React Hook Form integration
3. **Layout**: Server component with client AuthProvider child

**Route Structure**:
```
app/
├── layout.tsx        # Server component, wraps AuthProvider
├── page.tsx          # Server component, redirect logic
├── login/page.tsx    # Client component
├── signup/page.tsx   # Client component
├── dashboard/page.tsx # Client component (protected)
└── tasks/
    ├── new/page.tsx  # Client component (protected)
    └── [id]/page.tsx # Client component (protected)
```

**Alternatives Considered**:
- Pages Router: Deprecated pattern, not allowed by spec
- All Server Components: Not compatible with client-side auth state
- All Client Components: Loses SSR benefits for initial load

---

### 4. React Hook Form Integration

**Decision**: Use React Hook Form for all form handling

**Rationale**:
- Cleaner validation than native form handling
- Built-in error state management
- Reduced re-renders compared to controlled inputs
- Compatible with TypeScript strict mode

**Form Patterns**:
```typescript
// AuthForm pattern
import { useForm } from 'react-hook-form';

interface AuthFormData {
  email: string;
  password: string;
}

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthFormData>();

  const onSubmit = async (data: AuthFormData) => {
    // Call auth API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
      {errors.email && <span>Valid email required</span>}

      <input {...register('password', { required: true, minLength: 8 })} type="password" />
      {errors.password && <span>Minimum 8 characters required</span>}

      <button disabled={isSubmitting}>
        {mode === 'login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
}
```

**Alternatives Considered**:
- Native form handling: More boilerplate, manual validation
- Formik: Heavier dependency, more complex API
- Controlled inputs: Too many re-renders

---

### 5. API Client Design

**Decision**: Custom fetch wrapper with automatic token attachment and 401 handling

**Rationale**:
- Native fetch API (no extra dependencies)
- Centralized token attachment
- Automatic redirect on 401 (token expired/invalid)
- Type-safe with generics

**Implementation**:
```typescript
// lib/api-client.ts
import { getToken, removeToken } from './token';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    removeToken();
    window.location.href = '/login?error=session_expired';
    throw new ApiError(401, 'Session expired');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(res.status, error.detail || 'An error occurred');
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}
```

**Alternatives Considered**:
- Axios: Extra dependency, not needed for this scope
- SWR/React Query: Caching not required, adds complexity
- Fetch without wrapper: Repeated code, no centralized error handling

---

### 6. Component Architecture

**Decision**: Composition-based components with single responsibility

**Rationale**:
- Follows React best practices
- Easier to test individual components
- Clear data flow from props

**Component Hierarchy**:
```
AuthProvider (context)
├── ProtectedRoute (HOC for auth check)
├── AuthForm (reusable for login/signup)
├── TaskList (container)
│   ├── TaskFilters (filter controls)
│   └── TaskCard (presentational)
├── TaskForm (reusable for create/edit)
└── UI Components (Button, Input, Card, Dialog, Select)
```

**State Management**:
- Auth state: React Context (useAuth hook)
- Task data: Local state in pages (useTasks hook)
- Form state: React Hook Form
- UI state: Local component state

**Alternatives Considered**:
- Redux: Overkill, violates spec constraint
- Zustand: Extra dependency, not needed
- Prop drilling: Works for this scope, context only for auth

---

### 7. Styling Approach

**Decision**: Tailwind CSS with utility-first approach

**Rationale**:
- Required by spec constraints
- Fast iteration without CSS files
- Built-in responsive utilities
- Consistent design system

**Patterns**:
```typescript
// Button component pattern
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({ variant = 'primary', size = 'md', isLoading, children, ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-lg font-medium transition-colors disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </button>
  );
}
```

**Responsive Breakpoints**:
- Mobile: default (320px+)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)
- Wide: `xl:` (1280px+)

---

### 8. Testing Strategy

**Decision**: Vitest for unit tests, Playwright for E2E

**Rationale**:
- Vitest: Fast, Vite-native, good React Testing Library integration
- Playwright: Cross-browser E2E, better than Cypress for modern web apps

**Test Categories**:
1. Component tests: Render, props, user interactions
2. Hook tests: State changes, API calls (mocked)
3. E2E tests: Full user flows

**Alternatives Considered**:
- Jest: Slower than Vitest, less modern
- Cypress: Heavier, less cross-browser support
- Testing Library alone: Missing E2E coverage

---

## Summary

All technical decisions align with:
- Constitution requirements (Type Safety, Security First, Clean Architecture)
- Spec constraints (Next.js 16+, TypeScript strict, Tailwind, no Redux)
- Backend API contract (OpenAPI from 001-backend-api)

No NEEDS CLARIFICATION items remain. Ready for Phase 1 design.
