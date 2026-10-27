/**
 * Outbound delivery for enquiries.
 *
 * Credentials live in the function's environment and never reach the browser,
 * which is the whole reason this runs server-side rather than in the client.
 */
import nodemailer from 'nodemailer';
import { SERVICE_LABELS } from '@drdivya/shared';

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
/** The submitted fields as "Label: value" lines, shared by the clinic's copy
 *  and the enquirer's confirmation. `company` is the honeypot and never shown. */
const detailLines = (payload: Record<string, unknown>, omit: readonly string[] = []) =>
  Object.entries(payload)
    .filter(
      ([key, value]) =>
        key !== 'company' && !omit.includes(key) && value !== undefined && value !== '',
    )
    .map(([key, value]) => {
      const shown =
        key === 'service' && typeof value === 'string' && value in SERVICE_LABELS
          ? SERVICE_LABELS[value as keyof typeof SERVICE_LABELS]
          : String(value);
      return `${LABELS[key] ?? key}: ${shown}`;
    });

const format = ({ kind, reference, payload }: Delivery) => {
  const lines = detailLines(payload);

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

const SITE_URL = 'https://drdivyafetalmedicine.com';
/** Flattened onto white and sized for email, where WebP and PNG alpha are both
 *  unreliable. Remote images are blocked by default in some clients, so the
 *  alt text has to stand on its own. */
const LOGO_URL = `${SITE_URL}/email-logo.png`;

/** `consent` is a record for the clinic, not something to read back to the
 *  person who ticked it. */
const ACK_OMIT = ['consent'] as const;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const greeting = (payload: Record<string, unknown>) => {
  const first = typeof payload.name === 'string' ? payload.name.trim().split(/\s+/)[0] : '';
  return first ? `Hello ${first},` : 'Hello,';
};

/** A short confirmation for the person who filled the form, with their own
 *  submission read back so they can spot a mistyped number or date. */
const ackText = ({ kind, reference, payload }: Delivery) => {
  const details = kind === 'newsletter' ? [] : detailLines(payload, ACK_OMIT);
  return [
    greeting(payload),
    '',
    ACK_INTRO[kind],
    ...(kind === 'newsletter' ? [] : ['', `Reference: ${reference}`]),
    ...(details.length ? ['', 'What you sent us', ...details] : []),
    '',
    `For anything urgent, please call ${CLINIC_PHONE}`,
    '',
    "Dr. Divya's Fetal Medicine Centre",
  ].join('\n');
};

const ackHtml = (delivery: Delivery) => {
  const { kind, reference, payload } = delivery;
  const details = kind === 'newsletter' ? [] : detailLines(payload, ACK_OMIT);
  const rows = details
    .map((line) => {
      const split = line.indexOf(': ');
      const label = escapeHtml(line.slice(0, split));
      const value = escapeHtml(line.slice(split + 2));
      return `<tr><td style="padding:4px 16px 4px 0;color:#6b6460;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:4px 0;color:#2b2522">${value}</td></tr>`;
    })
    .join('');

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f7f4f0;font-family:Helvetica,Arial,sans-serif;color:#2b2522;line-height:1.6">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px">
    <img src="${LOGO_URL}" alt="Dr. Divya's Fetal Medicine Centre" width="180" style="display:block;border:0;margin-bottom:24px">
    <p style="margin:0 0 16px">${escapeHtml(greeting(payload))}</p>
    <p style="margin:0 0 16px">${escapeHtml(ACK_INTRO[kind])}</p>
    ${kind === 'newsletter' ? '' : `<p style="margin:0 0 20px;color:#6b6460">Reference: <strong style="color:#2b2522">${escapeHtml(reference)}</strong></p>`}
    ${
      rows
        ? `<p style="margin:0 0 8px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6b6460">What you sent us</p>
    <table cellpadding="0" cellspacing="0" style="font-size:15px;margin:0 0 20px">${rows}</table>`
        : ''
    }
    <p style="margin:0 0 20px">For anything urgent, please call <a href="tel:+919063430505" style="color:#c0493d;text-decoration:none">${CLINIC_PHONE}</a></p>
    <p style="margin:0;color:#6b6460;font-size:14px">Dr. Divya's Fetal Medicine Centre</p>
  </div>
</body></html>`;
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
      // Both parts: the HTML one carries the logo, the text one is what a
      // client with images or HTML disabled falls back to.
      text: ackText(delivery),
      html: ackHtml(delivery),
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
