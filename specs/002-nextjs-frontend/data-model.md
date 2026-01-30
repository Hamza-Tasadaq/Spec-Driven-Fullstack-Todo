# Data Model: Next.js Frontend

**Feature Branch**: `002-nextjs-frontend`
**Date**: 2026-01-15
**Status**: Complete

## Overview

The frontend does not manage its own database schema. This document defines the TypeScript interfaces that mirror the backend API contracts from `001-backend-api`.

## TypeScript Interfaces

### Enums

```typescript
// types/index.ts

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type Priority = 'low' | 'medium' | 'high';
```

### Core Entities

#### Task

Mirrors the backend Task entity from the API response.

```typescript
// types/index.ts

export interface Task {
  id: string;                    // UUID
  user_id: string;               // Owner's user ID
  title: string;                 // 1-100 chars, required
  description: string | null;    // 0-500 chars, optional
  status: TaskStatus;            // pending | in_progress | completed
  priority: Priority;            // low | medium | high
  is_completed: boolean;         // Completion flag
  created_at: string;            // ISO 8601 datetime
  updated_at: string;            // ISO 8601 datetime
}
```

#### User (Better Auth)

User entity managed by Better Auth. Frontend receives user data from auth session.

```typescript
// types/index.ts

export interface User {
  id: string;                    // User ID (used in API paths)
  email: string;                 // User email
  name?: string;                 // Optional display name
  emailVerified?: boolean;       // Email verification status
  createdAt?: string;            // Account creation date
  updatedAt?: string;            // Last update date
}
```

#### Session

Auth session containing user and JWT token.

```typescript
// types/index.ts

export interface Session {
  user: User;
  token: string;                 // JWT token for API calls
  expiresAt: string;             // Token expiration datetime
}
```

## API Request/Response Types

### Task Operations

```typescript
// types/api.ts

/** POST /api/{user_id}/tasks */
export interface TaskCreateRequest {
  title: string;                 // Required, 1-100 chars
  description?: string | null;   // Optional, 0-500 chars
  status?: TaskStatus;           // Optional, defaults to 'pending'
  priority?: Priority;           // Optional, defaults to 'medium'
}

/** PUT /api/{user_id}/tasks/{task_id} */
export interface TaskUpdateRequest {
  title?: string;                // Optional, 1-100 chars
  description?: string | null;   // Optional, 0-500 chars
  status?: TaskStatus;           // Optional
  priority?: Priority;           // Optional
  is_completed?: boolean;        // Optional
}

/** API Response wrapper for task operations */
export type TaskResponse = Task;

/** API Response for task list */
export type TaskListResponse = Task[];
```

### Error Responses

```typescript
// types/api.ts

/** Standard error response format */
export interface ApiError {
  detail: string;
}

/** Validation error response format */
export interface ValidationError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}
```

### Auth Types

```typescript
// types/api.ts

/** Login request */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Signup request */
export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

/** Auth response from Better Auth */
export interface AuthResponse {
  user: User;
  session: Session;
}
```

## State Types

### UI State

```typescript
// types/index.ts

/** Filter state for task list */
export interface TaskFilters {
  status: 'all' | TaskStatus;
  sortBy: 'created_at' | 'priority';
  sortOrder: 'asc' | 'desc';
}

/** Auth context state */
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/** Form state for task operations */
export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
}
```

## Type Mappings

### Backend to Frontend

| Backend (Python) | Frontend (TypeScript) |
|------------------|----------------------|
| `UUID` | `string` |
| `str` | `string` |
| `Optional[str]` | `string \| null` |
| `bool` | `boolean` |
| `datetime` | `string` (ISO 8601) |
| `TaskStatus` (Enum) | `TaskStatus` (union type) |
| `Priority` (Enum) | `Priority` (union type) |

### Validation Rules

| Field | Backend Rule | Frontend Validation |
|-------|-------------|---------------------|
| `title` | 1-100 chars, required | `required`, `maxLength: 100`, `minLength: 1` |
| `description` | 0-500 chars, optional | `maxLength: 500` |
| `email` | Valid email format | `pattern: /^\S+@\S+$/i` |
| `password` | Min 8 chars | `minLength: 8` |

## Type Exports

### File: `types/index.ts`

```typescript
// Enums
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type Priority = 'low' | 'medium' | 'high';

// Entities
export interface Task { ... }
export interface User { ... }
export interface Session { ... }

// UI State
export interface TaskFilters { ... }
export interface AuthState { ... }
export interface TaskFormData { ... }
```

### File: `types/api.ts`

```typescript
// Request types
export interface TaskCreateRequest { ... }
export interface TaskUpdateRequest { ... }
export interface LoginRequest { ... }
export interface SignupRequest { ... }

// Response types
export type TaskResponse = Task;
export type TaskListResponse = Task[];
export interface AuthResponse { ... }

// Error types
export interface ApiError { ... }
export interface ValidationError { ... }
```

## Notes

- All datetime fields are ISO 8601 strings (e.g., `2026-01-15T10:30:00Z`)
- UUIDs are represented as strings (no UUID type in TypeScript)
- Nullable fields use `| null` union type
- Optional request fields use `?` property modifier
