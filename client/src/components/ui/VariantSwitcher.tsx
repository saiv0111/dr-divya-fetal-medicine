import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

export type Variant = 'warm' | 'cool';

const STORAGE_KEY = 'dd-variant';

const VARIANTS: Array<{
  id: Variant;
  name: string;
  detail: string;
  page: string;
  card: string;
  shell: string;
  radius: string;
}> = [
  {
    id: 'warm',
    name: 'Warm',
    detail: 'Cream page · white cards · pill buttons',
    page: '#f7f4f0',
    card: '#ffffff',
    shell: '#0b1b2b',
    radius: '999px',
  },
  {
    id: 'cool',
    name: 'Cool',
    detail: 'White page · grey cards · 5px buttons',
    page: '#ffffff',
    card: '#ebedf0',
    shell: '#0e1116',
    radius: '5px',
  },
];

export const readVariant = (): Variant => {
  if (typeof window === 'undefined') return 'warm';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'cool' ? 'cool' : 'warm';
};

export const applyVariant = (variant: Variant) => {
  document.documentElement.dataset.variant = variant;
  try {
    window.localStorage.setItem(STORAGE_KEY, variant);
  } catch {
    // Private browsing — the variant simply won't persist.
  }
};

const GearIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="size-[1.15rem]">
    <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Floating control for switching colour variants. Deliberately a design/QA
 * affordance rather than a site feature — it is the only place the variant can
 * be changed, so removing this component removes the switcher entirely.
 */
export const VariantSwitcher = () => {
  const [variant, setVariant] = useState<Variant>('warm');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setVariant(readVariant());
  }, []);

  const choose = (next: Variant) => {
    setVariant(next);
    applyVariant(next);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3 print:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="w-[17.5rem] overflow-hidden rounded-2xl border border-ink-900/12 bg-card shadow-float"
            role="group"
            aria-label="Colour variant"
          >
            <p className="label border-b border-ink-900/10 px-4 py-3 text-ink-500">Colour variant</p>

            <div className="p-2">
              {VARIANTS.map((item) => {
                const active = variant === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => choose(item.id)}
                    aria-pressed={active}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-200',
                      active ? 'bg-ink-900/[0.07]' : 'hover:bg-ink-900/[0.04]',
                    )}
                  >
                    {/* Swatch previews the three surfaces and the button radius. */}
                    <span
                      aria-hidden
                      className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-ink-900/15"
                      style={{ background: item.page }}
                    >
                      <span
                        className="flex size-6 items-center justify-center border border-ink-900/10"
                        style={{ background: item.card, borderRadius: item.radius === '999px' ? '999px' : '3px' }}
                      >
                        <span className="size-2.5 rounded-[1px]" style={{ background: item.shell }} />
                      </span>
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink-900">{item.name}</span>
                      <span className="block text-[0.6875rem] leading-snug text-slate-body">
                        {item.detail}
                      </span>
                    </span>

                    {active && (
                      <svg viewBox="0 0 16 16" aria-hidden className="size-4 shrink-0 text-rose-500">
                        <path
                          d="M3 8.5 6.2 11.5 13 4.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? 'Close colour variant settings' : 'Open colour variant settings'}
        className="grid size-12 place-items-center rounded-full border border-ink-900/12 bg-card text-ink-900 shadow-lift transition-transform duration-300 hover:-translate-y-0.5"
      >
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="grid place-items-center"
        >
          <GearIcon />
        </motion.span>
      </button>
    </div>
  );
};
