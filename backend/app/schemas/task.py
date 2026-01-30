"""Task request/response schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.task import Priority, TaskStatus


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str = Field(..., min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    status: TaskStatus = Field(default=TaskStatus.pending)
    priority: Priority = Field(default=Priority.medium)


class TaskUpdate(BaseModel):
    """Schema for updating a task (all fields optional)."""

    title: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    status: TaskStatus | None = Field(default=None)
    priority: Priority | None = Field(default=None)
    is_completed: bool | None = Field(default=None)


class TaskResponse(BaseModel):
    """Schema for task response."""

    id: UUID
    user_id: str
    title: str
    description: str | None
    status: TaskStatus
    priority: Priority
    is_completed: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
