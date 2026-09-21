import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Thin reading-progress bar pinned under the header. */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-rose-400"
    />
  );
};

interface OrbProps {
  className?: string;
  /** Tailwind colour utility, e.g. `bg-rose-200`. */
  tone?: string;
  /** Seconds for one drift cycle. */
  speed?: number;
  delay?: number;
}

/** Soft blurred gradient blob that slowly drifts behind content. */
export const Orb = ({ className, tone = 'bg-rose-200', speed = 18, delay = 0 }: OrbProps) => (
  <div
    aria-hidden
    className={cn('orb pointer-events-none absolute rounded-full blur-[90px]', tone, className)}
    style={{ animation: `drift ${speed}s ease-in-out ${delay}s infinite` }}
  />
);

/** Concentric pulsing rings — the "heartbeat" motif used on markers. */
export const PulseDot = ({ className, tone = 'bg-rose-500' }: { className?: string; tone?: string }) => (
  <span aria-hidden className={cn('relative grid size-2 place-items-center', className)}>
    <span className={cn('absolute size-2 rounded-full', tone)} style={{ animation: 'pulse-ring 2.4s ease-out infinite' }} />
    <span className={cn('size-2 rounded-full', tone)} />
  </span>
);

/** Full-bleed hairline grid that gives flat sections some architecture. */
export const GridLines = ({ className, tone = 'border-ink-900/6' }: { className?: string; tone?: string }) => (
  <div aria-hidden className={cn('pointer-events-none absolute inset-0 hidden md:block', className)}>
    <div className="shell grid h-full grid-cols-12">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={cn('border-l', tone, i === 11 && 'border-r')} />
      ))}
    </div>
  </div>
);
