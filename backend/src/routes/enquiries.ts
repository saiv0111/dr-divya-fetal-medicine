import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import {
  appointmentRequestSchema,
  contactRequestSchema,
  newsletterRequestSchema,
} from '@drdivya/shared';
import { asyncHandler } from '../middleware/error.js';
import { writeLimiter } from '../middleware/rateLimit.js';
import { deliver } from '../services/notifier.js';

export const enquiriesRouter = Router();

enquiriesRouter.use(writeLimiter);

/**
 * Honeypot field. A real browser leaves it empty because it is visually hidden
 * and `tabindex=-1`; naive bots fill every input they find. We answer 200 so
 * the bot believes it succeeded and does not retry.
 */
const isBot = (body: unknown) =>
  typeof body === 'object' && body !== null && Boolean((body as { company?: string }).company);

enquiriesRouter.post(
  '/appointments',
  asyncHandler(async (req, res) => {
    if (isBot(req.body)) {
      res.status(202).json({ ok: true, data: { reference: 'queued' } });
      return;
    }

    const payload = appointmentRequestSchema.parse(req.body);
    const reference = `FM-${randomUUID().slice(0, 8).toUpperCase()}`;

    await deliver({
      kind: 'appointment',
      subject: `New appointment request · ${payload.service} · ${payload.name}`,
      reference,
      payload,
    });

    res.status(201).json({
      ok: true,
      data: {
        reference,
        message:
          'Request received. Our front desk will confirm your slot by phone within one working day.',
      },
    });
  }),
);

enquiriesRouter.post(
  '/contact',
  asyncHandler(async (req, res) => {
    if (isBot(req.body)) {
      res.status(202).json({ ok: true, data: { message: 'Thanks — we will be in touch.' } });
      return;
    }

    const payload = contactRequestSchema.parse(req.body);
    await deliver({
      kind: 'contact',
      subject: `Website enquiry from ${payload.name}`,
      reference: randomUUID().slice(0, 8),
      payload,
    });

    res.status(201).json({
      ok: true,
      data: { message: 'Thank you — we usually reply within one working day.' },
    });
  }),
);

enquiriesRouter.post(
  '/newsletter',
  asyncHandler(async (req, res) => {
    if (isBot(req.body)) {
      res.status(202).json({ ok: true, data: { message: 'Subscribed.' } });
      return;
    }

    const payload = newsletterRequestSchema.parse(req.body);
    await deliver({
      kind: 'newsletter',
      subject: `Newsletter signup · ${payload.email}`,
      reference: randomUUID().slice(0, 8),
      payload,
    });

    res.status(201).json({
      ok: true,
      data: { message: "You're on the list. Look out for the next issue." },
    });
  }),
);
