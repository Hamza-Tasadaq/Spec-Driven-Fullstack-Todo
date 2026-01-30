// Enums
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type Priority = 'low' | 'medium' | 'high';

// Core entities
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: string;
}

// UI State types
export interface TaskFilters {
  status: 'all' | TaskStatus;
  sortBy: 'created_at' | 'priority';
  sortOrder: 'asc' | 'desc';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
}
