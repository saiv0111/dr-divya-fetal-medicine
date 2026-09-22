import { useCallback, useEffect, useRef, useState } from 'react';
import {
  
  motion,
  
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  
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

/* -------------------------------------------------------------------------- */
/*  Embryo stage renderer                                                      */
/* -------------------------------------------------------------------------- */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface StageHandle {
  apply: (position: number) => void;
}

const useScanStage = (): [React.RefObject<HTMLDivElement>, StageHandle] => {
  const rootRef = useRef<HTMLDivElement>(null);

  const apply = useCallback((position: number) => {
    const root = rootRef.current;
    if (!root) return;

    const last = EMBRYO_FRAMES.length - 1;
    const p = Math.max(0, Math.min(last, position));
    const i = Math.min(last - 1, Math.floor(p));

    const rel = lerp(EMBRYO_FRAMES[i]!.rel, EMBRYO_FRAMES[i + 1]!.rel, p - i);
    const wrapper = root.querySelector<HTMLElement>('#embryoScale');
    if (wrapper) wrapper.style.transform = `scale(${(rel * GROWTH).toFixed(4)})`;

    const shown = Math.round(p);
    root.querySelectorAll<HTMLElement>('.embryo-frame').forEach((frame, index) => {
      frame.style.opacity = index === shown ? '1' : '0';
    });
  }, []);

  return [rootRef, { apply }];
};

/* Caps how large the final stage renders. Measured against the card beside
   it: the artwork is centred, so artTop = paneCentre - (baseSide * scale) / 6.
   Above ~1.88 the week-40 drawing rises past the top of the card. */
const GROWTH = 1.82;

const ScanStage = ({ stageRef }: { stageRef: React.RefObject<HTMLDivElement> }) => (
  /* pointer-events-none is load-bearing: the images scale up to ~1100px and
     overlap the week rail underneath, which silently swallowed every click
     once the artwork grew past the first stage. Nothing here is interactive. */
  <div ref={stageRef} className="pointer-events-none relative z-[2] size-full">
    {/* Growth lives here as a single continuous scale, exactly as before; only
        the artwork underneath changed from inline paths to static files. The
        drop shadow sits on the images rather than this wrapper because
        `.fetus-shape` animates the filter property and would override it. */}
    <div
      id="embryoScale"
      className="fetus-shape absolute inset-0 origin-center will-change-transform"
    >
      {EMBRYO_FRAMES.map((frame, index) => (
        <img
          key={frame.week}
          className="embryo-frame absolute inset-0 size-full object-contain transition-opacity duration-200"
          style={{
            opacity: index === 0 ? 1 : 0,
            filter: 'drop-shadow(0 6px 9px rgb(138 74 64 / 0.16))',
          }}
          src={frame.src}
          alt=""
          aria-hidden
          decoding="async"
          loading="eager"
        />
      ))}
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */

const STAGE_COUNT = journey.stages.length;

export const BabyJourney = () => {
  const { open } = useBooking();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stageRef, stage] = useScanStage();
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const pinned = isDesktop && !reduced;

  const [active, setActive] = useState(0);
  const [hintHidden, setHintHidden] = useState(false);

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
      className="relative scroll-mt-24 pb-11"
    >

      {/* Heading */}
      <div className="shell pt-11">
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
              ? 'sticky top-0 h-[78vh] items-center overflow-hidden'
              : 'items-center py-14',
          )}
        >
          <div className="shell w-full">
            <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
              {/* ------------------------------------------------- artwork */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <div className="relative mx-auto flex aspect-square w-full max-w-[27.5rem] items-center justify-center">
                  <ScanStage stageRef={stageRef} />

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
              </motion.div>

              {/* ------------------------------------------------- content
                  No card. The old panel wrapped this in a bordered, shadowed
                  box that was also a giant click target with a custom hover
                  cursor — a lot of interface around some text. */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              >
                <div aria-live="polite">
                  <motion.h3
                    key={`${current.week}-label`}
                    className="num text-[2.6rem] font-medium leading-[1.05] text-ink-900 sm:text-[3.2rem]"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    {current.week}
                  </motion.h3>
                  <motion.p
                    key={`${current.week}-size`}
                    className="mt-1.5 text-[0.8rem] text-rose-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.45, ease: EASE, delay: 0.05 }}
                  >
                    {current.size}
                  </motion.p>

                  <motion.div
                    key={`${current.week}-body`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
                  >
                    <h4 className="mt-7 font-display text-2xl font-medium leading-snug text-ink-900 sm:text-[1.75rem]">
                      {current.title}
                    </h4>
                    <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-slate-body sm:text-base">
                      {current.body}
                    </p>


                    <div className="mt-8">
                      <Button variant="primary" size="md" onClick={() => open(current.serviceId)}>
                        Book {current.scan}
                      </Button>
                    </div>
                  </motion.div>
                </div>

                {/* Week selector, now under the content it controls.
                    Pinned, page scroll drives it and the rail is mostly an
                    indicator. Unpinned — touch and reduced motion — tapping is
                    the only way to move, so nodes become 44px buttons. */}
                <div
                  className={cn('relative mt-9 w-full', pinned ? 'max-w-[34rem]' : 'max-w-[30rem]')}
                  role="tablist"
                  aria-label="Gestational weeks"
                >
                  <span
                    aria-hidden
                    className={cn(
                      'pointer-events-none absolute h-px bg-ink-900/12',
                      pinned
                        ? 'left-[11px] right-[11px] top-[9px]'
                        : 'left-[26px] right-[26px] top-[22px]',
                    )}
                  />
                  <motion.span
                    aria-hidden
                    className={cn(
                      'pointer-events-none absolute h-px origin-left bg-rose-500',
                      pinned
                        ? 'left-[11px] right-[11px] top-[9px]'
                        : 'left-[26px] right-[26px] top-[22px]',
                    )}
                    initial={false}
                    animate={{ scaleX: active / Math.max(journey.stages.length - 1, 1) }}
                    transition={{ duration: 0.45, ease: EASE }}
                  />

                  <div className="relative flex items-start justify-between">
                    {journey.stages.map((item, index) => {
                      const isActive = index === active;
                      const isPassed = index < active;

                      if (!pinned) {
                        return (
                          <button
                            key={item.week}
                            type="button"
                            role="tab"
                            onClick={() => selectStage(index)}
                            aria-selected={isActive}
                            aria-label={item.week}
                            className={cn(
                              'num grid size-11 shrink-0 place-items-center rounded-full border text-[0.8125rem] transition-all duration-300 active:scale-95',
                              isActive
                                ? 'border-rose-500 bg-rose-500 font-medium text-cream-50'
                                : isPassed
                                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                                  : 'border-ink-900/20 bg-page text-slate-body',
                            )}
                          >
                            {item.week.replace('Week ', '')}
                          </button>
                        );
                      }

                      return (
                        <button
                          key={item.week}
                          type="button"
                          role="tab"
                          onClick={() => selectStage(index)}
                          aria-selected={isActive}
                          aria-label={item.week}
                          className="group/week flex flex-col items-center gap-2.5 outline-offset-4"
                        >
                          <span
                            aria-hidden
                            className={cn(
                              'mt-[2px] block size-[14px] rounded-full border-[1.5px] transition-all duration-300',
                              isActive
                                ? 'scale-125 border-rose-500 bg-rose-500'
                                : isPassed
                                  ? 'border-rose-400 bg-rose-400'
                                  : 'border-ink-900/25 bg-page group-hover/week:border-rose-400',
                            )}
                          />
                          <span
                            className={cn(
                              'num whitespace-nowrap text-[0.75rem] transition-colors duration-300',
                              isActive
                                ? 'font-medium text-ink-900'
                                : 'text-slate-muted group-hover/week:text-rose-500',
                            )}
                          >
                            {item.week.replace('Week ', '')}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {!pinned && (
                    <div className="mt-5 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => selectStage(Math.max(active - 1, 0))}
                        disabled={active === 0}
                        aria-label="Previous week"
                        className="grid size-9 place-items-center rounded-full border border-ink-900/15 text-ink-700 transition-transform active:scale-95 disabled:opacity-30"
                      >
                        <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
                          <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <p className="label text-[0.6rem] text-slate-muted">Tap a week</p>
                      <button
                        type="button"
                        onClick={() => selectStage(Math.min(active + 1, journey.stages.length - 1))}
                        disabled={active === journey.stages.length - 1}
                        aria-label="Next week"
                        className="grid size-9 place-items-center rounded-full border border-ink-900/15 text-ink-700 transition-transform active:scale-95 disabled:opacity-30"
                      >
                        <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
                          <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
