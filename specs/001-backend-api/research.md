# Research: Backend API - Task Management REST API

**Feature Branch**: `001-backend-api`
**Date**: 2026-01-13
**Status**: Complete

## Overview

This document consolidates research findings for the Backend API implementation. All technical decisions have been resolved based on the feature specification, constitution, and user-provided architecture input.

---

## Decision 1: Database Driver for Neon PostgreSQL

**Decision**: Use `asyncpg` with SQLModel async support

**Rationale**:
- FastAPI is async-native; using sync drivers (psycopg2) blocks the event loop
- Neon Serverless PostgreSQL fully supports asyncpg
- SQLModel 0.0.14+ supports async sessions via SQLAlchemy 2.0 async engine
- Connection string format: `postgresql+asyncpg://...`

**Alternatives Considered**:
- `psycopg2`: Sync-only, would require thread pool executor (complexity)
- `psycopg3`: Async support exists but less mature ecosystem
- `databases` library: Additional abstraction layer not needed with SQLModel

**Implementation Notes**:
```python
# Connection string must use asyncpg dialect
DATABASE_URL = "postgresql+asyncpg://user:pass@host/db?sslmode=require"

# SQLModel async engine setup
from sqlalchemy.ext.asyncio import create_async_engine
engine = create_async_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
```

---

## Decision 2: JWT Verification Library

**Decision**: Use `PyJWT` for token verification

**Rationale**:
- Lightweight (decode-only needed, no token generation on backend)
- Widely adopted, well-documented
- Supports HS256 algorithm used by Better Auth
- Simple API: `jwt.decode(token, secret, algorithms=["HS256"])`

**Alternatives Considered**:
- `python-jose`: More features but heavier dependency
- `authlib`: Full OAuth2 library, overkill for decode-only
- `itsdangerous`: Different use case (signed URLs)

**Implementation Notes**:
```python
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

def verify_jwt(token: str, secret: str) -> dict:
    return jwt.decode(token, secret, algorithms=["HS256"])
```

---

## Decision 3: Authentication Pattern

**Decision**: Use FastAPI Dependency Injection for auth

**Rationale**:
- Per-route injection is cleaner than global middleware
- Easy to mock in tests (override dependency)
- Can access path parameters (user_id) in dependency
- Better error handling with HTTPException

**Alternatives Considered**:
- Global Middleware: Harder to test, can't access route params easily
- Manual checks in each route: Repetitive, error-prone
- Starlette AuthenticationMiddleware: More complex setup

**Implementation Notes**:
```python
from fastapi import Depends, HTTPException, Header

async def verify_user(
    user_id: str,
    authorization: str = Header(...)
) -> str:
    token = authorization.replace("Bearer ", "")
    payload = verify_jwt(token, settings.better_auth_secret)
    if payload.get("sub") != user_id:
        raise HTTPException(status_code=401, detail="User ID mismatch")
    return user_id

# Usage in route
@router.get("/api/{user_id}/tasks")
async def get_tasks(user_id: str = Depends(verify_user)):
    ...
```

---

## Decision 4: SQLModel Table Configuration

**Decision**: Use SQLModel with explicit table configuration

**Rationale**:
- Combines Pydantic validation with SQLAlchemy ORM
- Type hints drive both validation and schema
- UUID primary key via `uuid.uuid4` default factory
- Timestamps via `datetime.utcnow` default factory

**Alternatives Considered**:
- Pure SQLAlchemy: Less type safety, separate schemas needed
- Tortoise ORM: Different async ORM, less FastAPI integration
- Pony ORM: Less mainstream, smaller community

**Implementation Notes**:
```python
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime

class Task(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(index=True)
    title: str = Field(max_length=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

---

## Decision 5: Error Response Format

**Decision**: Use FastAPI's default `HTTPException` with `detail` field

**Rationale**:
- Constitution specifies `{ "detail": "message" }` format
- FastAPI's HTTPException automatically produces this format
- Consistent with OpenAPI error schema generation

**Alternatives Considered**:
- Custom error model: More fields but constitution specifies simple format
- Exception handlers: Only needed if custom format required

**Implementation Notes**:
```python
from fastapi import HTTPException

# Raises: {"detail": "Task not found"}
raise HTTPException(status_code=404, detail="Task not found")

# Validation errors (422) automatically formatted by FastAPI/Pydantic
```

---

## Decision 6: Connection Pooling for Serverless

**Decision**: Enable connection pooling with `pool_pre_ping`

**Rationale**:
- Neon serverless may close idle connections
- `pool_pre_ping=True` validates connections before use
- Prevents "connection closed" errors after cold starts

**Alternatives Considered**:
- No pooling: Connection errors after idle periods
- External pooler (PgBouncer): Neon provides built-in pooling

**Implementation Notes**:
```python
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,  # Validate connections
    pool_size=5,
    max_overflow=10
)
```

---

## Decision 7: Service Layer Pattern

**Decision**: Thin service layer with repository-like functions

**Rationale**:
- Constitution requires separation: routes → services → models
- Services own business logic and DB access
- Routes only handle HTTP concerns (parsing, responses)
- Keeps routes testable without DB mocks

**Alternatives Considered**:
- Direct DB in routes: Violates constitution (separation of concerns)
- Full repository pattern: Over-engineering for simple CRUD
- Active Record pattern: SQLModel isn't designed for this

**Implementation Notes**:
```python
# services/task_service.py
async def create_task(session: AsyncSession, user_id: str, task_data: TaskCreate) -> Task:
    task = Task(user_id=user_id, **task_data.model_dump())
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task

# routers/tasks.py (uses service)
@router.post("/api/{user_id}/tasks", status_code=201)
async def create_task_route(user_id: str, task_data: TaskCreate, session: AsyncSession = Depends(get_session)):
    return await task_service.create_task(session, user_id, task_data)
```

---

## Unresolved Items

None. All technical decisions have been resolved.

---

## References

- [FastAPI Async SQL Databases](https://fastapi.tiangolo.com/advanced/async-sql-databases/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Neon Serverless PostgreSQL](https://neon.tech/docs)
- [PyJWT Documentation](https://pyjwt.readthedocs.io/)
- [Better Auth JWT Plugin](https://www.better-auth.com/docs/plugins/jwt)
