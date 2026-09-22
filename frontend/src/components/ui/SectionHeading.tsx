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

/** Dot-and-pill section label, used for every section eyebrow on the page. */
export const Eyebrow = ({ children, tone = 'dark', className }: EyebrowProps) => (
  <motion.span
    className={cn(
      'inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-[0.7rem] font-medium tracking-tight',
      tone === 'dark'
        ? 'border-ink-900/10 bg-card text-ink-700'
        : 'border-cream-100/15 bg-cream-100/5 text-cream-100/80',
      className,
    )}
    initial={{ opacity: 0, y: 6 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={viewportOnce}
    transition={{ duration: 0.5, ease: EASE }}
  >
    <span aria-hidden className="size-1.5 rounded-full bg-rose-500" />
    {children}
  </motion.span>
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
