import { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { services } from '@/data/site';
import { EASE, viewportOnce } from '@/lib/motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { useBooking } from '@/components/booking/BookingContext';

/** Follows the cursor across the service list with a soft spring lag. */
const CursorChip = ({ visible, x, y }: { visible: boolean; x: number; y: number }) => {
  const springX = useSpring(useMotionValue(0), { stiffness: 280, damping: 26, mass: 0.6 });
  const springY = useSpring(useMotionValue(0), { stiffness: 280, damping: 26, mass: 0.6 });
  springX.set(x);
  springY.set(y);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed z-30 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
          style={{ left: springX, top: springY }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          <span className="label grid size-[5.5rem] place-items-center rounded-full bg-ink-900 text-center text-[0.5625rem] leading-tight text-cream-100">
            Book
            <br />
            this scan
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Services = () => {
  const { open } = useBooking();
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  return (
    <section
      id="services"
      className="relative scroll-mt-24 overflow-hidden py-24 md:py-32 lg:py-40"
      onPointerMove={(event) => {
        if (event.pointerType === 'mouse') setCursor({ x: event.clientX, y: event.clientY });
      }}
    >
      <CursorChip visible={!reduced && active !== null} x={cursor.x} y={cursor.y} />

      <div className="shell relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            eyebrow={services.eyebrow}
            heading={services.heading}
            intro={services.intro}
          />
          <motion.p
            className="label text-ink-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {services.items.length} services
          </motion.p>
        </div>

        <ul
          ref={listRef}
          className="mt-14 border-t border-ink-900/12"
          onPointerLeave={() => setActive(null)}
        >
          {services.items.map((service, index) => {
            const isActive = active === index;
            return (
              <motion.li
                key={service.id}
                className="group relative border-b border-ink-900/12"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.65, ease: EASE, delay: Math.min(index * 0.06, 0.3) }}
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse') setActive(index);
                }}
                onFocusCapture={() => setActive(index)}
              >
                {/* Cream wash so the active row lifts off the page. */}
                <motion.span
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-cream-50"
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                />

                <button
                  type="button"
                  onClick={() => open(service.id)}
                  className="flex w-full items-center gap-5 px-1 py-7 text-left md:gap-8 md:px-5 md:py-8"
                  aria-label={`Book ${service.name}`}
                >
                  <span className="label w-8 shrink-0 text-ink-400">{service.index}</span>

                  <motion.span
                    className="flex-1 font-display text-[1.65rem] leading-tight tracking-tight text-ink-900 md:text-[2.25rem]"
                    animate={reduced ? undefined : { x: isActive ? 10 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    {service.name}
                  </motion.span>

                  <span className="hidden shrink-0 text-right md:block">
                    <span className="label block text-ink-500">{service.window}</span>
                    <span className="label mt-1 block text-[0.5625rem] text-ink-400">
                      {service.duration}
                    </span>
                  </span>

                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-ink-900/15 text-ink-700 transition-all duration-500 group-hover:border-ink-900 group-hover:bg-ink-900 group-hover:text-cream-100">
                    <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                {/* Detail panel: always visible on small screens, hover-revealed above lg. */}
                <div className="px-1 pb-7 md:px-5 lg:hidden">
                  <ServiceDetail service={service} />
                </div>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      className="hidden overflow-hidden lg:block"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.5, ease: EASE },
                        opacity: { duration: 0.3 },
                      }}
                    >
                      <div className="px-5 pb-8 pl-[3.25rem]">
                        <ServiceDetail service={service} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>

        <motion.div
          className="mt-12 flex flex-wrap items-center gap-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Button onClick={() => open()}>Book an appointment</Button>
          <p className="text-[0.8125rem] text-slate-body">
            Not sure which scan you need? Ask us — we will tell you honestly if you do not need one.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const ServiceDetail = ({ service }: { service: (typeof services.items)[number] }) => (
  <div className="grid gap-5 md:grid-cols-[1.4fr_1fr] md:gap-10">
    <p className="max-w-[52ch] text-[0.9rem] leading-relaxed text-slate-body">{service.summary}</p>
    <ul className="flex flex-wrap content-start gap-1.5">
      <li className="label rounded-full bg-ink-900/6 px-3 py-1.5 text-ink-600 md:hidden">
        {service.window} · {service.duration}
      </li>
      {service.includes.map((item) => (
        <li key={item} className="label rounded-full bg-ink-900/6 px-3 py-1.5 text-ink-600">
          {item}
        </li>
      ))}
    </ul>
  </div>
);
