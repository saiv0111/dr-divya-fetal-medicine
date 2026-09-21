import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'outlineOnDark';
export type ButtonSize = 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-ink-900 text-cream-100 border-ink-900 hover:border-rose-500 hover:text-cream-50 [--sweep:var(--color-rose-500)]',
  secondary:
    'bg-transparent text-ink-900 border-ink-900/25 hover:border-ink-900 hover:text-cream-100 [--sweep:var(--color-ink-900)]',
  onDark:
    'bg-page text-ink-900 border-cream-100 hover:border-rose-200 hover:text-ink-900 [--sweep:var(--color-rose-200)]',
  outlineOnDark:
    'bg-transparent text-cream-100 border-cream-100/30 hover:border-cream-100 hover:text-ink-900 [--sweep:var(--color-cream-100)]',
  ghost:
    'bg-transparent text-ink-900 border-transparent hover:text-rose-500 [--sweep:transparent]',
};

const SIZES: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-[0.8125rem]',
  lg: 'h-[3.25rem] px-7 text-sm',
};

export const ArrowIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden className={cn('size-4', className)}>
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  withArrow?: boolean;
  children: ReactNode;
}

/**
 * Pill button with a colour sweep that wipes up from the bottom on hover and
 * an arrow that slides. Rendered as `<button>`; use `ButtonLink` for anchors.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'lg', withArrow = true, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        'group/button relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-btn)] border font-sans font-medium tracking-tight',
        'transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'disabled:pointer-events-none disabled:opacity-55',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 translate-y-full bg-[var(--sweep)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/button:translate-y-0 group-focus-visible/button:translate-y-0"
      />
      <span className="relative">{children}</span>
      {withArrow && (
        <ArrowIcon className="relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/button:translate-x-1" />
      )}
    </button>
  ),
);
Button.displayName = 'Button';

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  withArrow?: boolean;
  children: ReactNode;
}

export const ButtonLink = ({
  variant = 'primary',
  size = 'lg',
  withArrow = true,
  className,
  children,
  ...rest
}: ButtonLinkProps) => (
  <a
    className={cn(
      'group/button relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-btn)] border font-sans font-medium tracking-tight',
      'transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
      VARIANTS[variant],
      SIZES[size],
      className,
    )}
    {...rest}
  >
    <span
      aria-hidden
      className="absolute inset-0 -z-10 translate-y-full bg-[var(--sweep)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/button:translate-y-0 group-focus-visible/button:translate-y-0"
    />
    <span className="relative">{children}</span>
    {withArrow && (
      <ArrowIcon className="relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/button:translate-x-1" />
    )}
  </a>
);
