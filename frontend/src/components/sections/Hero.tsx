import { useRef } from 'react';
import { motion } from 'framer-motion';
import { hero, practice } from '@/data/site';
import { EASE } from '@/lib/motion';
import { scrollTo } from '@/hooks/useLenis';
import { Button } from '@/components/ui/Button';
import { Magnetic } from '@/components/ui/Magnetic';
import { PulseDot } from '@/components/ui/Decor';
import { useBooking } from '@/components/booking/BookingContext';

export const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { open } = useBooking();

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pb-20 pt-20 md:pt-24"
    >
      <div className="shell relative z-10 my-auto">
        <div className="grid items-center gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:gap-10">
          {/* ---------------------------------------------------------- copy */}
          <div>
            <motion.div
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <PulseDot />
              <span className="label text-ink-600">{hero.eyebrow}</span>
            </motion.div>

            {/* Exactly 2 lines for heading */}
            <motion.h1
              className="mt-4 text-[2.5rem] sm:text-[4.1rem] xl:text-[4.6rem] 2xl:text-[4.8rem] font-display font-normal leading-[1.08] text-ink-900 tracking-tight"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            >
              <span className="block whitespace-nowrap">Every heartbeat,</span>
              <span className="block whitespace-nowrap text-rose-500">clearly explained.</span>
            </motion.h1>

            <motion.p
              className="mt-5 max-w-[46ch] text-base sm:text-[1.0625rem] leading-relaxed text-slate-body"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
            >
              {hero.body}
            </motion.p>

            <motion.div
              className="mt-6 flex flex-wrap items-center gap-4 sm:gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
            >
              <Magnetic>
                <Button onClick={() => open()}>{hero.primaryCta}</Button>
              </Magnetic>
              <Magnetic>
                <Button variant="secondary" onClick={() => scrollTo('#about')}>
                  {hero.secondaryCta}
                </Button>
              </Magnetic>
            </motion.div>

            <motion.div
              className="mt-7 flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 0.7 }}
            >
              <div className="flex gap-1" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.svg
                    key={i}
                    viewBox="0 0 20 19"
                    className="size-4 fill-rose-400"
                    initial={{ scale: 0, rotate: -35 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.55, ease: EASE, delay: 0.75 + i * 0.08 }}
                  >
                    <path d="M10 0l2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L10 14.3 4.2 17.8l1.6-6.6L.6 6.8l6.8-.5L10 0Z" />
                  </motion.svg>
                ))}
              </div>
              <p className="text-[0.8125rem] leading-snug text-slate-body">
                <span className="font-medium text-ink-900">{hero.trust.stat}</span>{' '}
                {hero.trust.text}
              </p>
            </motion.div>
          </div>

          {/* ------------------------------------------------------- portrait */}
          {/* A cut-out PNG, so it stands on the page rather than sitting in a
              frame. The soft radial behind it stops it floating on flat white. */}
          <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[min(34rem,105%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--color-cream-200)_0%,transparent_70%)]"
            />
            <motion.img
              src="/pregnant-women-hero.png"
              alt="An expectant mother seated, resting her hands on her bump"
              width={1300}
              height={1216}
              {...{ fetchpriority: 'high' }}
              decoding="async"
              className="relative mx-auto w-full max-w-[34rem] object-contain lg:max-w-[42rem] xl:max-w-[46rem]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
            />
          </div>
        </div>

      </div>

      {/* Emergency line */}
      {/* The centred content above uses auto margins, which left this with no
          gap at all on short viewports. A fixed top margin guarantees one. */}
      <p className="shell relative z-10 mt-16 text-center text-[0.7rem] text-slate-muted md:mt-20">
        Urgent concern about your pregnancy? Call{' '}
        <a href={practice.phoneHref} className="link-wipe text-ink-700">
          {practice.phone}
        </a>{' '}
        or contact your maternity unit.
      </p>
    </section>
  );
};
