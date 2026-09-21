import { motion, useReducedMotion } from 'framer-motion';
import { EASE, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

export interface Word {
  text: string;
  /** Renders in the rose accent colour — used for the key word. */
  accent?: boolean;
}

interface SplitWordsProps {
  words: readonly Word[] | readonly string[];
  className?: string;
  /** `true` plays immediately on mount (hero); `false` waits for scroll. */
  immediate?: boolean;
  delay?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

const normalise = (words: SplitWordsProps['words']): Word[] =>
  words.map((word) => (typeof word === 'string' ? { text: word } : word));

/**
 * Word-by-word mask reveal: each word sits in an `overflow-hidden` wrapper and
 * slides up from below the baseline. The classic Webflow headline entrance.
 */
export const SplitWords = ({
  words,
  className,
  immediate = false,
  delay = 0,
  stagger = 0.07,
  as: Tag = 'h2',
}: SplitWordsProps) => {
  const reduced = useReducedMotion();
  const items = normalise(words);

  if (reduced) {
    return (
      <Tag className={className}>
        {items.map((word, i) => (
          <span key={i} className={cn(word.accent && 'font-display text-rose-500')}>
            {word.text}
            {i < items.length - 1 ? ' ' : ''}
          </span>
        ))}
      </Tag>
    );
  }

  const animationProps = immediate
    ? { animate: 'visible' as const }
    : { whileInView: 'visible' as const, viewport: viewportOnce };

  return (
    <Tag className={className}>
      <motion.span
        className="inline"
        initial="hidden"
        {...animationProps}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {items.map((word, i) => (
          <span
            key={`${word.text}-${i}`}
            // `pb`/`-mb` gives descenders room so the mask doesn't clip them.
            className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
          >
            <motion.span
              className={cn('inline-block', word.accent && 'text-rose-500')}
              variants={{
                hidden: { y: '110%' },
                visible: { y: '0%', transition: { duration: 0.95, ease: EASE } },
              }}
            >
              {word.text}
            </motion.span>
            {i < items.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
};
