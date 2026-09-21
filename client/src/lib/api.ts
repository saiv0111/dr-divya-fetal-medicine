import type { ApiResponse, Post, PostSummary } from '@drdivya/shared';

/**
 * In dev, Vite proxies `/api` to the Express server, so a relative base works
 * in both environments and avoids a CORS preflight in production.
 */
const BASE = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly code: string,
    /** Field-level messages, ready to hand to react-hook-form's setError. */
    readonly fields?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiError(
      'We could not reach the server. Please check your connection and try again.',
      'network_error',
    );
  }

  let body: ApiResponse<T> | null = null;
  try {
    body = (await response.json()) as ApiResponse<T>;
  } catch {
    // Fall through to the status-based error below.
  }

  if (!response.ok || !body || body.ok === false) {
    const error = body && body.ok === false ? body.error : undefined;
    throw new ApiError(
      error?.message ?? 'Something went wrong. Please try again.',
      error?.code ?? `http_${response.status}`,
      error?.fields,
    );
  }

  return body.data;
};

export const api = {
  listPosts: (category?: string) =>
    request<PostSummary[]>(
      `/api/posts${category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : ''}`,
    ),
  getPost: (slug: string) => request<Post>(`/api/posts/${encodeURIComponent(slug)}`),
  submitAppointment: (payload: unknown) =>
    request<{ reference: string; message: string }>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  submitContact: (payload: unknown) =>
    request<{ message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  subscribe: (payload: unknown) =>
    request<{ message: string }>('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
