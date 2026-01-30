# Feature Specification: Backend API - Task Management REST API

**Feature Branch**: `001-backend-api`
**Created**: 2026-01-12
**Status**: Draft
**Input**: User description: "Create a secure, well-documented REST API for task management with PostgreSQL persistence using FastAPI + SQLModel + Neon PostgreSQL"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authenticated User Creates a Task (Priority: P1)

An authenticated user wants to create a new task in their personal task list. They provide a title, optional description, priority level, and status. The system stores the task and returns confirmation with the task details.

**Why this priority**: Task creation is the foundational operation - without it, no other task management features have meaning. This is the core value proposition of the API.

**Independent Test**: Can be fully tested by sending a POST request with valid JWT token and task data, then verifying the task is created and returned with all fields populated including auto-generated ID and timestamps.

**Acceptance Scenarios**:

1. **Given** an authenticated user with valid JWT token, **When** they send a POST request with title "Buy groceries" and priority "high", **Then** the system creates the task and returns 201 status with task details including generated UUID and timestamps
2. **Given** an authenticated user with valid JWT token, **When** they send a POST request without a title, **Then** the system returns 422 validation error with clear message about required fields
3. **Given** a request without JWT token, **When** attempting to create a task, **Then** the system returns 401 unauthorized error

---

### User Story 2 - Authenticated User Retrieves Their Tasks (Priority: P1)

An authenticated user wants to view all their tasks. The system returns only tasks belonging to that specific user, ensuring data isolation between users.

**Why this priority**: Viewing tasks is essential for any task management - users must see what they've created. This also validates the user isolation security model.

**Independent Test**: Can be fully tested by creating tasks for a user, then requesting their task list and verifying only their tasks are returned, not tasks from other users.

**Acceptance Scenarios**:

