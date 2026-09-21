import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { newsletterRequestSchema, type NewsletterRequest } from '@drdivya/shared';
import { doctor, footer, practice } from '@/data/site';
import { ApiError, api } from '@/lib/api';
import { EASE, viewportOnce } from '@/lib/motion';
import { cn, scrollToId } from '@/lib/utils';
import { scrollTo } from '@/hooks/useLenis';
import { ArrowIcon } from '@/components/ui/Button';
import { Honeypot } from '@/components/ui/Field';
import { useBooking } from '@/components/booking/BookingContext';

const NewsletterForm = () => {
  const [sent, setSent] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterRequest>({
    resolver: zodResolver(newsletterRequestSchema),
    defaultValues: { email: '', company: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await api.subscribe(values);
      setSent(result.message);
      reset();
    } catch (error) {
      setError('email', {
        type: 'server',
        message: error instanceof ApiError ? error.message : 'Please try again.',
      });
    }
  });

  if (sent) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-cream-100/15 bg-cream-100/5 px-4 py-3.5 text-sm text-cream-100/80"
      >
        {sent}
      </motion.p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <Honeypot {...register('company')} />
      <div
        className={cn(
          'flex items-center gap-2 rounded-full border bg-cream-100/5 py-1.5 pl-5 pr-1.5 transition-colors duration-300 focus-within:border-cream-100/40',
          errors.email ? 'border-rose-300/70' : 'border-cream-100/18',
        )}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email) || undefined}
          className="min-w-0 flex-1 bg-transparent text-sm text-cream-50 outline-none placeholder:text-cream-100/35"
          {...register('email')}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-page text-ink-900 transition-transform duration-300 hover:scale-105 disabled:opacity-50"
          aria-label={footer.newsletter.cta}
        >
          <ArrowIcon />
        </button>
      </div>
      {errors.email && (
        <p role="alert" className="mt-2 pl-5 text-xs text-rose-300">
          {errors.email.message}
        </p>
      )}
    </form>
  );
};

export const Footer = () => {
  const { open } = useBooking();

  const handleAnchor = (href: string) => (event: React.MouseEvent) => {
    if (href === '#book') {
      event.preventDefault();
      open();
      return;
    }
    if (!href.includes('#')) return;
    event.preventDefault();
    const hash = `#${href.split('#')[1]}`;
    if (!scrollTo(hash)) scrollToId(hash);
  };

  return (
    <footer className="relative overflow-hidden bg-shell text-cream-100">
      <div className="shell relative z-10 pt-20">
        <div className="grid gap-14 pb-16 lg:grid-cols-[1.25fr_1fr_1fr_1.2fr] lg:gap-10">
          <div className="max-w-sm">
            <Link to="/" aria-label={practice.name}>
              <img
                src="/fetal-medicine-logo.png"
                alt={practice.name}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-cream-100/60">{footer.blurb}</p>
            <div className="mt-7 space-y-1.5 text-sm">
              <a href={practice.phoneHref} className="link-wipe block w-fit text-cream-100/85">
                {practice.phone}
              </a>
              <a href={`mailto:${practice.email}`} className="link-wipe block w-fit text-cream-100/85">
                {practice.email}
              </a>
            </div>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="label text-cream-100/40">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/blog') ? (
                      <Link to={link.href} className="link-wipe text-sm text-cream-100/70 hover:text-cream-50">
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        onClick={handleAnchor(link.href)}
                        className="link-wipe text-sm text-cream-100/70 hover:text-cream-50"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="label text-cream-100/40">{footer.newsletter.heading}</p>
            <p className="mb-5 mt-5 text-sm leading-relaxed text-cream-100/60">
              {footer.newsletter.body}
            </p>
            <NewsletterForm />
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
              {practice.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="label link-wipe text-cream-100/50 hover:text-cream-50"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Oversized wordmark that rises into place as the footer enters view. */}
        <div className="overflow-hidden border-t border-cream-100/12 pt-10">
          {/* SVG rather than a font-size clamp: `textLength` pins the word to the
              container width, so it fits exactly at every breakpoint instead of
              running past the edge on wide screens. */}
          <motion.svg
            aria-hidden
            viewBox="0 0 1000 150"
            preserveAspectRatio="xMidYMid meet"
            className="block w-full select-none overflow-visible"
            initial={{ y: '18%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <text
              x="500"
              y="118"
              textAnchor="middle"
              textLength="1000"
              lengthAdjust="spacing"
              fontSize="150"
              className="fill-cream-100/10 font-display"
            >
              Fetal Medicine
            </text>
          </motion.svg>
        </div>

        <div className="flex flex-col gap-6 border-t border-cream-100/12 py-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-[0.7rem] leading-relaxed text-cream-100/40">{footer.disclaimer}</p>
            <p className="text-[0.7rem] text-cream-100/30">
              © {new Date().getFullYear()} {practice.name}. {doctor.registration}.
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="link-wipe text-[0.7rem] text-cream-100/45">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
