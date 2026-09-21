/**
 * Outbound delivery for enquiries.
 *
 * Credentials live in the function's environment and never reach the browser,
 * which is the whole reason this runs server-side rather than in the client.
 */
import nodemailer from 'nodemailer';

export interface Delivery {
  kind: 'appointment' | 'contact' | 'newsletter';
  subject: string;
  reference: string;
  payload: Record<string, unknown>;
}

const SMTP_URL = process.env.SMTP_URL;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL ?? NOTIFY_EMAIL;
const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

/** Patient-identifiable fields we never want landing in a log aggregator. */
const SENSITIVE_KEYS = new Set(['email', 'phone', 'message', 'weeksPregnant']);

const redact = (payload: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      SENSITIVE_KEYS.has(key) && value !== undefined ? '[redacted]' : value,
    ]),
  );

const LABELS: Record<string, string> = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  service: 'Service',
  weeksPregnant: 'Weeks pregnant',
  preferredDate: 'Preferred date',
  message: 'Message',
  referredBy: 'Referred by',
};

/** A plain-text body a front-desk reader can scan without decoding JSON. */
const format = ({ kind, reference, payload }: Delivery) => {
  const lines = Object.entries(payload)
    .filter(([key, value]) => key !== 'company' && value !== undefined && value !== '')
    .map(([key, value]) => `${LABELS[key] ?? key}: ${String(value)}`);

  return [
    `A new ${kind} enquiry came in from the website.`,
    '',
    ...lines,
    '',
    `Reference: ${reference}`,
    `Received: ${new Date().toISOString()}`,
  ].join('\n');
};

let transport: nodemailer.Transporter | null = null;
const getTransport = () => {
  if (!transport) transport = nodemailer.createTransport(SMTP_URL);
  return transport;
};

export const deliver = async (delivery: Delivery): Promise<void> => {
  if (!SMTP_URL || !NOTIFY_EMAIL) {
    // Losing a patient's appointment request silently is far worse than an
    // error, so an unconfigured production deploy fails loudly instead.
    if (isProd) {
      throw new Error(
        'SMTP_URL and NOTIFY_EMAIL must be set — refusing to accept an enquiry that cannot be delivered.',
      );
    }
    // The subject line embeds the sender's email or name, so it is left out
    // rather than undoing the redaction one line below it.
    console.info(`[${delivery.kind}] enquiry received`, {
      reference: delivery.reference,
      payload: redact(delivery.payload),
      note: 'SMTP_URL/NOTIFY_EMAIL not set — logged only (development).',
    });
    return;
  }

  await getTransport().sendMail({
    from: FROM_EMAIL,
    to: NOTIFY_EMAIL,
    replyTo: typeof delivery.payload.email === 'string' ? delivery.payload.email : undefined,
    subject: delivery.subject,
    text: format(delivery),
  });
};
