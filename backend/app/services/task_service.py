"""Task service layer for business logic."""

from datetime import datetime
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


async def create_task(
    session: AsyncSession,
    user_id: str,
    task_data: TaskCreate,
) -> Task:
    """
    Create a new task for a user.

    Args:
        session: Database session
        user_id: Owner's user ID
        task_data: Task creation data

    Returns:
        The created task
    """
    task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
    )
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


async def get_tasks_by_user(
    session: AsyncSession,
    user_id: str,
) -> list[Task]:
    """
    Get all tasks for a user.

    Args:
        session: Database session
        user_id: Owner's user ID

    Returns:
        List of user's tasks
    """
    statement = select(Task).where(Task.user_id == user_id)
    result = await session.execute(statement)
    return list(result.scalars().all())


async def get_task_by_id(
    session: AsyncSession,
    user_id: str,
    task_id: UUID,
) -> Task:
    """
    Get a single task by ID with ownership check.

    Args:
        session: Database session
        user_id: Owner's user ID
        task_id: Task UUID

    Returns:
        The task

    Raises:
        HTTPException: 404 if task not found or doesn't belong to user
    """
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task


async def update_task(
    session: AsyncSession,
    user_id: str,
    task_id: UUID,
    task_data: TaskUpdate,
) -> Task:
    """
    Update a task with ownership check.

    Args:
        session: Database session
        user_id: Owner's user ID
        task_id: Task UUID
        task_data: Update data (partial)

    Returns:
        The updated task

    Raises:
        HTTPException: 404 if task not found or doesn't belong to user
    """
    task = await get_task_by_id(session, user_id, task_id)

    # Update only provided fields
    update_dict = task_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(task, field, value)

    task.updated_at = datetime.utcnow()

    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


async def toggle_task_completion(
    session: AsyncSession,
    user_id: str,
    task_id: UUID,
) -> Task:
    """
    Toggle task completion status.

    Args:
        session: Database session
        user_id: Owner's user ID
        task_id: Task UUID

    Returns:
        The updated task

    Raises:
        HTTPException: 404 if task not found or doesn't belong to user
    """
    task = await get_task_by_id(session, user_id, task_id)

    task.is_completed = not task.is_completed
    task.updated_at = datetime.utcnow()

    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


async def delete_task(
    session: AsyncSession,
    user_id: str,
    task_id: UUID,
) -> None:
    """
    Delete a task with ownership check.

    Args:
        session: Database session
        user_id: Owner's user ID
        task_id: Task UUID

    Raises:
        HTTPException: 404 if task not found or doesn't belong to user
    """
    task = await get_task_by_id(session, user_id, task_id)

    await session.delete(task)
    await session.commit()
