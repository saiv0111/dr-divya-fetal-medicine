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
      className="relative min-h-screen flex flex-col justify-between overflow-hidden pb-20 pt-28 md:pt-32"
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
        <div className="grid items-center gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10 xl:grid-cols-[1.02fr_0.98fr]">
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
              className="mt-4 text-[2.5rem] sm:text-[4.1rem] xl:text-[4.6rem] 2xl:text-[4.8rem] font-display font-normal leading-[1.14] text-ink-900 tracking-tight"
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
