import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import type { ApiFailure } from '@drdivya/shared';
import { logger } from '../logger.js';

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const notFound: RequestHandler = (req, res) => {
  const body: ApiFailure = {
    ok: false,
    error: { code: 'not_found', message: `No route for ${req.method} ${req.path}` },
  };
  res.status(404).json(body);
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    // Flatten to `{ fieldName: firstMessage }` so the client can map straight
    // onto react-hook-form's setError().
    const fields: Record<string, string> = {};
    for (const issue of err.issues) {
      const key = issue.path.join('.') || 'form';
      if (!(key in fields)) fields[key] = issue.message;
    }
    const body: ApiFailure = {
      ok: false,
      error: { code: 'validation_error', message: 'Please check the highlighted fields.', fields },
    };
    res.status(422).json(body);
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ ok: false, error: { code: err.code, message: err.message } });
    return;
  }

  logger.error('Unhandled error', err);
  const body: ApiFailure = {
    ok: false,
    error: { code: 'internal_error', message: 'Something went wrong on our end. Please try again.' },
  };
  res.status(500).json(body);
};

/** Wraps an async handler so rejected promises reach the error middleware. */
export const asyncHandler =
  <T extends RequestHandler>(handler: T): RequestHandler =>
  (req, res, next) => {
    void Promise.resolve(handler(req, res, next)).catch(next);
  };
