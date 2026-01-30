'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TaskForm } from '@/components/TaskForm';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import type { Task, TaskFormData } from '@/types';

function EditTaskContent() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  const { user } = useAuth();
  const { getTask, updateTask } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoadingTask, setIsLoadingTask] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchTask() {
      if (!user?.id || !taskId) return;

      setIsLoadingTask(true);
      setError(null);
      setNotFound(false);

      try {
        const fetchedTask = await getTask(user.id, taskId);
        setTask(fetchedTask);
      } catch (err) {
        if (err instanceof Error && err.message.includes('not found')) {
          setNotFound(true);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load task');
        }
      } finally {
        setIsLoadingTask(false);
      }
    }

    fetchTask();
  }, [user?.id, taskId, getTask]);

  const handleSubmit = async (data: TaskFormData) => {
    if (!user?.id || !taskId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updateTask(user.id, taskId, {
        title: data.title,
        description: data.description || null,
        priority: data.priority,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTask) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Task Not Found</h2>
              <p className="text-gray-500 mb-6">
                This task may have been deleted or you don&apos;t have permission to view it.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-gray-900">Edit Task</h1>
          </CardHeader>
          <CardContent>
            {task && (
              <TaskForm
                mode="edit"
                defaultValues={{
                  title: task.title,
                  description: task.description || '',
                  priority: task.priority,
                }}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
                error={error}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EditTaskPage() {
  return (
    <ProtectedRoute>
      <EditTaskContent />
    </ProtectedRoute>
  );
}
