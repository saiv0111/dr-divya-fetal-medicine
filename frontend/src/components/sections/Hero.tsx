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
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
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
              className="mt-3 text-3xl sm:text-4xl lg:text-[3.25rem] xl:text-[3.75rem] font-display font-normal leading-[1.12] text-ink-900 tracking-tight"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            >
              <span className="block whitespace-nowrap">Every heartbeat,</span>
              <span className="block whitespace-nowrap text-rose-500">clearly explained.</span>
            </motion.h1>

            <motion.p
              className="mt-4 max-w-[44ch] text-sm sm:text-base leading-relaxed text-slate-body"
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
              className="mt-6 flex items-center gap-4 border-t border-ink-900/10 pt-4"
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
          <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
            <div className="relative overflow-hidden rounded-2xl border border-ink-900/10 bg-ink-950 shadow-float">
              <motion.div
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                animate={{ clipPath: 'inset(0% 0 0 0)' }}
                transition={{ duration: 1.3, ease: EASE, delay: 0.25 }}
              >
                <img
                  src="/pregnant-lady.png"
                  alt="An expectant mother resting her hands on her bump"
                  width={1536}
                  height={1024}
                  // React 18 does not recognise the camelCase form and forwards it
                  // to the DOM with a warning; lowercase is what the browser reads.
                  {...{ fetchpriority: 'high' }}
                  decoding="async"
                  className="aspect-[4/3] sm:aspect-[14/11] lg:aspect-[4/3] w-full max-h-[380px] lg:max-h-[400px] object-cover object-[82%_center]"
                />
              </motion.div>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-ink-950 via-ink-950/45 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink-950/90 to-transparent"
              />
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------- scroll cue */}
        <motion.button
          type="button"
          onClick={() => scrollTo('#about')}
          className="group mx-auto mt-4 flex w-fit items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <span className="label text-ink-500 transition-colors group-hover:text-rose-500">
            Scroll
          </span>
          <span className="relative h-7 w-px overflow-hidden bg-ink-900/15">
            <motion.span
              className="absolute inset-x-0 top-0 block h-2.5 bg-rose-500"
              animate={{ y: [-14, 28] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.button>
      </div>

      {/* Emergency line */}
      <p className="shell relative z-10 text-center text-[0.7rem] text-slate-muted">
        Urgent concern about your pregnancy? Call{' '}
        <a href={practice.phoneHref} className="link-wipe text-ink-700">
          {practice.phone}
        </a>{' '}
        or contact your maternity unit.
      </p>
    </section>
  );
};
