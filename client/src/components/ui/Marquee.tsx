import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop. Longer = slower. */
  duration?: number;
  direction?: 'left' | 'right';
  className?: string;
  /** Fades the leading and trailing edges into the background. */
  fade?: boolean;
  pauseOnHover?: boolean;
}

/**
 * CSS-driven infinite marquee. The track holds two identical copies and
 * translates by -50%, so the seam is invisible. Runs off the compositor, and
 * the reduced-motion media query in index.css stops it dead.
 */
export const Marquee = ({
  children,
  duration = 42,
  direction = 'left',
  className,
  fade = true,
  pauseOnHover = true,
}: MarqueeProps) => (
  <div
    className={cn('relative w-full overflow-hidden', pauseOnHover && 'marquee', className)}
    style={
      fade
        ? {
            maskImage:
              'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
            WebkitMaskImage:
              'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
          }
        : undefined
    }
  >
    <div
      className="marquee-track"
      data-direction={direction}
      style={{ ['--marquee-duration' as string]: `${duration}s` }}
    >
      <div aria-hidden={false} className="flex shrink-0 items-center">
        {children}
      </div>
      {/* Duplicate purely for the seamless loop — hidden from assistive tech. */}
      <div aria-hidden className="flex shrink-0 items-center">
        {children}
      </div>
    </div>
  </div>
);
