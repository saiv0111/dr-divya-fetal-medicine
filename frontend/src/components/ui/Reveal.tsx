import type { ElementType, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const OFFSETS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  /** Adds a gentle scale-in on top of the translation. */
  scale?: boolean;
}

/**
 * Scroll-triggered entrance. Collapses to a plain wrapper when the visitor
 * prefers reduced motion, so content is never hidden behind an animation.
 */
export const Reveal = ({
  children,
  as = 'div',
  className,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  scale = false,
}: RevealProps) => {
  const reduced = useReducedMotion();
  const Tag = motion[as as 'div'] ?? motion.div;
  const offset = OFFSETS[direction];

  if (reduced) {
    const Plain = as as ElementType;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={cn(className)}
      initial={{ opacity: 0, ...offset, ...(scale ? { scale: 0.96 } : null) }}
      whileInView={{ opacity: 1, x: 0, y: 0, ...(scale ? { scale: 1 } : null) }}
      viewport={viewportOnce}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
};
