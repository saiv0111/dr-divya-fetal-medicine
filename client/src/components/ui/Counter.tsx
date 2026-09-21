import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface CounterProps {
  value: number;
  suffix?: string;
  /** Milliseconds for the full count. */
  duration?: number;
  className?: string;
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Counts up once the number scrolls into view. Uses rAF rather than a motion
 * value so the rendered text is always a clean, locale-formatted integer.
 */
export const Counter = ({ value, suffix = '', duration = 2000, className }: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(easeOutExpo(progress) * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {/* Screen readers get the final value immediately, not the animation. */}
      <span aria-hidden>{display.toLocaleString('en-IN')}</span>
      <span className="sr-only">{value.toLocaleString('en-IN')}</span>
      {suffix}
    </span>
  );
};
