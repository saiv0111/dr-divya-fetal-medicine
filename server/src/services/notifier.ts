import { env } from '../env.js';
import { logger } from '../logger.js';

export interface Delivery {
  kind: 'appointment' | 'contact' | 'newsletter';
  subject: string;
  reference: string;
  payload: Record<string, unknown>;
}

/** Patient-identifiable fields we never want landing in a log aggregator. */
const SENSITIVE_KEYS = new Set(['email', 'phone', 'message', 'weeksPregnant']);

const redact = (payload: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      SENSITIVE_KEYS.has(key) && value !== undefined ? '[redacted]' : value,
    ]),
  );

/**
 * Single seam for outbound notification. Today it writes a redacted audit line;
 * wire an SMTP transport, a CRM, or the practice-management API in here and
 * every route picks it up unchanged.
 */
export const deliver = async (delivery: Delivery): Promise<void> => {
  if (!env.SMTP_URL) {
    logger.info(`[${delivery.kind}] ${delivery.subject}`, {
      reference: delivery.reference,
      payload: redact(delivery.payload),
      note: 'SMTP_URL not configured — submission logged only.',
    });
    return;
  }

  // Intentionally left as an explicit integration point rather than a silent
  // no-op: fail loudly if SMTP is configured but no transport has been added.
  throw new Error(
    'SMTP_URL is set but no mail transport is wired up. Implement it in services/notifier.ts.',
  );
};
