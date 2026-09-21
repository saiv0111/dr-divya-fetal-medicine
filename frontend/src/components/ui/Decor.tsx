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

/** Concentric pulsing rings — the "heartbeat" motif used on markers. */
export const PulseDot = ({ className, tone = 'bg-rose-500' }: { className?: string; tone?: string }) => (
  <span aria-hidden className={cn('relative grid size-2 place-items-center', className)}>
    <span className={cn('absolute size-2 rounded-full', tone)} style={{ animation: 'pulse-ring 2.4s ease-out infinite' }} />
    <span className={cn('size-2 rounded-full', tone)} />
  </span>
);
