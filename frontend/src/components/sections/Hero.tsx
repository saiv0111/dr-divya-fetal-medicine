import { useRef } from 'react';
import { motion } from 'framer-motion';
import { hero, practice } from '@/data/site';
import { EASE } from '@/lib/motion';
import { scrollTo } from '@/hooks/useLenis';
import { Button } from '@/components/ui/Button';
import { Magnetic } from '@/components/ui/Magnetic';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { useBooking } from '@/components/booking/BookingContext';

export const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { open } = useBooking();

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden pb-11 pt-28 md:pt-32"
    >
      {/* Full-bleed photograph. It runs to the top, right and bottom edges of
          the viewport — the navbar is transparent until you scroll, so the
          image reads behind it. A horizontal wash fades it into the page so
          the copy on the left stays legible over the bright bedding. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
        <motion.img
          src="/pregnant-women-hero-new.png"
          alt=""
          width={1431}
          height={1099}
          {...{ fetchpriority: 'high' }}
          decoding="async"
          className="absolute inset-y-0 right-0 size-full object-cover object-[58%_center] lg:w-[68%] xl:w-[64%]"
          /* The photo is a hard-edged rectangle, and fading it with an overlay
             alone still leaves a visible vertical seam where it begins. Masking
             the image itself dissolves that edge into the page. */
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 16%, rgba(0,0,0,0.85) 34%, #000 48%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 16%, rgba(0,0,0,0.85) 34%, #000 48%)',
          }}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
        />
        {/* Below lg the photo sits behind the text, so it needs a heavier veil
            than the side-by-side desktop composition. */}
        <div className="absolute inset-0 bg-gradient-to-r from-page/10 via-page/4 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-page/10 to-transparent" />
      </div>

      <div className="shell relative z-10 my-auto">
        <div className="grid items-center gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10 xl:grid-cols-[1.02fr_0.98fr] [&>*]:min-w-0">
          {/* ---------------------------------------------------------- copy */}
          <div>
            <motion.div
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <Eyebrow>{hero.eyebrow}</Eyebrow>
            </motion.div>

            {/* Exactly 2 lines for heading */}
            <motion.h1
              className="mt-4 text-[2.3rem] sm:text-[4.1rem] lg:text-[3.6rem] xl:text-[4.15rem] 2xl:text-[4.3rem] font-display font-normal leading-[1.16] text-ink-900 tracking-tight"
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

            {/* The urgent line used to sit alone at the foot of the section,
                where it was easy to miss. It matters more than a star rating,
                so it takes that slot instead. */}
            <motion.div
              className="mt-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 0.7 }}
            >
              <p className="text-[0.8125rem] text-slate-body">
                Urgent concern about your pregnancy?
              </p>
              <a
                href={practice.phoneHref}
                className="mt-2 inline-flex items-center gap-2 text-[0.9rem] font-medium text-ink-900 transition-colors duration-300 hover:text-rose-600"
              >
                <svg viewBox="0 0 16 16" aria-hidden className="size-4 text-rose-500">
                  <path
                    d="M5.2 2.6 6.6 5 5.3 6.4a8.4 8.4 0 0 0 4.3 4.3L11 9.4l2.4 1.4-.5 2.1a1 1 0 0 1-1.1.7A11.4 11.4 0 0 1 2.4 4.2a1 1 0 0 1 .7-1.1l2.1-.5Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="num">Call {practice.phone}</span>
              </a>
            </motion.div>
          </div>

        </div>

        {/* Below md the photo cannot sit behind the copy and stay readable —
            washing it out far enough to fix that left almost nothing visible.
            So it becomes its own band underneath instead, at full strength
            with no veil over it. */}
        <motion.img
          src="/pregnant-women-hero-new.png"
          alt="An expectant mother seated on a bed, resting her hands on her bump"
          width={1431}
          height={1099}
          decoding="async"
          className="mt-10 block h-[36vh] w-full rounded-2xl object-cover object-[58%_35%] lg:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
        />
      </div>

    </section>
  );
};
