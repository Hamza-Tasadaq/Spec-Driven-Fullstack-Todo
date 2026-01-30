---
id: "0001"
title: "Backend API Spec Creation"
stage: spec
date: 2026-01-12
surface: agent
model: claude-opus-4-5-20251101
feature: 001-backend-api
branch: 001-backend-api
user: app
command: /sp.specify
labels: ["backend-api", "fastapi", "sqlmodel", "neon", "jwt", "task-management"]
links:
  spec: specs/001-backend-api/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-backend-api/spec.md
  - specs/001-backend-api/checklists/requirements.md
tests:
  - null
---

## Prompt

/sp.specify
# Spec 1: Backend API - FastAPI + SQLModel + Neon PostgreSQL

## Target Audience
Developers building RESTful APIs with Python, requiring type-safe ORM and serverless database

## Focus
Create a secure, well-documented REST API for task management with PostgreSQL persistence

---

## Success Criteria
- [ ] FastAPI application runs without errors
- [ ] All 6 REST endpoints implemented and functional
- [ ] SQLModel models created with proper relationships
- [ ] Neon PostgreSQL connection established and working
- [ ] Database migrations working via SQLModel
- [ ] JWT middleware validates tokens on protected routes
- [ ] User ID from JWT matches URL parameter (prevents unauthorized access)
- [ ] OpenAPI docs available at `/docs`
- [ ] All endpoints return consistent JSON responses
- [ ] Environment variables used for database URL and secrets

---

## API Endpoints (Required)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/{user_id}/tasks` | List all tasks for user | Required |
| POST | `/api/{user_id}/tasks` | Create a new task | Required |
| GET | `/api/{user_id}/tasks/{id}` | Get single task details | Required |
| PUT | `/api/{user_id}/tasks/{id}` | Update a task | Required |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete a task | Required |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle task completion | Required |

---

## Data Models

### Task Model (SQLModel)
```python
class Task(SQLModel, table=True):
    id: uuid.UUID (primary key, auto-generated)
    user_id: str (required, indexed)
    title: str (required, max 100 chars)
    description: str | None (optional, max 500 chars)
    status: TaskStatus (enum: pending, in_progress, completed)
    priority: Priority (enum: low, medium, high)
    is_completed: bool (default: False)
    created_at: datetime (auto)
    updated_at: datetime (auto)
```

### Enums
```python
class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"

class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
```

---

## JWT Authentication Middleware

### Requirements
- Extract token from `Authorization: Bearer <token>` header
- Verify signature using `BETTER_AUTH_SECRET` environment variable
- Decode token to extract `user_id` (or `sub` claim)
- Compare decoded user_id with URL `{user_id}` parameter
- Return 401 if token missing, invalid, or user mismatch
- Attach verified user to request state

### Middleware Flow
```
Request → Extract Bearer Token → Verify JWT → Decode User ID →
Compare with URL user_id → Allow/Deny
```

---

## Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app, CORS, routes
│   ├── config.py            # Settings from env vars
│   ├── database.py          # Neon connection, engine
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py          # Task SQLModel
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── task.py          # Pydantic request/response
│   ├── routers/
│   │   ├── __init__.py
│   │   └── tasks.py         # Task CRUD endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   └── task_service.py  # Business logic
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── auth.py          # JWT verification
│   └── utils/
│       └── jwt.py           # JWT decode helper
├── tests/
│   └── test_tasks.py
├── pyproject.toml
├── .env.example
└── README.md
```

---

## Constraints
- Python 3.13+ with UV package manager
- No manual coding (Claude Code only)
- Environment variables for: `DATABASE_URL`, `BETTER_AUTH_SECRET`
- CORS enabled for frontend origin
- No direct database access from routes (use services layer)

---

## Not Building
- User registration/login endpoints (handled by Better Auth on frontend)
- Password hashing or session management
- File uploads or attachments
- Real-time updates (WebSockets)
- Rate limiting (Phase V concern)

---

## Environment Variables
```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
BETTER_AUTH_SECRET=shared-secret-with-frontend
FRONTEND_URL=http://localhost:3000
```

## Response snapshot

Created comprehensive specification for Backend API - Task Management REST API feature:
- Generated feature branch `001-backend-api` with spec directory
- Documented 6 user stories covering all CRUD operations with acceptance scenarios
- Defined 22 functional requirements for authentication, validation, and data handling
- Specified 10 measurable success criteria (technology-agnostic)
- Identified 7 edge cases with expected behaviors
- Documented assumptions about JWT tokens and Better Auth integration
- Created quality checklist with all items passing

## Outcome

- ✅ Impact: Feature specification created with full requirements coverage
- 🧪 Tests: No tests yet - spec phase complete
- 📁 Files: spec.md (186 lines), checklists/requirements.md
- 🔁 Next prompts: /sp.plan to generate architecture plan, /sp.clarify if questions arise
- 🧠 Reflection: User input was comprehensive, no clarifications needed

## Evaluation notes (flywheel)

- Failure modes observed: None - user provided detailed input with API endpoints, data models, and constraints
- Graders run and results (PASS/FAIL): Manual checklist validation - PASS (all items checked)
- Prompt variant (if applicable): Standard /sp.specify flow
- Next experiment (smallest change to try): N/A - proceed to planning phase
