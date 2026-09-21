/**
 * Adapts `handleEnquiry` to a Node request/response pair.
 *
 * Typed against plain `node:http` rather than `@vercel/node` on purpose: the
 * same handler then runs unchanged as a Vercel function and as Vite dev
 * middleware, so there is no "works locally, breaks deployed" gap.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { type EnquiryKind, handleEnquiry } from './enquiry';

/** Vercel pre-parses JSON onto `req.body`; a bare Node server does not. */
type MaybeParsed = IncomingMessage & { body?: unknown };

const MAX_BYTES = 32 * 1024;

const readJson = async (req: MaybeParsed): Promise<unknown> => {
  if (req.body !== undefined && req.body !== null && typeof req.body !== 'string') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    return req.body ? JSON.parse(req.body) : {};
  }

  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    const buf = chunk as Buffer;
    size += buf.length;
    if (size > MAX_BYTES) throw new Error('payload_too_large');
    chunks.push(buf);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
};

const send = (res: ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
};

export const createEnquiryHandler =
  (kind: EnquiryKind) =>
  async (req: MaybeParsed, res: ServerResponse): Promise<void> => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      send(res, 405, {
        ok: false,
        error: { code: 'method_not_allowed', message: 'Use POST.' },
      });
      return;
    }

    let body: unknown;
    try {
      body = await readJson(req);
    } catch {
      send(res, 400, {
        ok: false,
        error: { code: 'invalid_body', message: 'Could not read that request.' },
      });
      return;
    }

    try {
      const result = await handleEnquiry(kind, body);
      send(res, result.status, result.body);
    } catch (error) {
      // Never leak an SMTP error or stack trace to the browser, but make sure
      // it is visible in the function logs.
      console.error(`[${kind}] delivery failed`, error);
      send(res, 500, {
        ok: false,
        error: {
          code: 'delivery_failed',
          message:
            'We could not submit that just now. Please call the clinic and we will help straight away.',
        },
      });
    }
  };
