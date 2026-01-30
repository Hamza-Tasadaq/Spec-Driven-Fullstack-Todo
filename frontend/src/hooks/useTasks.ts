'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api-client';
import { API_ENDPOINTS, TaskCreateRequest, TaskUpdateRequest } from '@/types/api';
import type { Task } from '@/types';

interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  getTasks: (userId: string) => Promise<void>;
  getTask: (userId: string, taskId: string) => Promise<Task>;
  createTask: (userId: string, data: TaskCreateRequest) => Promise<Task>;
  updateTask: (userId: string, taskId: string, data: TaskUpdateRequest) => Promise<Task>;
  deleteTask: (userId: string, taskId: string) => Promise<void>;
  toggleComplete: (userId: string, taskId: string) => Promise<Task>;
  clearError: () => void;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTasks = useCallback(async (userId: string) => {
    // DEBUG: Log getTasks call
    console.log('[useTasks.getTasks]', {
      userId,
      userIdType: typeof userId,
      endpoint: API_ENDPOINTS.tasks(userId),
    });

    setIsLoading(true);
    setError(null);
    try {
      const data = await api<Task[]>(API_ENDPOINTS.tasks(userId));
      // DEBUG: Log successful response
      console.log('[useTasks.getTasks] Success:', {
        taskCount: data.length,
        tasks: data,
      });
      setTasks(data);
    } catch (err) {
      // DEBUG: Log error details
      console.error('[useTasks.getTasks] Error:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
      });
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTask = useCallback(async (userId: string, taskId: string): Promise<Task> => {
    setIsLoading(true);
    setError(null);
    try {
      const task = await api<Task>(API_ENDPOINTS.task(userId, taskId));
      return task;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch task';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (userId: string, data: TaskCreateRequest): Promise<Task> => {
    setIsLoading(true);
    setError(null);
    try {
      const task = await api<Task>(API_ENDPOINTS.tasks(userId), {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setTasks(prev => [task, ...prev]);
      return task;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (userId: string, taskId: string, data: TaskUpdateRequest): Promise<Task> => {
    setIsLoading(true);
    setError(null);
    try {
      const task = await api<Task>(API_ENDPOINTS.task(userId, taskId), {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      setTasks(prev => prev.map(t => t.id === taskId ? task : t));
      return task;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (userId: string, taskId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await api<void>(API_ENDPOINTS.task(userId, taskId), {
        method: 'DELETE',
      });
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleComplete = useCallback(async (userId: string, taskId: string): Promise<Task> => {
    // Optimistic update
    const originalTasks = tasks;
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, is_completed: !t.is_completed } : t
    ));

    try {
      const task = await api<Task>(API_ENDPOINTS.toggleComplete(userId, taskId), {
        method: 'PATCH',
      });
      setTasks(prev => prev.map(t => t.id === taskId ? task : t));
      return task;
    } catch (err) {
      // Rollback on error
      setTasks(originalTasks);
      const message = err instanceof Error ? err.message : 'Failed to toggle task';
      setError(message);
      throw err;
    }
  }, [tasks]);

  const clearError = useCallback(() => setError(null), []);

  return {
    tasks,
    isLoading,
    error,
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    clearError,
  };
}
