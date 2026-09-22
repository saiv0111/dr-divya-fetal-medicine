import { motion } from 'framer-motion';
import { cta, practice } from '@/data/site';
import { EASE, viewportOnce } from '@/lib/motion';
import { Button, ButtonLink } from '@/components/ui/Button';
import { useBooking } from '@/components/booking/BookingContext';
import { Eyebrow } from '@/components/ui/SectionHeading';

/**
 * Closing call to action.
 *
 * Reworked to the reference: a flat near-black panel, a pill eyebrow, and the
 * two buttons. The concentric "ultrasound" rings and the magnetic cursor pull
 * are gone — they were decoration competing with the one thing this section
 * exists to do.
 */
export const CTA = () => {
  const { open } = useBooking();

  return (
    <section id="cta" className="py-11">
      <div className="shell">
        <motion.div
          className="rounded-[2rem] bg-shell px-6 py-20 text-center md:px-16 md:py-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center">
            <Eyebrow tone="light">{cta.eyebrow}</Eyebrow>

            <h2 className="mt-6 max-w-[16ch] font-display text-[2rem] font-medium leading-[1.16] text-cream-50 sm:text-[2.6rem] lg:text-[3rem]">
              {cta.heading}
            </h2>

            <p className="mt-6 max-w-[48ch] text-[0.95rem] leading-relaxed text-cream-100/60">
              {cta.body}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button variant="onDark" onClick={() => open()}>
                {cta.primary}
              </Button>
              <ButtonLink href={practice.phoneHref} variant="outlineOnDark" withArrow={false}>
                {cta.secondary} · <span className="num">{practice.phone}</span>
              </ButtonLink>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
