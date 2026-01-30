'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Edit2, Trash2, Loader2 } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ConfirmDialog } from './ui/Dialog';
import { getPriorityColor, getStatusColor, formatRelativeTime } from '@/lib/utils';
import type { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TaskCard({ task, onToggleComplete, onDelete }: TaskCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggleComplete(task.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className={`transition-opacity ${task.is_completed ? 'opacity-60' : ''}`}>
        <div className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <button
              onClick={handleToggle}
              disabled={isToggling}
              className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                task.is_completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-500'
              }`}
              aria-label={task.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {isToggling ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : task.is_completed ? (
                <Check className="w-3 h-3" />
              ) : null}
            </button>

            <div className="flex-1 min-w-0">
              <h3 className={`text-sm sm:text-base font-medium text-gray-900 ${task.is_completed ? 'line-through' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`text-xs ${getStatusColor(task.status, task.is_completed)}`}>
                  {task.is_completed ? 'Completed' : task.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-400 hidden sm:inline">
                  {formatRelativeTime(task.created_at)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1">
              <Link href={`/tasks/${task.id}`}>
                <Button variant="ghost" size="sm" aria-label="Edit task">
                  <Edit2 className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </>
  );
}
