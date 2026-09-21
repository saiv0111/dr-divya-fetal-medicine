import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  q: string;
  a: string;
}

interface AccordionProps {
  items: readonly AccordionItem[];
  /** Index open on first paint; `null` for all closed. */
  defaultOpen?: number | null;
  className?: string;
}

const Chevron = ({ open }: { open: boolean }) => (
  <span className="relative grid size-9 shrink-0 place-items-center rounded-full border border-ink-900/15 transition-colors duration-500 group-hover:border-ink-900/35 group-hover:bg-ink-900 group-hover:text-cream-100">
    <motion.span
      aria-hidden
      className="absolute h-px w-3.5 bg-current"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    />
    <motion.span
      aria-hidden
      className="absolute h-px w-3.5 bg-current"
      animate={{ rotate: open ? 180 : 90 }}
      transition={{ duration: 0.4, ease: EASE }}
    />
  </span>
);

export const Accordion = ({ items, defaultOpen = 0, className }: AccordionProps) => {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn('divide-y divide-ink-900/10 border-y border-ink-900/10', className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-300 hover:text-ink-600 md:py-7"
              >
                <span className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                  {item.q}
                </span>
                <Chevron open={isOpen} />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.5, ease: EASE },
                    opacity: { duration: 0.32, ease: EASE },
                  }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[62ch] pb-7 pr-12 text-[0.95rem] leading-relaxed text-slate-body">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
