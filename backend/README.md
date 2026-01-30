# Backend API - Task Management REST API

FastAPI backend for task management with JWT authentication and Neon PostgreSQL.

## Prerequisites

- Python 3.13+
- [UV package manager](https://github.com/astral-sh/uv)
- Neon PostgreSQL database

## Setup

### 1. Install Dependencies

```bash
cd backend
uv sync --all-extras
```

### 2. Configure Environment

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | JWT secret (shared with frontend) |
| `FRONTEND_URL` | Frontend origin for CORS |

### 3. Run the Server

Development mode with auto-reload:

```bash
uv run uvicorn app.main:app --reload --port 8000
```

Production mode:

```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Once running, access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/{user_id}/tasks` | List all tasks |
| POST | `/api/{user_id}/tasks` | Create task |
| GET | `/api/{user_id}/tasks/{id}` | Get single task |
| PUT | `/api/{user_id}/tasks/{id}` | Update task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion |

## Example Requests

### Create Task

```bash
curl -X POST "http://localhost:8000/api/user123/tasks" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "priority": "high"}'
```

### List Tasks

```bash
curl "http://localhost:8000/api/user123/tasks" \
  -H "Authorization: Bearer <token>"
```

### Toggle Completion

```bash
curl -X PATCH "http://localhost:8000/api/user123/tasks/<task-id>/complete" \
  -H "Authorization: Bearer <token>"
```

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI app
│   ├── config.py         # Settings
│   ├── database.py       # DB connection
│   ├── models/           # SQLModel models
│   ├── schemas/          # Pydantic DTOs
│   ├── routers/          # API endpoints
│   ├── services/         # Business logic
│   ├── middleware/       # Auth
│   └── utils/            # JWT helpers
├── tests/
├── pyproject.toml
└── .env.example
```

## Development

### Type Checking

```bash
uv run mypy app/
```

### Linting

```bash
uv run ruff check app/
uv run ruff format app/
```

### Tests

```bash
uv run pytest tests/ -v
```
