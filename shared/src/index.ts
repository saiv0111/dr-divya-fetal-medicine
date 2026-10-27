import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                          */
/* -------------------------------------------------------------------------- */

const trimmed = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `${label} is required` })
    .trim()
    .min(min, min === 1 ? `${label} is required` : `${label} must be at least ${min} characters`)
    .max(max, `${label} must be under ${max} characters`);

/** Permissive international phone: digits, spaces, +, -, (), 7–20 chars. */
export const phoneSchema = z
  .string({ required_error: 'Phone number is required' })
  .trim()
  .min(7, 'Please enter a valid phone number')
  .max(20, 'Please enter a valid phone number')
  .regex(/^[+]?[\d\s()-]{7,20}$/, 'Please enter a valid phone number');

export const emailSchema = z
  .string({ required_error: 'Email is required' })
  .trim()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(254, 'Please enter a valid email address');

/* -------------------------------------------------------------------------- */
/*  Appointment request                                                        */
/* -------------------------------------------------------------------------- */

export const SERVICE_IDS = [
  'nt-scan',
  'anomaly-scan',
  'growth-doppler',
  'early-viability',
  'fetal-echo',
  'high-risk-consult',
  'genetic-counselling',
  'other',
] as const;

export const serviceIdSchema = z.enum(SERVICE_IDS, {
  errorMap: () => ({ message: 'Please choose a service' }),
});

/** Readable names for the ids above. Lives here rather than in the frontend's
 *  site data because the API needs them too, and emails that say
 *  "Service: anomaly-scan" read like a database dump. */
export const SERVICE_LABELS: Record<(typeof SERVICE_IDS)[number], string> = {
  'early-viability': 'Early Viability Scan',
  'nt-scan': 'NT & First Trimester Screening',
  'anomaly-scan': 'Detailed Anomaly Scan',
  'fetal-echo': 'Fetal Echocardiography',
  'growth-doppler': 'Growth & Doppler Surveillance',
  'high-risk-consult': 'High-Risk Pregnancy Consult',
  'genetic-counselling': 'Genetic Counselling & Testing',
  other: 'Something else',
};

export const appointmentRequestSchema = z.object({
  name: trimmed(2, 80, 'Full name'),
  email: emailSchema,
  phone: phoneSchema,
  service: serviceIdSchema,
  /** ISO `yyyy-mm-dd`. Must be today or later. */
  preferredDate: z
    .string({ required_error: 'Preferred date is required' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a valid date')
    .refine((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const picked = new Date(`${value}T00:00:00`);
      return !Number.isNaN(picked.getTime()) && picked >= today;
    }, 'Please choose today or a future date'),
  // An untouched input posts "", and Number("") is 0 — so the empty case is
  // mapped out BEFORE coercion. A union with z.coerce.number() first cannot do
  // this: it matches "" as 0 and the empty branch never runs, which is how a
  // blank field reached the clinic's inbox as "Weeks pregnant: 0".
  // `.optional()` belongs on the INNER schema: an outer one tests the raw input,
  // which is "" rather than undefined, so the blank value would still reach the
  // number check and fail as NaN.
  weeksPregnant: z.preprocess(
    (value) => (value === '' || value === null ? undefined : value),
    z.coerce.number().int().min(0, 'Enter 0–45').max(45, 'Enter 0–45').optional(),
  ),
  message: z.string().trim().max(1000, 'Please keep this under 1000 characters').optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Please accept the privacy notice to continue' }),
  }),
  /** Honeypot — must stay empty. Bots fill it in. */
  company: z.string().max(0).optional(),
});

export type AppointmentRequest = z.infer<typeof appointmentRequestSchema>;
export type AppointmentRequestInput = z.input<typeof appointmentRequestSchema>;

/* -------------------------------------------------------------------------- */
/*  Contact + newsletter                                                       */
/* -------------------------------------------------------------------------- */

export const contactRequestSchema = z.object({
  name: trimmed(2, 80, 'Full name'),
  email: emailSchema,
  message: trimmed(10, 1500, 'Message'),
  company: z.string().max(0).optional(),
});
export type ContactRequest = z.infer<typeof contactRequestSchema>;

export const newsletterRequestSchema = z.object({
  email: emailSchema,
  company: z.string().max(0).optional(),
});
export type NewsletterRequest = z.infer<typeof newsletterRequestSchema>;

/* -------------------------------------------------------------------------- */
/*  Blog                                                                       */
/* -------------------------------------------------------------------------- */

export const POST_CATEGORIES = [
  'Fetal Medicine',
  'Pregnancy Care',
  'Genetics',
  'High-Risk Pregnancy',
  "Women's Health",
] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  publishedAt: string;
  readingMinutes: number;
  cover: { tone: string; label: string };
  featured?: boolean;
}

export interface Post extends PostSummary {
  /** Lightweight block content — no dangerouslySetInnerHTML anywhere. */
  body: Array<
    | { type: 'paragraph'; text: string }
    | { type: 'heading'; text: string }
    | { type: 'list'; items: string[] }
    | { type: 'callout'; text: string }
  >;
}

/* -------------------------------------------------------------------------- */
/*  API envelope                                                               */
/* -------------------------------------------------------------------------- */

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = {
  ok: false;
  error: { message: string; code: string; fields?: Record<string, string> };
};
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
