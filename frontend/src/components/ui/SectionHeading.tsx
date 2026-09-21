import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { EASE, viewportOnce } from '@/lib/motion';
import { SplitWords } from './SplitWords';
import { cn } from '@/lib/utils';

interface EyebrowProps {
  children: ReactNode;
  tone?: 'dark' | 'light';
  className?: string;
}

/** Mono label with a rule that draws itself in from the left. */
export const Eyebrow = ({ children, tone = 'dark', className }: EyebrowProps) => (
  <motion.div
    className={cn('flex items-center gap-3 whitespace-nowrap shrink-0', className)}
    initial="hidden"
    whileInView="visible"
    viewport={viewportOnce}
  >
    <motion.span
      className={cn('label whitespace-nowrap', tone === 'dark' ? 'text-ink-600' : 'text-cream-100/70')}
      variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
    >
      {children}
    </motion.span>
  </motion.div>
);

interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  intro?: string;
  tone?: 'dark' | 'light';
  align?: 'left' | 'center';
  className?: string;
  /** Constrain the heading measure, e.g. to force a two-line break. */
  headingClassName?: string;
  /** Constrain the intro measure independently of the heading. */
  introClassName?: string;
  children?: ReactNode;
}

export const SectionHeading = ({
  eyebrow,
  heading,
  intro,
  tone = 'dark',
  align = 'left',
  className,
  headingClassName,
  introClassName,
  children,
}: SectionHeadingProps) => (
  <div
    className={cn(
      'flex flex-col gap-5',
      align === 'center' && 'items-center text-center',
      className,
    )}
  >
    <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
    <SplitWords
      as="h2"
      words={heading.split(' ')}
      className={cn(
        'display-lg w-full',
        tone === 'dark' ? 'text-ink-900' : 'text-cream-50',
        headingClassName,
      )}
    />
    {intro && (
      <motion.p
        className={cn(
          'max-w-[52ch] text-[0.975rem] leading-relaxed',
          tone === 'dark' ? 'text-slate-body' : 'text-cream-100/65',
          introClassName,
        )}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
      >
        {intro}
      </motion.p>
    )}
    {children}
  </div>
);
