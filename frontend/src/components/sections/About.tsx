import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { about, doctor } from '@/data/site';
import { EASE, viewportOnce } from '@/lib/motion';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { SplitWords } from '@/components/ui/SplitWords';
import { ScrollHighlightText } from '@/components/ui/ScrollHighlightText';
import { Reveal } from '@/components/ui/Reveal';

export const About = () => {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);

  return (
    <section
      ref={ref}
      id="about"
      className="relative scroll-mt-24 py-11"
    >
      <div className="shell relative z-10">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* ------------------------------------------------ sticky identity */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow>{about.eyebrow}</Eyebrow>

            <motion.div className="mt-8" style={reduced ? undefined : { y: cardY }}>
              <Reveal scale direction="none" className="relative">
                {/* Light panel with the caption floating over the foot of the
                    photo, rather than the photo bleeding into a dark slab. */}
                <div className="relative overflow-hidden rounded-3xl border border-ink-900/8 bg-card">
                  <img
                    src="/doc-image.png"
                    alt={doctor.name}
                    className="aspect-[5/6] w-full object-cover object-top"
                  />
                  <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-ink-900/8 bg-page/92 px-4 py-3 backdrop-blur">
                    <p className="font-display text-[1.05rem] font-medium text-ink-900">
                      {doctor.name}
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-slate-muted">{doctor.credentials}</p>
                  </div>
                </div>
              </Reveal>
            </motion.div>
          </div>

          {/* ----------------------------------------------------- narrative */}
          <div className="lg:pt-12">
            <SplitWords
              as="h2"
              words={about.heading.split(' ')}
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.12] text-ink-900 w-full"
            />

            <ScrollHighlightText
              text={about.narrative}
              className="mt-9 max-w-[54ch] text-[1.15rem] font-normal leading-[1.6] tracking-[-0.01em] text-ink-900 md:text-[1.3rem]"
            />

            <Reveal delay={0.1} className="mt-10 border-l-2 border-rose-300 pl-6">
              <p className="font-display text-xl leading-snug text-ink-700 md:text-2xl">
                “{about.pullQuote}”
              </p>
            </Reveal>

            {/* Numbers carry themselves at this size; the bordered pill they
                used to sit in was doing nothing but adding a box. */}
            <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-8 border-t border-ink-900/10 pt-9 sm:grid-cols-3">
              {about.facts.map((fact, i) => (
                <motion.div
                  key={fact.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.1 }}
                >
                  <dd className="num text-[2.1rem] font-medium leading-none text-ink-900 sm:text-[2.4rem]">
                    {fact.value}
                  </dd>
                  <dt className="mt-2 text-[0.8rem] text-slate-body">{fact.label}</dt>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};
