import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import { journey } from '@/data/site';
import { EASE, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { scrollTo } from '@/hooks/useLenis';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { useBooking } from '@/components/booking/BookingContext';
import { EMBRYO_FRAMES } from './embryoStages';

/** Follows the cursor across the journey card with a soft spring lag */
const CursorChip = ({ visible, x, y }: { visible: boolean; x: number; y: number }) => {
  const springX = useSpring(useMotionValue(0), {
    stiffness: 280,
    damping: 26,
    mass: 0.6,
  });
  const springY = useSpring(useMotionValue(0), {
    stiffness: 280,
    damping: 26,
    mass: 0.6,
  });
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
          <span className="label grid size-[5.5rem] place-items-center rounded-full bg-ink-900 text-center text-[0.5625rem] leading-tight text-cream-100 shadow-lift">
            Book
            <br />
            this scan
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* -------------------------------------------------------------------------- */
/*  Embryo stage renderer                                                      */
/* -------------------------------------------------------------------------- */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface StageHandle {
  apply: (position: number) => void;
}

const useScanStage = (): [React.RefObject<SVGSVGElement>, StageHandle] => {
  const svgRef = useRef<SVGSVGElement>(null);

  const apply = useCallback((position: number) => {
    const svg = svgRef.current;
    if (!svg) return;

    const last = EMBRYO_FRAMES.length - 1;
    const p = Math.max(0, Math.min(last, position));
    const i = Math.min(last - 1, Math.floor(p));

    const rel = lerp(EMBRYO_FRAMES[i]!.rel, EMBRYO_FRAMES[i + 1]!.rel, p - i);
    const wrapper = svg.querySelector<SVGGElement>('#embryoScale');
    wrapper?.setAttribute(
      'transform',
      `translate(150 150) scale(${(rel * GROWTH).toFixed(4)}) translate(-150 -150)`,
    );

    const shown = Math.round(p);
    svg.querySelectorAll<SVGGElement>('.embryo-frame').forEach((group, index) => {
      group.style.display = index === shown ? '' : 'none';
    });
  }, []);

  return [svgRef, { apply }];
};

const GROWTH = 2.6;

const ScanStage = ({ svgRef }: { svgRef: React.RefObject<SVGSVGElement> }) => (
  <svg
    ref={svgRef}
    viewBox="0 0 300 300"
    className="relative z-[2] size-full overflow-visible"
    aria-hidden
  >
    <defs>
      {/* Warm depth on the sac so the flat artwork does not read as a sticker. */}
      <radialGradient id="sacGrad" cx="42%" cy="36%" r="72%">
        <stop offset="0%" stopColor="#f4918a" />
        <stop offset="70%" stopColor="#ea7c73" />
        <stop offset="100%" stopColor="#de695d" />
      </radialGradient>
      <radialGradient id="fluidGrad" cx="42%" cy="36%" r="70%">
        <stop offset="0%" stopColor="#fcd6d5" />
        <stop offset="100%" stopColor="#f4c1be" />
      </radialGradient>
      <linearGradient id="babyGrad" x1="0.15" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#fffaf9" />
        <stop offset="100%" stopColor="#fde2dd" />
      </linearGradient>
      <filter id="wombShadow" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="6" stdDeviation="9" floodColor="#8a4a40" floodOpacity="0.16" />
      </filter>
    </defs>

    {/* No backdrop: the womb itself is the shape. Paint order is
        sac → fluid → baby → line art, exactly as the artwork was drawn. */}
    <g id="embryoScale" className="fetus-shape">
      <g filter="url(#wombShadow)">
        {EMBRYO_FRAMES.map((frame, index) => (
          <g
            key={frame.week}
            className="embryo-frame"
            transform={frame.transform}
            style={{ display: index === 0 ? '' : 'none' }}
          >
            {frame.sac.map((d, i) => (
              <path key={`s${i}`} d={d} fill="url(#sacGrad)" />
            ))}
            {frame.fluid.map((d, i) => (
              <path key={`f${i}`} d={d} fill="url(#fluidGrad)" />
            ))}
            {frame.bodies.map((d, i) => (
              <path key={`b${i}`} d={d} fill="url(#babyGrad)" />
            ))}
            {frame.lines.map((d, i) => (
              <path
                key={`l${i}`}
                d={d}
                fill="none"
                stroke="#8f4a40"
                strokeWidth={frame.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />
            ))}
          </g>
        ))}
      </g>
    </g>
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */

const STAGE_COUNT = journey.stages.length;

export const BabyJourney = () => {
  const { open } = useBooking();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [svgRef, stage] = useScanStage();
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const pinned = isDesktop && !reduced;

  const [active, setActive] = useState(0);
  const [hintHidden, setHintHidden] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const tweenRef = useRef<number | undefined>(undefined);
  const positionRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!pinned) return;
    const position = Math.max(0, Math.min(1, progress)) * (STAGE_COUNT - 1);
    positionRef.current = position;
    stage.apply(position);
    setActive(Math.round(position));
    setHintHidden(progress > 0.03);
  });

  const tweenTo = useCallback(
    (target: number) => {
      if (tweenRef.current) cancelAnimationFrame(tweenRef.current);
      const from = positionRef.current;
      const start = performance.now();
      const duration = reduced ? 0 : 700;

      const step = (now: number) => {
        const t = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        positionRef.current = lerp(from, target, eased);
        stage.apply(positionRef.current);
        if (t < 1) tweenRef.current = requestAnimationFrame(step);
      };
      tweenRef.current = requestAnimationFrame(step);
    },
    [stage, reduced],
  );

  const selectStage = (index: number) => {
    setActive(index);
    if (!pinned || !scrollRef.current) {
      tweenTo(index);
      return;
    }
    const element = scrollRef.current;
    const total = element.offsetHeight - window.innerHeight;
    const top = element.getBoundingClientRect().top + window.scrollY;
    scrollTo(top + (index / (STAGE_COUNT - 1)) * total, 0);
  };

  useEffect(() => {
    const initial = pinned ? positionRef.current : active;
    positionRef.current = initial;
    stage.apply(initial);
    return () => {
      if (tweenRef.current) cancelAnimationFrame(tweenRef.current);
    };
  }, [pinned, stage]);

  const current = journey.stages[active] ?? journey.stages[0]!;

  return (
    <section
      id="journey"
      className="relative scroll-mt-24 pb-10"
      onPointerMove={(event) => {
        if (event.pointerType === 'mouse') setCursor({ x: event.clientX, y: event.clientY });
      }}
    >
      <CursorChip visible={!reduced && isCardHovered} x={cursor.x} y={cursor.y} />

      {/* Heading */}
      <div className="shell pt-10">
        <SectionHeading
          eyebrow={journey.eyebrow}
          heading={journey.heading}
          intro={journey.intro}
          align="center"
          className="mx-auto items-center"
          headingClassName="mx-auto max-w-[26ch]"
          introClassName="mx-auto max-w-[58ch]"
        />
      </div>

      <div ref={scrollRef} className={cn('relative', pinned ? 'h-[340vh]' : 'h-auto')}>
        <div
          className={cn(
            'flex',
            pinned
              ? 'sticky top-0 h-screen items-start overflow-hidden pt-10'
              : 'items-center py-14',
          )}
        >
          <div className="shell w-full">
            <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-[60px]">
              {/* Scan Stage + Week Pills */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <div className="relative mx-auto flex aspect-square w-full max-w-[27.5rem] items-center justify-center">
                  <ScanStage svgRef={svgRef} />

                  {pinned && (
                    <span
                      className={cn(
                        'label absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-ink-500 transition-opacity duration-500',
                        hintHidden ? 'opacity-0' : 'opacity-60',
                      )}
                    >
                      {journey.scrollHint} ↓
                    </span>
                  )}
                </div>

                {/* Week Pills */}
                <div
                  className={cn('flex flex-wrap justify-center gap-1.5', pinned ? 'mt-16' : 'mt-8')}
                >
                  {journey.stages.map((item, index) => (
                    <button
                      key={item.week}
                      type="button"
                      onClick={() => selectStage(index)}
                      aria-current={index === active}
                      className={cn(
                        'rounded-full border-[1.5px] px-3.5 py-2.5 text-[0.73rem] font-bold whitespace-nowrap transition-all duration-300',
                        index === active
                          ? 'border-ink-900 bg-ink-900 text-cream-100 shadow-lift'
                          : 'border-ink-900/25 text-slate-body hover:border-rose-400 hover:text-rose-500',
                      )}
                    >
                      {item.week}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Redesigned Card with Custom Heading Font, Includes List & Magnetic Cursor */}
              <motion.div
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-ink-900/10 bg-card p-7 sm:p-10 shadow-float transition-all hover:border-ink-900/20"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
                onPointerEnter={() => setIsCardHovered(true)}
                onPointerLeave={() => setIsCardHovered(false)}
                onClick={() => open(current.serviceId)}
              >
                <div aria-live="polite">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    {/* Week heading in website heading font (Baskervville serif) */}
                    <motion.h3
                      key={`${current.week}-label`}
                      className="num text-4xl leading-none text-rose-500 sm:text-5xl lg:text-[3.25rem]"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      {current.week}
                    </motion.h3>

                    <motion.span
                      key={`${current.week}-size`}
                      className="label rounded-full bg-rose-100/80 px-3.5 py-1.5 text-[0.6875rem] font-semibold text-rose-700 uppercase tracking-widest"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.45, ease: EASE, delay: 0.05 }}
                    >
                      {current.size}
                    </motion.span>
                  </div>

                  <motion.div
                    key={`${current.week}-body`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
                    className="mt-6"
                  >
                    <h4 className="font-display text-2xl sm:text-3xl font-normal leading-snug tracking-tight text-ink-900">
                      {current.title}
                    </h4>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-body max-w-[48ch]">
                      {current.body}
                    </p>

                    {/* Action Button */}
                    <div className="mt-8">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={(e) => {
                          e.stopPropagation();
                          open(current.serviceId);
                        }}
                      >
                        Book {current.scan}
                      </Button>
                    </div>
                  </motion.div>
                </div>

                {/* Progress rail across the six milestones */}
                <div className="mt-8 flex items-center gap-3 border-t border-ink-900/10 pt-5">
                  <span className="label text-ink-400">
                    {String(active + 1).padStart(2, '0')} / {String(STAGE_COUNT).padStart(2, '0')}
                  </span>
                  <span className="h-px flex-1 overflow-hidden bg-ink-900/12">
                    <motion.span
                      className="block h-px origin-left bg-rose-400"
                      animate={{ scaleX: (active + 1) / STAGE_COUNT }}
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
