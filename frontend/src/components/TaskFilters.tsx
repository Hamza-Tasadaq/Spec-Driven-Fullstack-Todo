'use client';

import { Select } from './ui/Select';
import type { TaskFilters as TaskFiltersType } from '@/types';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFilterChange: (filters: TaskFiltersType) => void;
  taskCount: number;
}

const statusOptions = [
  { value: 'all', label: 'All Tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const sortOptions = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'priority', label: 'Priority' },
];

const orderOptions = [
  { value: 'desc', label: 'Newest First' },
  { value: 'asc', label: 'Oldest First' },
];

export function TaskFilters({ filters, onFilterChange, taskCount }: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <p className="text-sm text-gray-600">
        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Select
          options={statusOptions}
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value as TaskFiltersType['status'] })}
          className="w-36"
        />
        <Select
          options={sortOptions}
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as TaskFiltersType['sortBy'] })}
          className="w-36"
        />
        <Select
          options={orderOptions}
          value={filters.sortOrder}
          onChange={(e) => onFilterChange({ ...filters, sortOrder: e.target.value as TaskFiltersType['sortOrder'] })}
          className="w-36"
        />
      </div>
    </div>
  );
}
