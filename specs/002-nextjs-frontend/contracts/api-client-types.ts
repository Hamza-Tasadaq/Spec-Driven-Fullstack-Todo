/**
 * API Client TypeScript Types
 *
 * Generated for: 002-nextjs-frontend
 * Based on: specs/001-backend-api/contracts/openapi.yaml
 * Date: 2026-01-15
 *
 * These types define the contract between the frontend and backend API.
 */

// =============================================================================
// Enums
// =============================================================================

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type Priority = 'low' | 'medium' | 'high';

// =============================================================================
// Entity Types
// =============================================================================

/**
 * Task entity as returned by the API
 */
export interface Task {
  /** Unique task identifier (UUID) */
  id: string;
  /** Owner's user ID */
  user_id: string;
  /** Task title (1-100 characters) */
  title: string;
  /** Task description (0-500 characters, nullable) */
  description: string | null;
  /** Task status */
  status: TaskStatus;
  /** Task priority */
  priority: Priority;
  /** Whether the task is completed */
  is_completed: boolean;
  /** Creation timestamp (ISO 8601) */
  created_at: string;
  /** Last update timestamp (ISO 8601) */
  updated_at: string;
}

// =============================================================================
// Request Types
// =============================================================================

/**
 * Request body for creating a new task
 * POST /api/{user_id}/tasks
 */
export interface TaskCreateRequest {
  /** Task title (required, 1-100 characters) */
  title: string;
  /** Task description (optional, 0-500 characters) */
  description?: string | null;
  /** Task status (optional, defaults to 'pending') */
  status?: TaskStatus;
  /** Task priority (optional, defaults to 'medium') */
  priority?: Priority;
}

/**
 * Request body for updating an existing task
 * PUT /api/{user_id}/tasks/{task_id}
 */
export interface TaskUpdateRequest {
  /** Task title (optional, 1-100 characters) */
  title?: string;
  /** Task description (optional, 0-500 characters) */
  description?: string | null;
  /** Task status (optional) */
  status?: TaskStatus;
  /** Task priority (optional) */
  priority?: Priority;
  /** Completion status (optional) */
  is_completed?: boolean;
}

// =============================================================================
// Response Types
// =============================================================================

/**
 * Single task response
 * Used by: GET, POST, PUT, PATCH endpoints
 */
export type TaskResponse = Task;

/**
 * Task list response
 * Used by: GET /api/{user_id}/tasks
 */
export type TaskListResponse = Task[];

// =============================================================================
// Error Types
// =============================================================================

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  detail: string;
}

/**
 * Validation error response (422)
 */
export interface ValidationErrorResponse {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

// =============================================================================
// API Function Signatures
// =============================================================================

/**
 * Type definitions for API client functions
 */
export interface TasksApi {
  /**
   * Get all tasks for a user
   * GET /api/{user_id}/tasks
   */
  getTasks(userId: string): Promise<TaskListResponse>;

  /**
   * Create a new task
   * POST /api/{user_id}/tasks
   */
  createTask(userId: string, data: TaskCreateRequest): Promise<TaskResponse>;

  /**
   * Get a single task
   * GET /api/{user_id}/tasks/{task_id}
   */
  getTask(userId: string, taskId: string): Promise<TaskResponse>;

  /**
   * Update an existing task
   * PUT /api/{user_id}/tasks/{task_id}
   */
  updateTask(userId: string, taskId: string, data: TaskUpdateRequest): Promise<TaskResponse>;

  /**
   * Delete a task
   * DELETE /api/{user_id}/tasks/{task_id}
   */
  deleteTask(userId: string, taskId: string): Promise<void>;

  /**
   * Toggle task completion status
   * PATCH /api/{user_id}/tasks/{task_id}/complete
   */
  toggleComplete(userId: string, taskId: string): Promise<TaskResponse>;
}

// =============================================================================
// HTTP Status Code Constants
// =============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
} as const;

// =============================================================================
// API Endpoint Patterns
// =============================================================================

export const API_ENDPOINTS = {
  /** Task list/create: /api/{user_id}/tasks */
  tasks: (userId: string) => `/api/${userId}/tasks`,
  /** Single task: /api/{user_id}/tasks/{task_id} */
  task: (userId: string, taskId: string) => `/api/${userId}/tasks/${taskId}`,
  /** Toggle complete: /api/{user_id}/tasks/{task_id}/complete */
  toggleComplete: (userId: string, taskId: string) => `/api/${userId}/tasks/${taskId}/complete`,
} as const;
