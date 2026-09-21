import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'framer-motion';

let instance: Lenis | null = null;

/** Lets any component (e.g. the mobile menu) freeze the page scroll. */
export const lockScroll = (locked: boolean) => {
  if (instance) locked ? instance.stop() : instance.start();
  document.documentElement.classList.toggle('lenis-stopped', locked);
  document.body.style.overflow = locked ? 'hidden' : '';
};

/** Returns `false` when the target could not be found, so callers can fall back. */
export const scrollTo = (target: string | number, offset = -80): boolean => {
  if (typeof target === 'string' && !document.querySelector(target)) return false;
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.2 });
    return true;
  }
  if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    return true;
  }
  window.scrollTo({ top: target, behavior: 'smooth' });
  return true;
};

/**
 * Mounts smooth scrolling once, at the app root. Skipped entirely when the
 * visitor has asked for reduced motion — native scrolling is left alone.
 */
export const useLenis = () => {
  const reduced = useReducedMotion();
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch devices beats anything we can emulate.
      syncTouch: false,
      touchMultiplier: 1.6,
    });
    instance = lenis;

    const loop = (time: number) => {
      lenis.raf(time);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      lenis.destroy();
      instance = null;
    };
  }, [reduced]);
};
