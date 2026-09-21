import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

const CONTROL =
  'w-full rounded-xl border bg-white/70 px-4 py-3 text-[0.9rem] text-ink-900 placeholder:text-slate-muted/70 transition-all duration-300 outline-none focus:border-ink-600 focus:bg-white focus:ring-4 focus:ring-ink-600/8 disabled:opacity-60';

const ErrorText = ({ id, children }: { id: string; children?: string }) => (
  <AnimatePresence initial={false}>
    {children && (
      <motion.p
        id={id}
        role="alert"
        initial={{ opacity: 0, height: 0, y: -4 }}
        animate={{ opacity: 1, height: 'auto', y: 0 }}
        exit={{ opacity: 0, height: 0, y: -4 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="overflow-hidden pt-1.5 text-xs text-rose-600"
      >
        {children}
      </motion.p>
    )}
  </AnimatePresence>
);

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
}

export const Input = forwardRef<
  HTMLInputElement,
  BaseProps & InputHTMLAttributes<HTMLInputElement>
>(({ label, error, hint, className, ...rest }, ref) => {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <label htmlFor={id} className="label mb-2 block text-ink-600">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(CONTROL, error ? 'border-rose-400' : 'border-ink-900/12')}
        {...rest}
      />
      {hint && !error && <p className="pt-1.5 text-xs text-slate-muted">{hint}</p>}
      <ErrorText id={errorId}>{error}</ErrorText>
    </div>
  );
});
Input.displayName = 'Input';

export const Select = forwardRef<
  HTMLSelectElement,
  BaseProps & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }
>(({ label, error, className, children, ...rest }, ref) => {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <label htmlFor={id} className="label mb-2 block text-ink-600">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          ref={ref}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            CONTROL,
            'appearance-none pr-10',
            error ? 'border-rose-400' : 'border-ink-900/12',
          )}
          {...rest}
        >
          {children}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 12 8"
          className="pointer-events-none absolute right-4 top-1/2 size-3 -translate-y-1/2 text-ink-500"
        >
          <path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
      <ErrorText id={errorId}>{error}</ErrorText>
    </div>
  );
});
Select.displayName = 'Select';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ label, error, hint, className, ...rest }, ref) => {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <label htmlFor={id} className="label mb-2 block text-ink-600">
        {label}
      </label>
      <textarea
        id={id}
        ref={ref}
        rows={4}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(CONTROL, 'resize-y', error ? 'border-rose-400' : 'border-ink-900/12')}
        {...rest}
      />
      {hint && !error && <p className="pt-1.5 text-xs text-slate-muted">{hint}</p>}
      <ErrorText id={errorId}>{error}</ErrorText>
    </div>
  );
});
Textarea.displayName = 'Textarea';

export const Checkbox = forwardRef<
  HTMLInputElement,
  { label: ReactNode; error?: string; className?: string } & InputHTMLAttributes<HTMLInputElement>
>(({ label, error, className, ...rest }, ref) => {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          ref={ref}
          type="checkbox"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-0.5 size-4 shrink-0 cursor-pointer appearance-none rounded border border-ink-900/25 bg-white transition-all duration-200 checked:border-ink-900 checked:bg-ink-900 checked:bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20d%3D%22M2.5%206.2%204.8%208.5%209.5%203.8%22%20fill%3D%22none%22%20stroke%3D%22%23f7f4f0%22%20stroke-width%3D%221.6%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] checked:bg-center checked:bg-no-repeat"
          {...rest}
        />
        <label htmlFor={id} className="cursor-pointer text-xs leading-relaxed text-slate-body">
          {label}
        </label>
      </div>
      <ErrorText id={errorId}>{error}</ErrorText>
    </div>
  );
});
Checkbox.displayName = 'Checkbox';

/** Invisible-to-humans field that traps naive form bots. */
export const Honeypot = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => (
    <input
      ref={ref}
      type="text"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden
      className="honeypot"
      {...props}
    />
  ),
);
Honeypot.displayName = 'Honeypot';
