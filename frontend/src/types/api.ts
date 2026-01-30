import { Task, User, Session } from './index';

// Task API requests
export interface TaskCreateRequest {
  title: string;
  description?: string | null;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string | null;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  is_completed?: boolean;
}

// Task API responses
export type TaskResponse = Task;
export type TaskListResponse = Task[];

// Auth requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

// Auth responses
export interface AuthResponse {
  user: User;
  session: Session;
}

// Error responses
export interface ApiError {
  detail: string;
}

export interface ValidationError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

// API endpoint helpers
export const API_ENDPOINTS = {
  tasks: (userId: string) => `/api/${userId}/tasks`,
  task: (userId: string, taskId: string) => `/api/${userId}/tasks/${taskId}`,
  toggleComplete: (userId: string, taskId: string) => `/api/${userId}/tasks/${taskId}/complete`,
} as const;
