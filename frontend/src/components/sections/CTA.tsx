import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { cta, practice } from '@/data/site';
import { EASE, viewportOnce } from '@/lib/motion';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Magnetic } from '@/components/ui/Magnetic';
import { SplitWords } from '@/components/ui/SplitWords';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { useBooking } from '@/components/booking/BookingContext';

export const CTA = () => {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { open } = useBooking();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section id="cta" ref={ref} className="py-10">
      <div className="shell">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink-900 px-6 py-20 text-center md:px-16 md:py-28">


          {/* Concentric rings echo the ultrasound cone. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={reduced ? undefined : { rotate: ringRotate }}
          >
            {[22, 32, 44].map((size, i) => (
              <span
                key={size}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream-100/8"
                style={{ width: `${size}rem`, height: `${size}rem`, animationDelay: `${i * 0.4}s` }}
              />
            ))}
          </motion.div>

          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
            <Eyebrow tone="light">{cta.eyebrow}</Eyebrow>

            <SplitWords
              as="h2"
              words={[
                { text: 'Bring' },
                { text: 'your' },
                { text: 'questions.' },
                { text: 'All', accent: true },
                { text: 'of', accent: true },
                { text: 'them.', accent: true },
              ]}
              className="display-lg mt-6 text-cream-50"
            />

            <motion.p
              className="mt-7 max-w-[48ch] text-[0.95rem] leading-relaxed text-cream-100/65"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
            >
              {cta.body}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE, delay: 0.42 }}
            >
              <Magnetic>
                <Button variant="onDark" onClick={() => open()}>
                  {cta.primary}
                </Button>
              </Magnetic>
              <Magnetic>
                <ButtonLink href={practice.phoneHref} variant="outlineOnDark" withArrow={false}>
                  {cta.secondary} · {practice.phone}
                </ButtonLink>
              </Magnetic>
            </motion.div>

            <motion.a
              href={`mailto:${practice.email}`}
              className="link-wipe mt-9 text-sm text-cream-100/50 hover:text-cream-100"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, delay: 0.55 }}
            >
              {practice.email}
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
};
