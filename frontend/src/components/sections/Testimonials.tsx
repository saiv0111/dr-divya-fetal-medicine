import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hero, testimonials } from '@/data/site';
import { EASE, viewportOnce } from '@/lib/motion';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { SplitWords } from '@/components/ui/SplitWords';

const testimonialImages = [
  '/patient_portrait_ananya_rohit.png',
  '/patient_portrait_priya.png',
  '/patient_portrait_sneha.png',
  '/patient_portrait_meera_arjun.png',
];

const Star = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 19" aria-hidden className={className || 'size-3.5'}>
    <path d="M10 0l2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L10 14.3 4.2 17.8l1.6-6.6L.6 6.8l6.8-.5L10 0Z" />
  </svg>
);

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const items = testimonials.items;
  const total = items.length;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  const handlePrev = () => {
    if (isFirst) return;
    setDirection(-1);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isLast) return;
    setDirection(1);
    setCurrentIndex((prev) => prev + 1);
  };

  const currentItem = items[currentIndex];
  const currentImg = testimonialImages[currentIndex % testimonialImages.length];

  return (
    <section id="testimonials" className="scroll-mt-24 py-10">
      <div className="shell">
        {/* Header: Left aligned title/subtitle & Right aligned Swiper Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col text-left">
            <Eyebrow>{testimonials.eyebrow}</Eyebrow>
            <SplitWords
              as="h2"
              words={testimonials.heading.split(' ')}
              className="display-lg mt-3 w-full text-ink-900"
            />

            {/* Aggregate rating */}
            <motion.div
              className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
            >
              <span className="flex gap-1" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-rose-400" />
                ))}
              </span>
              <p className="text-sm text-slate-body">
                <span className="num text-ink-900">{hero.trust.stat}</span> {hero.trust.text}
              </p>
            </motion.div>
          </div>

          {/* Swiper Arrow Buttons on the Right */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirst}
              aria-label="Previous testimonial"
              className="group grid size-12 place-items-center rounded-full border border-ink-900/15 bg-cream-50 text-ink-900 shadow-sm transition-all hover:border-ink-900 hover:bg-ink-900 hover:text-cream-50 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:border-ink-900/15 disabled:hover:bg-cream-50 disabled:hover:text-ink-900 disabled:active:scale-100"
            >
              <svg className="size-5 transition-transform group-hover:-translate-x-0.5 group-disabled:translate-x-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={isLast}
              aria-label="Next testimonial"
              className="group grid size-12 place-items-center rounded-full border border-ink-900/15 bg-cream-50 text-ink-900 shadow-sm transition-all hover:border-ink-900 hover:bg-ink-900 hover:text-cream-50 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:border-ink-900/15 disabled:hover:bg-cream-50 disabled:hover:text-ink-900 disabled:active:scale-100"
            >
              <svg className="size-5 transition-transform group-hover:translate-x-0.5 group-disabled:translate-x-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Testimonial Feature Card */}
        <div className="relative mt-8 md:mt-14">
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-ink-900/10 bg-card p-6 sm:p-10 lg:p-12 shadow-float">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 40 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="grid min-h-[34rem] items-stretch gap-8 sm:min-h-[30rem] lg:min-h-[30rem] lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"
              >
                {/* Left Column: Rectangular Image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-ink-900/10 bg-cream-50 shadow-md sm:rounded-xl lg:aspect-auto lg:h-full">
                  <img
                    src={currentImg}
                    alt={currentItem.name}
                    className="size-full object-cover object-center"
                  />
                </div>

                {/* Right Column: Large Quote & Reviewer info */}
                <div className="flex h-full flex-col justify-between py-2">
                  <div>
                    <p className="text-xl sm:text-2xl lg:text-3xl leading-snug font-normal text-ink-900 tracking-tight">
                      “{currentItem.quote}”
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-ink-900/10 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-ink-900 leading-tight">
                        {currentItem.name}
                      </h3>
                      <p className="text-sm text-slate-body mt-1">
                        {currentItem.context}
                      </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 opacity-70">
                      <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-900 font-semibold">
                        DR. DIVYA
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>


          </div>
        </div>


      </div>
    </section>
  );
};
