import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { appointmentRequestSchema, type AppointmentRequestInput } from '@drdivya/shared';
import { ApiError, api } from '@/lib/api';
import { EASE } from '@/lib/motion';
import { todayIso } from '@/lib/utils';
import { practice, services } from '@/data/site';
import { Button } from '@/components/ui/Button';
import { Checkbox, Honeypot, Input, Select, Textarea } from '@/components/ui/Field';
import { useBooking } from './BookingContext';

type Status = { state: 'idle' | 'sending' } | { state: 'sent'; reference: string; message: string };

export const BookingDrawer = () => {
  const { isOpen, preselected, close } = useBooking();
  const [status, setStatus] = useState<Status>({ state: 'idle' });
  const [formError, setFormError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AppointmentRequestInput>({
    resolver: zodResolver(appointmentRequestSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', phone: '', preferredDate: '', message: '', company: '' },
  });

  // Re-seed the service whenever the drawer is opened from a specific card.
  useEffect(() => {
    if (isOpen && preselected) setValue('service', preselected);
  }, [isOpen, preselected, setValue]);

  // Escape to dismiss, and move focus into the panel on open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('input, select, button')?.focus();
    }, 320);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(timer);
    };
  }, [isOpen, close]);

  const onSubmit = handleSubmit(async (values) => {
    setStatus({ state: 'sending' });
    setFormError(null);
    try {
      const result = await api.submitAppointment(values);
      setStatus({ state: 'sent', reference: result.reference, message: result.message });
      reset();
    } catch (error) {
      setStatus({ state: 'idle' });
      if (error instanceof ApiError && error.fields) {
        // Server-side validation wins — mirror it onto the matching inputs.
        for (const [field, message] of Object.entries(error.fields)) {
          setError(field as keyof AppointmentRequestInput, { type: 'server', message });
        }
      }
      setFormError(error instanceof ApiError ? error.message : 'Something went wrong.');
    }
  });

  const handleClose = () => {
    close();
    // Let the exit animation finish before resetting the success state.
    window.setTimeout(() => setStatus({ state: 'idle' }), 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Book an appointment"
        >
          <motion.div
            className="absolute inset-0 bg-ink-950/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={handleClose}
          />

          <motion.div
            ref={panelRef}
            className="relative flex max-h-[min(92vh,52rem)] w-full max-w-[34rem] flex-col overflow-hidden rounded-3xl bg-page shadow-float"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.38, ease: EASE }}
          >
            <header className="flex items-start justify-between gap-6 border-b border-ink-900/10 px-6 py-6 md:px-9">
              <div>
                <p className="label text-ink-600">Appointments</p>
                <h2 className="mt-2 font-display text-3xl leading-none">Book a scan</h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close booking form"
                className="grid size-10 shrink-0 place-items-center rounded-full border border-ink-900/15 transition-colors duration-300 hover:bg-ink-900 hover:text-cream-100"
              >
                <svg viewBox="0 0 14 14" aria-hidden className="size-3.5">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            {/* data-lenis-prevent: Lenis preventDefaults wheel events globally, which
                otherwise stops this panel from scrolling. */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-7 md:px-9">
              {status.state === 'sent' ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex h-full flex-col items-start justify-center gap-5 text-center"
                >
                  <div className="mx-auto grid size-16 place-items-center rounded-full bg-sage-200">
                    <svg viewBox="0 0 24 24" aria-hidden className="size-7 text-sage-600">
                      <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="w-full text-center">
                    <h3 className="font-display text-3xl">Request received</h3>
                    <p className="mx-auto mt-3 max-w-[38ch] text-sm leading-relaxed text-slate-body">
                      {status.message}
                    </p>
                    <p className="label num mt-5 text-ink-600">Reference {status.reference}</p>
                  </div>
                  <Button variant="secondary" className="mx-auto" onClick={handleClose}>
                    Done
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-5">
                  <p className="text-sm leading-relaxed text-slate-body">
                    Tell us a little and the front desk will call to confirm a slot — usually
                    within one working day. Urgent?{' '}
                    <a href={practice.phoneHref} className="link-wipe text-ink-900">
                      Call {practice.phone}
                    </a>
                    .
                  </p>

                  <Honeypot {...register('company')} />

                  <Input
                    label="Full name"
                    autoComplete="name"
                    placeholder="Your name"
                    error={errors.name?.message}
                    {...register('name')}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+91 ..."
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                  </div>

                  <Select label="Service" error={errors.service?.message} defaultValue="" {...register('service')}>
                    <option value="" disabled>
                      Choose a scan or consultation
                    </option>
                    {services.items.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} · {service.window}
                      </option>
                    ))}
                    <option value="other">Not sure — please advise</option>
                  </Select>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Preferred date"
                      type="date"
                      min={todayIso()}
                      error={errors.preferredDate?.message}
                      {...register('preferredDate')}
                    />
                    <Input
                      label="Weeks pregnant"
                      type="number"
                      min={0}
                      max={45}
                      placeholder="Optional"
                      hint="Helps us book the right slot length"
                      error={errors.weeksPregnant?.message}
                      {...register('weeksPregnant')}
                    />
                  </div>

                  <Textarea
                    label="Anything we should know"
                    placeholder="Referral details, previous findings, questions you want time for…"
                    error={errors.message?.message}
                    {...register('message')}
                  />

                  <Checkbox
                    label={
                      <>
                        I agree that my details may be used to contact me about this appointment,
                        in line with the practice privacy notice.
                      </>
                    }
                    error={errors.consent?.message}
                    {...register('consent')}
                  />

                  {formError && (
                    <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-xs text-rose-600">
                      {formError}
                    </p>
                  )}

                  <Button type="submit" className="w-full" disabled={status.state === 'sending'}>
                    {status.state === 'sending' ? 'Sending…' : 'Request appointment'}
                  </Button>

                  <p className="text-center text-[0.7rem] leading-relaxed text-slate-muted">
                    This form is not monitored for emergencies. If you have urgent symptoms,
                    contact your maternity unit.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
