'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TaskForm } from '@/components/TaskForm';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import type { TaskFormData } from '@/types';

function NewTaskContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { createTask } = useTasks();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: TaskFormData) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      await createTask(user.id, {
        title: data.title,
        description: data.description || null,
        priority: data.priority,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-xl font-bold text-gray-900">Create New Task</h1>
          </CardHeader>
          <CardContent>
            <TaskForm
              mode="create"
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NewTaskPage() {
  return (
    <ProtectedRoute>
      <NewTaskContent />
    </ProtectedRoute>
  );
}
