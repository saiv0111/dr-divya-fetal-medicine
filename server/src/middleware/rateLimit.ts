import rateLimit from 'express-rate-limit';
import type { ApiFailure } from '@drdivya/shared';

const tooMany: ApiFailure = {
  ok: false,
  error: { code: 'rate_limited', message: 'Too many requests. Please try again in a few minutes.' },
};

/** Generous ceiling for read-only endpoints. */
export const readLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: tooMany,
});

/** Tight ceiling for anything that creates a record or sends mail. */
export const writeLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: tooMany,
});
