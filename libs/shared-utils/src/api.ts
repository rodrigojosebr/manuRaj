import type { ApiError, ApiResponse, PaginatedResponse } from '@manuraj/domain';

/**
 * Type-safe fetch wrapper for API calls
 */
export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiError;
    throw new ApiRequestError(error.message, error.statusCode, error.error);
  }

  return data as ApiResponse<T>;
}

/**
 * Custom error class for API errors
 */
export class ApiRequestError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, statusCode: number, errorCode: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

/**
 * Build query string from params object
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * API methods for CRUD operations
 */
export const api = {
  async get<T>(url: string): Promise<T> {
    const response = await apiFetch<T>(url);
    return response.data;
  },

  async post<T>(url: string, body: unknown): Promise<T> {
    const response = await apiFetch<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return response.data;
  },

  async put<T>(url: string, body: unknown): Promise<T> {
    const response = await apiFetch<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return response.data;
  },

  async delete<T>(url: string): Promise<T> {
    const response = await apiFetch<T>(url, {
      method: 'DELETE',
    });
    return response.data;
  },
};

/**
 * Type for API list response
 */
export type ListResponse<T> = PaginatedResponse<T>;
