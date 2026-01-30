# Quickstart: Next.js Frontend with Better Auth

**Feature Branch**: `002-nextjs-frontend`
**Date**: 2026-01-15

## Prerequisites

- Node.js 18+ installed
- Backend API running at `http://localhost:8000` (from 001-backend-api)
- PostgreSQL database for Better Auth (can use same Neon database)
- Git repository cloned

## Quick Setup

### 1. Create Next.js Project

```bash
# From repository root
npx create-next-app@latest frontend --typescript --tailwind --app --eslint --src-dir

cd frontend
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install better-auth react-hook-form lucide-react

# Dev dependencies (testing)
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test
```

### 3. Environment Configuration

Create `.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Configuration
BETTER_AUTH_SECRET=your-shared-secret-with-backend
DATABASE_URL=postgresql://user:password@host/database

# Optional: Better Auth URL (defaults to current origin)
BETTER_AUTH_URL=http://localhost:3000
```

**Important**: Use the same `BETTER_AUTH_SECRET` value as the backend for JWT verification.

### 4. TypeScript Configuration

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

Application will be available at `http://localhost:3000`.

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and configuration
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript interfaces
├── tests/                   # Test files
├── public/                  # Static assets
├── .env.local               # Environment variables
└── package.json
```

## Key Files to Create

### Authentication Setup

1. **`src/lib/auth.ts`** - Better Auth server configuration
2. **`src/lib/auth-client.ts`** - Client-side auth helpers
3. **`src/lib/token.ts`** - JWT token storage
4. **`src/hooks/useAuth.ts`** - Auth state hook

### API Integration

1. **`src/lib/api-client.ts`** - Fetch wrapper with Bearer token
2. **`src/hooks/useTasks.ts`** - Tasks CRUD operations

### Pages

1. **`src/app/page.tsx`** - Landing page with redirect
2. **`src/app/login/page.tsx`** - Login form
3. **`src/app/signup/page.tsx`** - Signup form
4. **`src/app/dashboard/page.tsx`** - Task list (protected)
5. **`src/app/tasks/new/page.tsx`** - Create task (protected)
6. **`src/app/tasks/[id]/page.tsx`** - Edit task (protected)

## Testing

### Unit Tests

```bash
# Run unit tests
npm run test

# Watch mode
npm run test:watch
```

### E2E Tests

```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e
```

## Development Workflow

1. **Start backend** (from 001-backend-api):
   ```bash
   cd backend && uv run uvicorn src.main:app --reload
   ```

2. **Start frontend**:
   ```bash
   cd frontend && npm run dev
   ```

3. **Open browser**: Navigate to `http://localhost:3000`

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler check |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |

## Troubleshooting

### CORS Issues

If you see CORS errors, ensure the backend has proper CORS configuration:

```python
# Backend main.py should include:
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Authentication Errors

1. **401 Unauthorized**: Check that `BETTER_AUTH_SECRET` matches between frontend and backend
2. **Token not persisting**: Verify localStorage is accessible (not in incognito with cookies blocked)
3. **Session expired**: Tokens expire after 7 days; user will be redirected to login

### API Connection

1. Verify backend is running: `curl http://localhost:8000/docs`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure no trailing slash in API URL

## Next Steps

After setup, implement features in this order:

1. **Phase 1**: Foundation (types, environment)
2. **Phase 2**: Authentication (Better Auth, login/signup)
3. **Phase 3**: API Integration (api-client, useTasks)
4. **Phase 4**: Task UI (components)
5. **Phase 5**: Pages (routes)
6. **Phase 6**: Testing

See `plan.md` for detailed implementation steps.
