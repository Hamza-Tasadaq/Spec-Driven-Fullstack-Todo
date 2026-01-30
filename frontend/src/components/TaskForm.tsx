'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { ErrorMessage } from './ErrorMessage';
import type { TaskFormData } from '@/types';

interface TaskFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export function TaskForm({ mode, defaultValues, onSubmit, isLoading, error }: TaskFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <ErrorMessage message={error} />
      )}

      <Input
        label="Title"
        placeholder="What needs to be done?"
        error={errors.title?.message}
        {...register('title', {
          required: 'Title is required',
          maxLength: {
            value: 100,
            message: 'Title must be 100 characters or less',
          },
        })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="text-gray-900 bg-white w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={4}
          placeholder="Add more details (optional)"
          {...register('description', {
            maxLength: {
              value: 500,
              message: 'Description must be 500 characters or less',
            },
          })}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <Select
        label="Priority"
        options={priorityOptions}
        {...register('priority')}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/dashboard')}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {mode === 'create' ? 'Create Task' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
