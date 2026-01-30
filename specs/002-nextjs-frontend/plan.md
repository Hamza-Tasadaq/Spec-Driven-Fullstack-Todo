# Implementation Plan: Next.js Frontend with Better Auth

**Branch**: `002-nextjs-frontend` | **Date**: 2026-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-nextjs-frontend/spec.md`

## Summary

Build a responsive Next.js 16+ frontend application with Better Auth JWT authentication that integrates with the FastAPI backend API to provide complete task management functionality. The frontend handles user signup/signin, JWT token management, and full CRUD operations for tasks through a mobile-first responsive UI.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 16+, Better Auth, React Hook Form, Tailwind CSS, Lucide React
**Storage**: N/A (API handles persistence); localStorage for JWT tokens
**Testing**: Vitest + React Testing Library, Playwright (E2E)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge); responsive 320px-1920px
**Project Type**: Web application (frontend only)
**Performance Goals**: Task list load <2s, toggle response <500ms visual feedback
**Constraints**: No Redux/external state, client-side only, src-layout mandatory
**Scale/Scope**: Single user session, ~100 tasks typical, 1000 tasks max

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | PASS | All code generated via Claude Code agents |
| II. Clean Architecture | PASS | Frontend separate from backend, API communication only |
| III. Type Safety | PASS | TypeScript strict mode, Pydantic schemas mirrored |
| IV. Security First | PASS | JWT via Better Auth, Bearer tokens, 401 handling |
| V. API Contract | PASS | Consumes OpenAPI from 001-backend-api |

**src-layout mandatory**: PASS - `frontend/src/` structure used

## Project Structure

### Documentation (this feature)

```text
specs/002-nextjs-frontend/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API client types)
└── tasks.md             # Phase 2 output (/sp.tasks)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with AuthProvider
│   │   ├── page.tsx             # Landing page (redirect logic)
│   │   ├── login/
│   │   │   └── page.tsx         # Login form
│   │   ├── signup/
│   │   │   └── page.tsx         # Registration form
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Task list (protected)
│   │   └── tasks/
│   │       ├── new/
│   │       │   └── page.tsx     # Create task form
│   │       └── [id]/
│   │           └── page.tsx     # Edit task form
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dialog.tsx
│   │   │   └── Select.tsx
│   │   ├── AuthForm.tsx         # Reusable login/signup form
│   │   ├── TaskCard.tsx         # Single task display
│   │   ├── TaskList.tsx         # Task collection with filters
│   │   ├── TaskForm.tsx         # Create/edit task form
│   │   ├── TaskFilters.tsx      # Filter/sort controls
│   │   ├── ProtectedRoute.tsx   # Auth guard wrapper
│   │   ├── LoadingSpinner.tsx   # Loading indicator
│   │   └── ErrorMessage.tsx     # Error display
│   ├── lib/
│   │   ├── auth.ts              # Better Auth configuration
│   │   ├── auth-client.ts       # Client-side auth helpers
│   │   ├── token.ts             # JWT storage/retrieval
│   │   ├── api-client.ts        # API fetch wrapper
│   │   └── utils.ts             # Utility functions
│   ├── hooks/
│   │   ├── useAuth.ts           # Auth state hook
│   │   └── useTasks.ts          # Tasks CRUD hook
│   └── types/
│       ├── index.ts             # TypeScript interfaces
│       └── api.ts               # API response types
├── tests/
│   ├── components/
│   │   ├── AuthForm.test.tsx
│   │   ├── TaskCard.test.tsx
│   │   ├── TaskList.test.tsx
│   │   └── TaskForm.test.tsx
│   ├── hooks/
│   │   ├── useAuth.test.ts
│   │   └── useTasks.test.ts
│   └── e2e/
│       ├── auth.spec.ts
│       └── tasks.spec.ts
├── public/
├── .env.local.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── vitest.config.ts
```

**Structure Decision**: Web application (frontend only) with src-layout. Backend exists in separate `/backend` directory from 001-backend-api feature.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Router                       │
│                      (app/layout.tsx)                        │
│                    [AuthProvider Context]                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ Public Pages│   │ Auth Pages  │   │ Protected   │
│  (/)        │   │(/login)     │   │(/dashboard) │
│             │   │(/signup)    │   │(/tasks/*)   │
└─────────────┘   └──────┬──────┘   └──────┬──────┘
                         │                  │
                         ▼                  ▼
              ┌─────────────────────────────────────┐
              │          Better Auth                │
              │     (lib/auth.ts + JWT Plugin)      │
              │   [Handles signup/signin/session]   │
              └─────────────────┬───────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────────┐
              │          API Client                 │
              │   (lib/api-client.ts + Bearer)      │
              │  [Attaches JWT to all requests]     │
              └─────────────────┬───────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────────┐
              │       FastAPI Backend               │
              │    (http://localhost:8000)          │
              │  [From 001-backend-api feature]     │
              └─────────────────────────────────────┘
```

## Component Hierarchy

```
app/layout.tsx (AuthProvider)
├── app/page.tsx (Landing - redirect logic)
├── app/login/page.tsx
│   └── components/AuthForm.tsx (mode="login")
├── app/signup/page.tsx
│   └── components/AuthForm.tsx (mode="signup")
├── app/dashboard/page.tsx (ProtectedRoute)
│   ├── components/TaskFilters.tsx
│   └── components/TaskList.tsx
│       └── components/TaskCard.tsx
└── app/tasks/
    ├── new/page.tsx (ProtectedRoute)
    │   └── components/TaskForm.tsx (mode="create")
    └── [id]/page.tsx (ProtectedRoute)
        └── components/TaskForm.tsx (mode="edit")
```