1. **Given** an authenticated user with 3 existing tasks, **When** they request their task list, **Then** the system returns all 3 tasks with complete details
2. **Given** an authenticated user with no tasks, **When** they request their task list, **Then** the system returns an empty list with 200 status
3. **Given** user A has tasks and user B requests tasks, **When** user B authenticates and requests their tasks, **Then** user B receives only their own tasks (not user A's)

---

### User Story 3 - Authenticated User Updates a Task (Priority: P2)

An authenticated user wants to modify an existing task's details such as title, description, priority, or status. The system updates only the specified fields while preserving others.

**Why this priority**: Updating tasks is critical for task management workflow - priorities change, descriptions need refinement, and status progresses. Slightly lower priority than create/read as it builds on those foundations.

**Independent Test**: Can be fully tested by creating a task, sending a PUT request with updated fields, then verifying the task reflects changes while unchanged fields remain intact.

**Acceptance Scenarios**:

1. **Given** an authenticated user with an existing task, **When** they update the title and priority, **Then** the system updates those fields, preserves other fields, updates the updated_at timestamp, and returns 200 with updated task
2. **Given** an authenticated user, **When** they attempt to update a task belonging to another user, **Then** the system returns 401 unauthorized error
3. **Given** an authenticated user, **When** they attempt to update a non-existent task, **Then** the system returns 404 not found error

---

### User Story 4 - Authenticated User Toggles Task Completion (Priority: P2)

An authenticated user wants to mark a task as complete or incomplete. This is a quick action separate from full task update, optimized for the common use case of checking off tasks.

**Why this priority**: Task completion is the primary indicator of productivity. A dedicated endpoint makes this frequent operation efficient and explicit.

**Independent Test**: Can be fully tested by creating a task with is_completed=false, toggling it via PATCH, verifying it becomes true, then toggling again to verify it returns to false.

**Acceptance Scenarios**:

1. **Given** an authenticated user with an incomplete task, **When** they toggle completion, **Then** the system sets is_completed to true and returns 200 with updated task
2. **Given** an authenticated user with a completed task, **When** they toggle completion, **Then** the system sets is_completed to false and returns 200 with updated task
3. **Given** an authenticated user, **When** they toggle completion on another user's task, **Then** the system returns 401 unauthorized error

---

### User Story 5 - Authenticated User Retrieves Single Task (Priority: P2)

An authenticated user wants to view the details of a specific task by its ID. This enables deep-linking to individual tasks and fetching fresh data for a task detail view.

**Why this priority**: Single task retrieval supports detail views and task-specific operations. Important but builds on the list functionality.

**Independent Test**: Can be fully tested by creating a task, requesting it by ID, and verifying all task fields are returned correctly.

**Acceptance Scenarios**:

1. **Given** an authenticated user with an existing task, **When** they request that task by ID, **Then** the system returns 200 with complete task details
2. **Given** an authenticated user, **When** they request a task that doesn't exist, **Then** the system returns 404 not found error
3. **Given** an authenticated user, **When** they request another user's task by ID, **Then** the system returns 401 unauthorized error

---

### User Story 6 - Authenticated User Deletes a Task (Priority: P3)

An authenticated user wants to permanently remove a task from their list. The system deletes the task and confirms the deletion.

**Why this priority**: While important for cleanup, deletion is less frequent than other operations. Users typically complete tasks rather than delete them.

**Independent Test**: Can be fully tested by creating a task, deleting it via DELETE request, then verifying the task no longer exists when fetching the task list.

**Acceptance Scenarios**:

1. **Given** an authenticated user with an existing task, **When** they delete that task, **Then** the system removes the task and returns 204 no content
2. **Given** an authenticated user, **When** they attempt to delete a non-existent task, **Then** the system returns 404 not found error
3. **Given** an authenticated user, **When** they attempt to delete another user's task, **Then** the system returns 401 unauthorized error

---

### Edge Cases

- What happens when a user provides a title exceeding 100 characters? System returns 422 validation error with field length constraint message.
- What happens when a user provides a description exceeding 500 characters? System returns 422 validation error with field length constraint message.
- What happens when JWT token is expired? System returns 401 unauthorized with "token expired" message.
- What happens when JWT token is malformed? System returns 401 unauthorized with "invalid token" message.
- What happens when user_id in URL doesn't match user_id in JWT token? System returns 401 unauthorized error (prevents accessing other users' data).
- What happens when database connection fails? System returns 503 service unavailable with appropriate error message.
- What happens when invalid enum value is provided for status or priority? System returns 422 validation error listing valid enum values.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate all API requests using JWT tokens from the Authorization header
- **FR-002**: System MUST verify that the user_id in the JWT token matches the user_id in the URL path
- **FR-003**: System MUST return 401 unauthorized for missing, invalid, or mismatched authentication
- **FR-004**: System MUST support creating tasks with title (required), description (optional), status (enum), and priority (enum)
- **FR-005**: System MUST auto-generate UUID for task ID upon creation
- **FR-006**: System MUST auto-populate created_at timestamp on task creation
- **FR-007**: System MUST auto-update updated_at timestamp on any task modification
- **FR-008**: System MUST enforce title maximum length of 100 characters
- **FR-009**: System MUST enforce description maximum length of 500 characters
- **FR-010**: System MUST validate status values against allowed enum: pending, in_progress, completed
- **FR-011**: System MUST validate priority values against allowed enum: low, medium, high
- **FR-012**: System MUST default is_completed to false on task creation
- **FR-013**: System MUST default status to "pending" when not specified
- **FR-014**: System MUST default priority to "medium" when not specified
- **FR-015**: System MUST return only tasks belonging to the authenticated user when listing tasks
- **FR-016**: System MUST return 404 for operations on non-existent tasks
- **FR-017**: System MUST toggle is_completed boolean (true becomes false, false becomes true) via PATCH endpoint
- **FR-018**: System MUST return consistent JSON response format across all endpoints
- **FR-019**: System MUST provide OpenAPI documentation at /docs endpoint
- **FR-020**: System MUST use environment variables for database connection and secrets (no hardcoded credentials)
- **FR-021**: System MUST enable CORS for the configured frontend origin
- **FR-022**: System MUST persist all task data to PostgreSQL database

### Key Entities

- **Task**: Represents a user's task item. Contains identifier (UUID), ownership reference (user_id), content (title, description), state (status enum, is_completed boolean), priority level (priority enum), and temporal metadata (created_at, updated_at timestamps). Each task belongs to exactly one user.
- **User**: Referenced by user_id string from JWT token. Users are managed externally by Better Auth on the frontend; the backend only receives and validates the user identifier from JWT claims.

### Data Models

#### Task Model Datetime Handling

**CRITICAL**: Datetime fields must be consistent between Python code and PostgreSQL schema.

| Issue | Cause | Solution |
|-------|-------|----------|
| `asyncpg.exceptions.DataError: can't subtract offset-naive and offset-aware datetimes` | Python sends timezone-aware datetime, DB column is `TIMESTAMP WITHOUT TIME ZONE` | Use consistent timezone handling |

**Requirement**: Choose ONE approach and apply consistently:

**Option A - Timezone-Naive (Recommended for simplicity)**:
```python
# Python model
from datetime import datetime

created_at: datetime = Field(default_factory=datetime.utcnow)
updated_at: datetime = Field(default_factory=datetime.utcnow)
```
```sql
-- PostgreSQL column
created_at TIMESTAMP WITHOUT TIME ZONE
updated_at TIMESTAMP WITHOUT TIME ZONE
```

**Option B - Timezone-Aware (Recommended for production)**:
```python
# Python model
from datetime import datetime, timezone

created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```
```sql
-- PostgreSQL column
created_at TIMESTAMP WITH TIME ZONE
updated_at TIMESTAMP WITH TIME ZONE
```

