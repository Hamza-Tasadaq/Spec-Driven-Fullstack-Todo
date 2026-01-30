'use client';

import { useMemo } from 'react';
import { TaskCard } from './TaskCard';
import type { Task, TaskFilters } from '@/types';

interface TaskListProps {
  tasks: Task[];
  filters: TaskFilters;
  onToggleComplete: (taskId: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TaskList({ tasks, filters, onToggleComplete, onDelete }: TaskListProps) {
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by status
    if (filters.status !== 'all') {
      if (filters.status === 'completed') {
        result = result.filter((task) => task.is_completed);
      } else {
        result = result.filter((task) => !task.is_completed && task.status === filters.status);
      }
    }

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const diff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (filters.sortOrder === 'asc') return -diff;
        return diff;
      }

      // Sort by created_at
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      if (filters.sortOrder === 'asc') return dateA - dateB;
      return dateB - dateA;
    });

    return result;
  }, [tasks, filters]);

  if (filteredAndSortedTasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {filteredAndSortedTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
