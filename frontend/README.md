# Task Manager Frontend

A modern Next.js 16+ frontend for the Task Manager application, featuring user authentication with Better Auth and full task CRUD operations.

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Authentication**: Better Auth with JWT
- **Forms**: React Hook Form
- **Icons**: Lucide React

## Features

- User registration and login with JWT authentication
- Task management (create, view, edit, delete)
- Task completion toggle with optimistic updates
- Client-side filtering (all, pending, in progress, completed)
- Client-side sorting (by date, by priority)
- Responsive design (mobile, tablet, desktop)
- Protected routes with auth guards
- Session persistence via localStorage

## Prerequisites

- Node.js 18.17+
- npm or pnpm
- Backend API running (FastAPI)

## Getting Started

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

Copy the example environment file and update the values:

```bash
cp .env.local.example .env.local
```

Required environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |
| `BETTER_AUTH_SECRET` | Shared secret with backend (for JWT) | - |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `BETTER_AUTH_URL` | Frontend URL (optional) | `http://localhost:3000` |

### 3. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/auth/           # Better Auth API routes
│   │   ├── dashboard/          # Protected dashboard page
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── tasks/
│   │   │   ├── new/            # Create task page
│   │   │   └── [id]/           # Edit task page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── AuthForm.tsx        # Login/signup form
│   │   ├── TaskCard.tsx        # Task display card
│   │   ├── TaskFilters.tsx     # Filter/sort controls
│   │   ├── TaskForm.tsx        # Create/edit task form
│   │   ├── TaskList.tsx        # Task list container
│   │   ├── ProtectedRoute.tsx  # Auth guard wrapper
│   │   ├── LoadingSpinner.tsx  # Loading indicator
│   │   └── ErrorMessage.tsx    # Error display
│   ├── hooks/
│   │   ├── useAuth.ts          # Authentication hook
│   │   └── useTasks.ts         # Task CRUD hook
│   ├── lib/
│   │   ├── api-client.ts       # Fetch wrapper with auth
│   │   ├── auth.ts             # Better Auth server config
│   │   ├── auth-client.ts      # Better Auth client helpers
│   │   ├── token.ts            # JWT token storage
│   │   └── utils.ts            # Utility functions
│   └── types/
│       ├── index.ts            # Core types
│       └── api.ts              # API types
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the FastAPI backend via REST API:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/{user_id}/tasks` | GET | List user's tasks |
| `/api/{user_id}/tasks` | POST | Create new task |
| `/api/{user_id}/tasks/{id}` | GET | Get task details |
| `/api/{user_id}/tasks/{id}` | PUT | Update task |
| `/api/{user_id}/tasks/{id}` | DELETE | Delete task |
| `/api/{user_id}/tasks/{id}/complete` | PATCH | Toggle completion |

## Authentication Flow

1. User logs in via Better Auth on frontend
2. Better Auth issues JWT token
3. Token stored in localStorage
4. API requests include `Authorization: Bearer <token>` header
5. Backend validates token using shared secret
6. 401 responses trigger automatic redirect to login

## License

MIT
