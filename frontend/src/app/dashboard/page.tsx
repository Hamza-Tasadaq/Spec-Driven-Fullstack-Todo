'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, ClipboardList } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TaskList } from '@/components/TaskList';
import { TaskFilters } from '@/components/TaskFilters';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import type { TaskFilters as TaskFiltersType } from '@/types';

function DashboardContent() {
  const { user, logout } = useAuth();
  const { tasks, isLoading, error, getTasks, toggleComplete, deleteTask, clearError } = useTasks();
  const [filters, setFilters] = useState<TaskFiltersType>({
    status: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  useEffect(() => {
    // DEBUG: Log user state when effect runs
    console.log('[Dashboard] useEffect triggered:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
    });

    if (user?.id) {
      getTasks(user.id);
    } else {
      console.warn('[Dashboard] No user.id available, skipping getTasks');
    }
  }, [user?.id, getTasks]);

  const handleToggleComplete = useCallback(async (taskId: string) => {
    if (user?.id) {
      await toggleComplete(user.id, taskId);
    }
  }, [user?.id, toggleComplete]);

  const handleDelete = useCallback(async (taskId: string) => {
    if (user?.id) {
      await deleteTask(user.id, taskId);
    }
  }, [user?.id, deleteTask]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Task Manager</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Tasks</h2>
          <Link href="/tasks/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={() => user?.id && getTasks(user.id)} />
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-500 mb-6">Create your first task to get started</p>
            <Link href="/tasks/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create your first task
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <TaskFilters
              filters={filters}
              onFilterChange={setFilters}
              taskCount={tasks.length}
            />
            <TaskList
              tasks={tasks}
              filters={filters}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
