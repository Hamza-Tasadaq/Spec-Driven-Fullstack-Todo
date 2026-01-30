# Implementation Plan: Backend API - Task Management REST API

**Branch**: `001-backend-api` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-backend-api/spec.md`

## Summary

Build a secure REST API for task management using FastAPI + SQLModel + Neon PostgreSQL. The API provides 6 CRUD endpoints for tasks, all protected by JWT authentication. The backend verifies JWT tokens issued by Better Auth (frontend) using a shared secret, ensuring users can only access their own tasks.

## Technical Context

**Language/Version**: Python 3.13+ with UV package manager
**Primary Dependencies**: FastAPI, SQLModel, asyncpg, PyJWT, python-dotenv, pydantic-settings
**Storage**: Neon Serverless PostgreSQL (connection pooling enabled)
**Testing**: pytest, pytest-asyncio, httpx (for async API tests)
**Target Platform**: Linux server (containerized deployment)
**Project Type**: Web backend service (backend-only, frontend separate)
**Performance Goals**: Standard web API (<500ms p95 latency under normal load)
**Constraints**: Serverless-compatible (connection pooling required), stateless JWT auth
**Scale/Scope**: Single-tenant per request, multi-user with data isolation by user_id

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | ✅ PASS | Feature has spec.md; implementation via Claude Code agents |
| II. Clean Architecture | ✅ PASS | Backend-only service with layers: routes → services → models |
| III. Type Safety | ✅ PASS | Python type hints + Pydantic/SQLModel for validation |
| IV. Security First | ✅ PASS | JWT auth, user_id verification, env vars for secrets |
| V. API Contract | ✅ PASS | RESTful /api/{user_id}/tasks pattern, OpenAPI at /docs |

**Additional Constitution Compliance:**
- src-layout mandatory: ✅ Using `backend/app/` structure per constitution
- Separation of concerns: ✅ routes → services → models (no direct DB in routes)
- Error format: ✅ `{ "detail": "message" }` pattern
- HTTP status codes: ✅ 200, 201, 204, 401, 404, 422 as specified

## Project Structure

### Documentation (this feature)

```text
specs/001-backend-api/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI spec)
│   └── openapi.yaml
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry, CORS, middleware registration
│   ├── config.py            # Pydantic Settings (env vars)
│   ├── database.py          # SQLModel engine, async session factory
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py          # Task SQLModel, TaskStatus/Priority enums
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── task.py          # TaskCreate, TaskUpdate, TaskResponse DTOs
│   ├── routers/
│   │   ├── __init__.py
│   │   └── tasks.py         # 6 task endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   └── task_service.py  # CRUD business logic
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── auth.py          # JWT verification dependency
│   └── utils/
│       ├── __init__.py
│       └── jwt.py           # JWT decode/verify helper
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Fixtures: test client, mock DB, mock JWT
│   ├── test_tasks.py        # Unit tests for CRUD
│   └── test_auth.py         # Integration tests for JWT middleware
├── pyproject.toml           # UV project config, dependencies
├── .env.example             # Template for required env vars
└── README.md                # Setup and run instructions
```

**Structure Decision**: Backend-only web service structure selected. Frontend is a separate Next.js project. This follows Constitution Principle II (Clean Architecture) for independently deployable services.

## Complexity Tracking

> No violations requiring justification. Architecture follows constitution guidelines.

## Implementation Phases

### Phase 1: Foundation
| File | Purpose | Dependencies |
|------|---------|--------------|
| `config.py` | Load DATABASE_URL, BETTER_AUTH_SECRET, FRONTEND_URL from env | None |
| `database.py` | Async SQLModel engine with Neon connection pooling | config |
| `models/task.py` | Task table with UUID pk, user_id, title, status, priority, timestamps | database |

### Phase 2: Core Logic
| File | Purpose | Dependencies |
|------|---------|--------------|
| `schemas/task.py` | TaskCreate, TaskUpdate, TaskResponse Pydantic schemas | models |
| `services/task_service.py` | CRUD operations with user_id filtering | models, database |
| `routers/tasks.py` | 6 REST endpoints under /api/{user_id}/tasks | services, schemas |

### Phase 3: Security
| File | Purpose | Dependencies |
|------|---------|--------------|
| `utils/jwt.py` | Decode JWT, extract user_id from sub claim | config (secret) |
| `middleware/auth.py` | FastAPI dependency: verify token, check user_id match | utils/jwt |
| `main.py` | App assembly: CORS, include router, lifespan for DB | all modules |

### Phase 4: Quality
| File | Purpose | Dependencies |
|------|---------|--------------|
| `tests/conftest.py` | pytest fixtures for test client, mock data | app |
| `tests/test_tasks.py` | Unit tests for all 6 endpoints | conftest |
| `tests/test_auth.py` | Auth integration tests (401 scenarios) | conftest |
| `.env.example` | Template with placeholder values | None |
| `README.md` | Setup instructions for UV, env vars, run commands | None |

## Key Technical Decisions

| Decision | Choice | Rationale | Alternatives Rejected |
|----------|--------|-----------|----------------------|
| ORM | SQLModel | Type safety, FastAPI integration, async support | SQLAlchemy (less typing), Django ORM (not FastAPI) |
| DB Driver | asyncpg | Async for FastAPI, Neon compatible | psycopg2 (sync blocks event loop) |
| JWT Library | PyJWT | Lightweight, decode-only needed | python-jose (heavier), authlib (overkill) |
| Auth Pattern | FastAPI Dependency | Clean, testable, per-route injection | Middleware (harder to test), manual (repetitive) |
| Soft Delete | No (hard delete) | Simplicity per constitution | Soft delete (complex queries, not required) |

## Testing Strategy

### Unit Tests (test_tasks.py)
| Test | Validates |
|------|-----------|
| `test_create_task_success` | 201 + task returned with generated ID |
| `test_create_task_missing_title` | 422 validation error |
| `test_get_tasks_returns_user_tasks` | Only authenticated user's tasks |
| `test_get_task_by_id_success` | Single task with all fields |
| `test_get_task_not_found` | 404 for non-existent ID |
| `test_update_task_partial` | PUT updates specified fields only |
| `test_delete_task_success` | 204 no content |
| `test_toggle_complete_on` | is_completed false → true |
| `test_toggle_complete_off` | is_completed true → false |

### Integration Tests (test_auth.py)
| Test | Validates |
|------|-----------|
| `test_no_token_returns_401` | Missing Authorization header |
| `test_invalid_token_returns_401` | Malformed/bad signature token |
| `test_expired_token_returns_401` | Token past expiry |
| `test_user_id_mismatch_returns_401` | URL user_id ≠ token user_id |
| `test_user_isolation` | User A cannot access User B's tasks |

## API Endpoints Summary

| Method | Endpoint | Success | Errors |
|--------|----------|---------|--------|
| GET | `/api/{user_id}/tasks` | 200 + list | 401 |
| POST | `/api/{user_id}/tasks` | 201 + task | 401, 422 |
| GET | `/api/{user_id}/tasks/{id}` | 200 + task | 401, 404 |
| PUT | `/api/{user_id}/tasks/{id}` | 200 + task | 401, 404, 422 |
| DELETE | `/api/{user_id}/tasks/{id}` | 204 | 401, 404 |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | 200 + task | 401, 404 |

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | Neon connection string | `postgresql+asyncpg://user:pass@host/db?sslmode=require` |
| `BETTER_AUTH_SECRET` | JWT verification secret (shared with frontend) | `your-secret-key-min-32-chars` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3000` |
