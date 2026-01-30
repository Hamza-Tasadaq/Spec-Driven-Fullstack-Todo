"""Task model and related enums."""

from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class TaskStatus(str, Enum):
    """Task status enumeration."""

    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


class Priority(str, Enum):
    """Task priority enumeration."""

    low = "low"
    medium = "medium"
    high = "high"


class Task(SQLModel, table=True):
    """Task model for database storage.

    Note: Using timezone-naive datetimes (datetime.utcnow) for compatibility
    with PostgreSQL TIMESTAMP WITHOUT TIME ZONE columns. All times are UTC.
    """

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(index=True, nullable=False)
    title: str = Field(max_length=100, nullable=False)
    description: str | None = Field(default=None, max_length=500)
    status: TaskStatus = Field(default=TaskStatus.pending)
    priority: Priority = Field(default=Priority.medium)
    is_completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
