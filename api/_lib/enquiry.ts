/**
 * The whole backend, in one function.
 *
 * Deliberately platform-agnostic: it takes a parsed body and returns a status
 * plus a JSON payload. The Vercel handlers in `api/*.ts` and the Vite dev
 * middleware both call this, so local development and production run exactly
 * the same validation and delivery path.
 */
import { randomUUID } from 'node:crypto';
import type { ZodError, ZodSchema } from 'zod';
import {
  appointmentRequestSchema,
  contactRequestSchema,
  newsletterRequestSchema,
} from '@drdivya/shared';
import { deliver } from './mailer';

export type EnquiryKind = 'appointment' | 'contact' | 'newsletter';

export interface Result {
  status: number;
  body: unknown;
}

/**
 * Honeypot. The field is visually hidden and `tabindex=-1`, so a real browser
 * leaves it empty while naive bots fill every input they find. We answer 202 so
 * the bot believes it succeeded and does not retry.
 */
const isBot = (body: unknown) =>
  typeof body === 'object' && body !== null && Boolean((body as { company?: string }).company);

const BOT_REPLY: Record<EnquiryKind, unknown> = {
  appointment: { reference: 'queued' },
  contact: { message: 'Thanks — we will be in touch.' },
  newsletter: { message: 'Subscribed.' },
};

/** Turns a Zod error into the `{ field: message }` shape react-hook-form wants. */
const toFieldErrors = (error: ZodError): Record<string, string> => {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    if (key && !(key in fields)) fields[key] = issue.message;
  }
  return fields;
};

const invalid = (error: ZodError): Result => ({
  status: 422,
  body: {
    ok: false,
    error: {
      code: 'validation_failed',
      message: 'Please check the highlighted fields and try again.',
      fields: toFieldErrors(error),
    },
  },
});

/** Parses with a concrete schema so each branch below keeps its real type. */
const parse = <T>(schema: ZodSchema<T>, body: unknown) => schema.safeParse(body);

const ok = (data: unknown): Result => ({ status: 201, body: { ok: true, data } });

export const handleEnquiry = async (kind: EnquiryKind, rawBody: unknown): Promise<Result> => {
  if (isBot(rawBody)) {
    return { status: 202, body: { ok: true, data: BOT_REPLY[kind] } };
  }

  switch (kind) {
    case 'appointment': {
      const result = parse(appointmentRequestSchema, rawBody);
      if (!result.success) return invalid(result.error);
      const payload = result.data;
      const reference = `FM-${randomUUID().slice(0, 8).toUpperCase()}`;
      await deliver({
        kind,
        subject: `New appointment request · ${payload.service} · ${payload.name}`,
        reference,
        payload,
      });
      return ok({
        reference,
        message:
          'Request received. Our front desk will confirm your slot by phone within one working day.',
      });
    }

    case 'contact': {
      const result = parse(contactRequestSchema, rawBody);
      if (!result.success) return invalid(result.error);
      const payload = result.data;
      await deliver({
        kind,
        subject: `Website enquiry from ${payload.name}`,
        reference: randomUUID().slice(0, 8),
        payload,
      });
      return ok({ message: 'Thank you — we usually reply within one working day.' });
    }

    case 'newsletter': {
      const result = parse(newsletterRequestSchema, rawBody);
      if (!result.success) return invalid(result.error);
      const payload = result.data;
      await deliver({
        kind,
        subject: `Newsletter signup · ${payload.email}`,
        reference: randomUUID().slice(0, 8),
        payload,
      });
      return ok({ message: "You're on the list. Look out for the next issue." });
    }
  }
};
