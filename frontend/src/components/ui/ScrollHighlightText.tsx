import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollHighlightTextProps {
  text: string;
  className?: string;
}

const HighlightWord = ({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) => {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
};

/**
 * Words brighten from faint to full ink as the paragraph moves through the
 * viewport — reading pace tied to scroll position.
 */
export const ScrollHighlightText = ({ text, className }: ScrollHighlightTextProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.3'],
  });

  const words = text.split(' ');

  if (reduced) return <p className={className}>{text}</p>;

  return (
    <p ref={ref} className={cn('flex flex-wrap', className)}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        return (
          <HighlightWord key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
            {word}
          </HighlightWord>
        );
      })}
    </p>
  );
};
