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
  consent: 'Consent given',
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

/** Also in frontend/src/data/site.ts — change both together. The API cannot
 *  import from the frontend workspace, and this is not worth a shared constant
 *  until a third copy appears. */
const CLINIC_PHONE = '+91 90634 30505';

const ACK_SUBJECT: Record<Delivery['kind'], string> = {
  appointment: 'We have your appointment request',
  contact: 'Thanks for getting in touch',
  newsletter: "You're subscribed",
};

const ACK_INTRO: Record<Delivery['kind'], string> = {
  appointment: "We've got your request. Our front desk will call you within one working day.",
  contact: "We've got your message and will reply within one working day.",
  newsletter: "You're subscribed. Look out for the next issue.",
};

/** A short confirmation for the person who filled the form. Deliberately thin:
 *  it repeats nothing clinical, only that the request arrived. */
const ackBody = ({ kind, reference, payload }: Delivery) => {
  const first = typeof payload.name === 'string' ? payload.name.trim().split(/\s+/)[0] : '';
  return [
    first ? `Hello ${first},` : 'Hello,',
    '',
    ACK_INTRO[kind],
    ...(kind === 'newsletter' ? [] : ['', `Reference: ${reference}`]),
    '',
    `For anything urgent, please call ${CLINIC_PHONE}`,
    '',
    "Dr. Divya's Fetal Medicine Centre",
  ].join('\n');
};

/** Confirms receipt to the enquirer. Failures here must never fail the request:
 *  the clinic's copy is the one that matters, and a bounced acknowledgement is
 *  not a reason to tell a patient their booking did not go through. */
const acknowledge = async (delivery: Delivery): Promise<void> => {
  const to = delivery.payload.email;
  if (typeof to !== 'string' || !to) return;

  try {
    await getTransport().sendMail({
      from: FROM_EMAIL,
      to,
      replyTo: NOTIFY_EMAIL,
      subject: ACK_SUBJECT[delivery.kind],
      text: ackBody(delivery),
    });
  } catch (error) {
    console.error(`[${delivery.kind}] acknowledgement to enquirer failed`, {
      reference: delivery.reference,
      error,
    });
  }
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

  // The clinic's copy first: if this throws, the caller returns an error and
  // the visitor is told to phone instead of being left thinking it arrived.
  await getTransport().sendMail({
    from: FROM_EMAIL,
    to: NOTIFY_EMAIL,
    replyTo: typeof delivery.payload.email === 'string' ? delivery.payload.email : undefined,
    subject: delivery.subject,
    text: format(delivery),
  });

  await acknowledge(delivery);
};
