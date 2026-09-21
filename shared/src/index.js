import { z } from 'zod';
/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                          */
/* -------------------------------------------------------------------------- */
const trimmed = (min, max, label) => z
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
];
export const serviceIdSchema = z.enum(SERVICE_IDS, {
    errorMap: () => ({ message: 'Please choose a service' }),
});
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
    weeksPregnant: z
        .union([z.coerce.number().int().min(0, 'Enter 0–45').max(45, 'Enter 0–45'), z.literal('')])
        .optional()
        .transform((value) => (value === '' || value === undefined ? undefined : Number(value))),
    message: z.string().trim().max(1000, 'Please keep this under 1000 characters').optional(),
    consent: z.literal(true, {
        errorMap: () => ({ message: 'Please accept the privacy notice to continue' }),
    }),
    /** Honeypot — must stay empty. Bots fill it in. */
    company: z.string().max(0).optional(),
});
/* -------------------------------------------------------------------------- */
/*  Contact + newsletter                                                       */
/* -------------------------------------------------------------------------- */
export const contactRequestSchema = z.object({
    name: trimmed(2, 80, 'Full name'),
    email: emailSchema,
    message: trimmed(10, 1500, 'Message'),
    company: z.string().max(0).optional(),
});
export const newsletterRequestSchema = z.object({
    email: emailSchema,
    company: z.string().max(0).optional(),
});
/* -------------------------------------------------------------------------- */
/*  Blog                                                                       */
/* -------------------------------------------------------------------------- */
export const POST_CATEGORIES = [
    'Fetal Medicine',
    'Pregnancy Care',
    'Genetics',
    'High-Risk Pregnancy',
    "Women's Health",
];