**Known Issue**: If using SQLModel with `datetime.now(timezone.utc)` (aware), ensure the database column type is `TIMESTAMPTZ` (with timezone), not `TIMESTAMP` (without timezone). Mismatch causes 500 errors on INSERT.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 6 REST endpoints respond successfully to valid requests with correct status codes
- **SC-002**: API documentation is accessible and accurately describes all endpoints, request/response schemas, and authentication requirements
- **SC-003**: Authenticated users can only access their own tasks (100% data isolation between users)
- **SC-004**: All validation errors return clear, actionable messages indicating which field failed and why
- **SC-005**: Task creation, retrieval, and update operations complete within acceptable response times under normal load
- **SC-006**: System correctly rejects all unauthenticated requests with 401 status code
- **SC-007**: System correctly rejects requests where JWT user_id doesn't match URL user_id with 401 status code
- **SC-008**: All task data persists correctly to database and survives application restarts
- **SC-009**: API follows RESTful conventions for HTTP methods and status codes
- **SC-010**: Environment configuration allows deployment to different environments without code changes

## Assumptions

- JWT tokens are issued by Better Auth on the frontend using a shared secret (BETTER_AUTH_SECRET)
- JWT tokens contain a user identifier in the `sub` or `user_id` claim
- The frontend handles all user registration, login, and session management
- Database schema will be created/migrated via SQLModel on application startup
- A single PostgreSQL database (Neon Serverless) serves all users
- CORS needs to allow the frontend origin specified in FRONTEND_URL environment variable
- Python 3.13+ environment with UV package manager is available
- Rate limiting is out of scope for this phase (Phase V concern)

## Out of Scope

- User registration/login endpoints (handled by Better Auth on frontend)
- Password hashing or session management
- File uploads or attachments
- Real-time updates (WebSockets)
- Rate limiting
- Pagination for task lists (can be added in future iteration)
- Task filtering/sorting/search capabilities
- Task due dates or reminders
- Task categories or tags
- Task sharing between users

## Required Dependencies

### Production Dependencies

| Package | Description |
|---------|-------------|
| `fastapi` | Modern, fast web framework for building APIs with Python |
| `uvicorn[standard]` | Lightning-fast ASGI server for running FastAPI |
| `sqlmodel` | SQL databases in Python with Pydantic and SQLAlchemy integration |
| `asyncpg` | Async PostgreSQL driver for high-performance database operations |
| `pyjwt` | JWT token decoding and verification |
| `python-dotenv` | Load environment variables from .env files |
| `pydantic-settings` | BaseSettings class for Pydantic v2 configuration management |
| `sqlalchemy[asyncio]` | SQLAlchemy with async support (required by SQLModel) |

### Development Dependencies

| Package | Description |
|---------|-------------|
| `pytest` | Testing framework |
| `pytest-asyncio` | Async test support for pytest |
| `httpx` | Async HTTP client for testing FastAPI |
| `mypy` | Static type checker |
| `ruff` | Fast Python linter and formatter |

### Installation Command

```bash
# Install production dependencies
uv add fastapi "uvicorn[standard]" sqlmodel asyncpg pyjwt python-dotenv pydantic-settings "sqlalchemy[asyncio]"

# Install development dependencies
uv add --dev pytest pytest-asyncio httpx mypy ruff
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string for Neon | `postgresql://user:pass@host/db?ssl=require` |
| `BETTER_AUTH_SECRET` | Shared secret for JWT verification (must match frontend) | `mySecureSecretKey123` |
| `FRONTEND_URL` | Frontend origin for CORS configuration | `http://localhost:3000` |

### Secret Format Requirements

**CRITICAL**: The `BETTER_AUTH_SECRET` must use only alphanumeric characters. Special characters cause JWT signature mismatches between frontend and backend.

| Character | Issue |
|-----------|-------|
| `$` | Interpreted as variable substitution in some environments |
| `!` | Causes issues in bash history expansion |
| `@`, `#`, `%`, `^`, `&`, `*` | May be escaped differently across platforms |

**Recommended Format**:
- Use only: `A-Z`, `a-z`, `0-9`
- Minimum length: 32 characters
- Generate with: `openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32`

**Example `.env`**:
```bash
DATABASE_URL=postgresql://user:pass@host/db?ssl=require
BETTER_AUTH_SECRET=xK7P9mQeA2ZxL4HrD8SYtFnJ3WqB6VcM
FRONTEND_URL=http://localhost:3000
```

### Known Issue: JWT Signature Mismatch

If JWT authentication fails with `InvalidSignatureError`, verify:
1. Both frontend and backend `.env` files contain identical `BETTER_AUTH_SECRET` values
2. The secret contains NO special characters (`$`, `!`, `@`, etc.)
3. No trailing whitespace or newlines in the secret value
