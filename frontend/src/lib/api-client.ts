import { getToken, removeToken } from './token';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function api<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const fullUrl = `${API_URL}${endpoint}`;

  // DEBUG: Log API request details
  console.log('[API Request]', {
    url: fullUrl,
    method: options.method || 'GET',
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : null,
  });

  const response = await fetch(fullUrl, config);

  // DEBUG: Log API response status
  console.log('[API Response]', {
    url: fullUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
  });

  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login?error=session_expired';
    }
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  // Handle error responses
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // Response is not JSON
      errorMessage = response.statusText || errorMessage;
    }
    throw new ApiError(response.status, errorMessage);
  }

  // Parse and return JSON response
  return response.json();
}

// Convenience methods
export const apiGet = <T>(endpoint: string) => api<T>(endpoint, { method: 'GET' });

export const apiPost = <T>(endpoint: string, body: unknown) =>
  api<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const apiPut = <T>(endpoint: string, body: unknown) =>
  api<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

export const apiPatch = <T>(endpoint: string, body?: unknown) => {
  const options: RequestInit = { method: 'PATCH' };
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }
  return api<T>(endpoint, options);
};

export const apiDelete = <T>(endpoint: string) => api<T>(endpoint, { method: 'DELETE' });
