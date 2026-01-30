# Quickstart: Backend API

**Feature Branch**: `001-backend-api`
**Date**: 2026-01-13

## Prerequisites

- Python 3.13+
- [UV package manager](https://github.com/astral-sh/uv)
- Neon PostgreSQL database (or local PostgreSQL for development)

## Project Setup

### 1. Initialize Project

```bash
# From repository root
cd backend

# Initialize UV project (if not exists)
uv init --name backend-api

# Install dependencies
uv add fastapi uvicorn sqlmodel asyncpg pyjwt python-dotenv

# Install dev dependencies
uv add --dev pytest pytest-asyncio httpx mypy ruff
```

### 2. Environment Configuration

Create `.env` file in `backend/` directory:

```bash
# Copy example and edit
cp .env.example .env
```

Required environment variables:

```env
# Neon PostgreSQL connection string
DATABASE_URL=postgresql+asyncpg://user:password@host.neon.tech/dbname?sslmode=require

# JWT verification secret (shared with frontend Better Auth)
BETTER_AUTH_SECRET=your-secret-key-min-32-characters

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

The database schema is created automatically on startup via SQLModel:

```python
# This runs on app startup (lifespan)
async with engine.begin() as conn:
    await conn.run_sync(SQLModel.metadata.create_all)
```

For Neon:
1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string (use pooled connection)
3. Add to `.env` as `DATABASE_URL`

## Running the Server

### Development Mode

```bash
# From backend/ directory
uv run uvicorn app.main:app --reload --port 8000
```

### Production Mode

```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Once running, access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Testing

### Run All Tests

```bash
uv run pytest tests/ -v
```

### Run with Coverage

```bash
uv run pytest tests/ -v --cov=app --cov-report=html
```

### Run Specific Test File

```bash
uv run pytest tests/test_tasks.py -v
uv run pytest tests/test_auth.py -v
```

## Code Quality

### Type Checking

```bash
uv run mypy app/
```

### Linting

```bash
uv run ruff check app/
uv run ruff format app/
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/{user_id}/tasks` | List all tasks for user |
| POST | `/api/{user_id}/tasks` | Create a new task |
| GET | `/api/{user_id}/tasks/{id}` | Get single task |
| PUT | `/api/{user_id}/tasks/{id}` | Update a task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete a task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion |

### Authentication

All endpoints require JWT token in Authorization header:

```bash
curl -X GET "http://localhost:8000/api/{user_id}/tasks" \
  -H "Authorization: Bearer <your-jwt-token>"
```

The `user_id` in the URL must match the `sub` claim in the JWT token.

## Example Requests

### Create Task

```bash
curl -X POST "http://localhost:8000/api/user123/tasks" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "high"
  }'
```

### List Tasks

```bash
curl -X GET "http://localhost:8000/api/user123/tasks" \
  -H "Authorization: Bearer <token>"
```

### Toggle Completion

```bash
curl -X PATCH "http://localhost:8000/api/user123/tasks/{task_id}/complete" \
  -H "Authorization: Bearer <token>"
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Settings from env vars
│   ├── database.py          # SQLModel engine setup
│   ├── models/
│   │   └── task.py          # Task SQLModel
│   ├── schemas/
│   │   └── task.py          # Pydantic DTOs
│   ├── routers/
│   │   └── tasks.py         # Task endpoints
│   ├── services/
│   │   └── task_service.py  # Business logic
│   ├── middleware/
│   │   └── auth.py          # JWT verification
│   └── utils/
│       └── jwt.py           # JWT helpers
├── tests/
│   ├── conftest.py          # Test fixtures
│   ├── test_tasks.py        # Task CRUD tests
│   └── test_auth.py         # Auth tests
├── pyproject.toml
├── .env.example
└── README.md
```

## Troubleshooting

### Connection Errors

- Verify `DATABASE_URL` format uses `postgresql+asyncpg://`
- Check Neon project is active (not suspended)
- Ensure `sslmode=require` is in connection string

### Auth Errors

- Verify `BETTER_AUTH_SECRET` matches frontend configuration
- Check JWT token is not expired
- Ensure `user_id` in URL matches token's `sub` claim

### Import Errors

- Run `uv sync` to install all dependencies
- Ensure Python 3.13+ is being used
