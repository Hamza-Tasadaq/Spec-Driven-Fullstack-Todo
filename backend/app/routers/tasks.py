"""Task API endpoints."""

import logging
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.middleware.auth import VerifiedUser
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.services import task_service

# DEBUG: Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["tasks"])


@router.post(
    "/{user_id}/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_task(
    user_id: VerifiedUser,
    task_data: TaskCreate,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> TaskResponse:
    """Create a new task for the authenticated user."""
    task = await task_service.create_task(session, user_id, task_data)
    return TaskResponse.model_validate(task)


@router.get(
    "/{user_id}/tasks",
    response_model=list[TaskResponse],
)
async def get_tasks(
    user_id: VerifiedUser,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> list[TaskResponse]:
    """Get all tasks for the authenticated user."""
    # DEBUG: Log incoming request
    logger.info(f"[GET /api/{user_id}/tasks] Request received for user_id={user_id}")

    tasks = await task_service.get_tasks_by_user(session, user_id)

    # DEBUG: Log response
    logger.info(f"[GET /api/{user_id}/tasks] Returning {len(tasks)} tasks")

    return [TaskResponse.model_validate(task) for task in tasks]


@router.get(
    "/{user_id}/tasks/{task_id}",
    response_model=TaskResponse,
)
async def get_task(
    user_id: VerifiedUser,
    task_id: UUID,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> TaskResponse:
    """Get a single task by ID."""
    task = await task_service.get_task_by_id(session, user_id, task_id)
    return TaskResponse.model_validate(task)


@router.put(
    "/{user_id}/tasks/{task_id}",
    response_model=TaskResponse,
)
async def update_task(
    user_id: VerifiedUser,
    task_id: UUID,
    task_data: TaskUpdate,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> TaskResponse:
    """Update a task."""
    task = await task_service.update_task(session, user_id, task_id, task_data)
    return TaskResponse.model_validate(task)


@router.delete(
    "/{user_id}/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_task(
    user_id: VerifiedUser,
    task_id: UUID,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    """Delete a task."""
    await task_service.delete_task(session, user_id, task_id)


@router.patch(
    "/{user_id}/tasks/{task_id}/complete",
    response_model=TaskResponse,
)
async def toggle_task_completion(
    user_id: VerifiedUser,
    task_id: UUID,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> TaskResponse:
    """Toggle task completion status."""
    task = await task_service.toggle_task_completion(session, user_id, task_id)
    return TaskResponse.model_validate(task)