## Implementation Phases

### Phase 1: Foundation

| Step | File | Purpose |
|------|------|---------|
| 1 | Initialize project | `npx create-next-app@latest frontend --typescript --tailwind --app --eslint` |
| 2 | `package.json` | Add dependencies: better-auth, react-hook-form, lucide-react |
| 3 | `tsconfig.json` | Enable strict mode, configure paths |
| 4 | `tailwind.config.ts` | Theme configuration |
| 5 | `src/types/index.ts` | Task, User, Priority, TaskStatus interfaces |
| 6 | `src/types/api.ts` | API request/response types |
| 7 | `.env.local.example` | Environment variable template |

### Phase 2: Authentication

| Step | File | Purpose |
|------|------|---------|
| 8 | `src/lib/auth.ts` | Better Auth server config + JWT plugin |
| 9 | `src/lib/auth-client.ts` | Client-side auth helpers |
| 10 | `src/lib/token.ts` | localStorage token get/set/remove |
| 11 | `src/hooks/useAuth.ts` | Auth state hook (user, login, logout, isLoading) |
| 12 | `src/components/AuthForm.tsx` | Reusable login/signup form |
| 13 | `src/app/login/page.tsx` | Login page |
| 14 | `src/app/signup/page.tsx` | Signup page |
| 15 | `src/components/ProtectedRoute.tsx` | Auth guard HOC |

### Phase 3: API Integration

| Step | File | Purpose |
|------|------|---------|
| 16 | `src/lib/api-client.ts` | Fetch wrapper with Bearer token, 401 handling |
| 17 | `src/hooks/useTasks.ts` | Tasks CRUD operations hook |

### Phase 4: Task UI Components

| Step | File | Purpose |
|------|------|---------|
| 18 | `src/components/ui/Button.tsx` | Reusable button |
| 19 | `src/components/ui/Input.tsx` | Form input |
| 20 | `src/components/ui/Card.tsx` | Card container |
| 21 | `src/components/ui/Dialog.tsx` | Confirmation dialog |
| 22 | `src/components/ui/Select.tsx` | Dropdown select |
| 23 | `src/components/LoadingSpinner.tsx` | Loading indicator |
| 24 | `src/components/ErrorMessage.tsx` | Error display |
| 25 | `src/components/TaskCard.tsx` | Single task with actions |
| 26 | `src/components/TaskFilters.tsx` | Filter/sort controls |
| 27 | `src/components/TaskList.tsx` | Task collection |
| 28 | `src/components/TaskForm.tsx` | Create/edit form |

### Phase 5: Pages

| Step | File | Purpose |
|------|------|---------|
| 29 | `src/app/layout.tsx` | Root layout with providers |
| 30 | `src/app/page.tsx` | Landing with redirect logic |
| 31 | `src/app/dashboard/page.tsx` | Task list page |
| 32 | `src/app/tasks/new/page.tsx` | Create task page |
| 33 | `src/app/tasks/[id]/page.tsx` | Edit task page |

### Phase 6: Polish & Testing

| Step | File | Purpose |
|------|------|---------|
| 34 | `vitest.config.ts` | Test configuration |
| 35 | `tests/components/*.test.tsx` | Component tests |
| 36 | `tests/hooks/*.test.ts` | Hook tests |
| 37 | `tests/e2e/*.spec.ts` | E2E tests |
| 38 | Update `README.md` | Documentation |

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State Management | React Hooks | Simplicity; no external deps; spec constraint |
| Token Storage | localStorage | SPA pattern; simpler than cookies for this scope |
| Styling | Tailwind CSS | Fast iteration; spec constraint |
| Data Fetching | fetch + custom hook | Native; no extra dependencies |
| Form Handling | React Hook Form | Better validation; cleaner code |
| Icons | Lucide React | Lightweight; consistent design |
| Routing | App Router | Next.js 16+ requirement; spec constraint |

## API Integration Details

### Backend Endpoints (from 001-backend-api)

| Method | Endpoint | Frontend Action |
|--------|----------|-----------------|
| GET | `/api/{user_id}/tasks` | List all tasks |
| POST | `/api/{user_id}/tasks` | Create task |
| GET | `/api/{user_id}/tasks/{task_id}` | Get single task |
| PUT | `/api/{user_id}/tasks/{task_id}` | Update task |
| DELETE | `/api/{user_id}/tasks/{task_id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{task_id}/complete` | Toggle complete |

### API Client Pattern

```typescript
// lib/api-client.ts pattern
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    window.location.href = '/login';
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'An error occurred');
  }

  return res.json();
}
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-shared-secret-with-backend
DATABASE_URL=postgresql://user:pass@host/db  # For Better Auth user storage
```

## Testing Strategy

### Unit Tests (Vitest + RTL)

| Test File | Coverage |
|-----------|----------|
| `AuthForm.test.tsx` | Form validation, submit callbacks |
| `TaskCard.test.tsx` | Renders task data, action buttons |
| `TaskList.test.tsx` | Maps tasks, empty state |
| `TaskForm.test.tsx` | Input handling, validation |
| `useAuth.test.ts` | Login/logout state changes |
| `useTasks.test.ts` | CRUD operation calls |

### E2E Tests (Playwright)

| Test File | Coverage |
|-----------|----------|
| `auth.spec.ts` | Signup → Login → Dashboard redirect |
| `tasks.spec.ts` | Create → View → Edit → Complete → Delete |

## Complexity Tracking

> No violations identified. All choices align with constitution.

| Check | Status |
|-------|--------|
| Max 3 projects | PASS (1 project: frontend) |
| No Repository pattern | PASS (direct API calls) |
| src-layout | PASS |
| No external state libs | PASS |
