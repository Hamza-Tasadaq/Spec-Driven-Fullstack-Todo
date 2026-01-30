# Data Model: Backend API - Task Management

**Feature Branch**: `001-backend-api`
**Date**: 2026-01-13
**Status**: Complete

## Entities

### Task

The primary entity representing a user's task item.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique identifier (uuid4) |
| `user_id` | String | Required, indexed | Owner's ID from JWT `sub` claim |
| `title` | String | Required, max 100 chars | Task title |
| `description` | String | Optional, max 500 chars | Task description |
| `status` | Enum | Default: "pending" | pending, in_progress, completed |
| `priority` | Enum | Default: "medium" | low, medium, high |
| `is_completed` | Boolean | Default: false | Completion flag (toggled via PATCH) |
| `created_at` | DateTime | Auto on create | UTC timestamp |
| `updated_at` | DateTime | Auto on create/update | UTC timestamp |

### Enums

#### TaskStatus
```
pending      → Task not started
in_progress  → Task being worked on
completed    → Task finished
```

#### Priority
```
low          → Low priority
medium       → Normal priority (default)
high         → High priority
```

## Relationships

```
User (external) ─────1:N────── Task
     │                           │
     └── user_id (string) ───────┘
```

- **User**: External entity managed by Better Auth on frontend
- **Task**: Belongs to exactly one user via `user_id`
- No foreign key constraint (user table not in this DB)
- User isolation enforced at application layer via JWT verification

## Validation Rules

### Task Creation (POST)
| Field | Rule |
|-------|------|
| `title` | Required, 1-100 characters |
| `description` | Optional, 0-500 characters |
| `status` | Optional, must be valid enum value |
| `priority` | Optional, must be valid enum value |

### Task Update (PUT)
| Field | Rule |
|-------|------|
| All fields | Optional (partial update) |
| `title` | If provided, 1-100 characters |
| `description` | If provided, 0-500 characters |
| `status` | If provided, must be valid enum value |
| `priority` | If provided, must be valid enum value |

## Indexes

| Index | Columns | Purpose |
|-------|---------|---------|
| Primary Key | `id` | Unique task lookup |
| User Index | `user_id` | Fast user task queries |

## State Transitions

### is_completed (via PATCH /complete)
```
false ─────toggle────→ true
  ↑                      │
  └────────toggle────────┘
```

### status (via PUT)
```
pending ←──→ in_progress ←──→ completed
    ↑                             │
    └─────────────────────────────┘
```
All transitions allowed; no enforced state machine.

## Database Schema (PostgreSQL)

```sql
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE priority AS ENUM ('low', 'medium', 'high');

CREATE TABLE task (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    status task_status NOT NULL DEFAULT 'pending',
    priority priority NOT NULL DEFAULT 'medium',
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_user_id ON task(user_id);
```

## SQLModel Definition

```python
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime, timezone
from enum import Enum

class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"

class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class Task(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(index=True, nullable=False)
    title: str = Field(max_length=100, nullable=False)
    description: str | None = Field(default=None, max_length=500)
    status: TaskStatus = Field(default=TaskStatus.pending)
    priority: Priority = Field(default=Priority.medium)
    is_completed: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)}
    )
```

## Migration Strategy

SQLModel with `create_all` for initial schema creation:

```python
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import AsyncEngine

async def init_db(engine: AsyncEngine):
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
```

For future schema changes, consider Alembic async migrations.
