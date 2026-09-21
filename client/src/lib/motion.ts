import type { Transition, Variants } from 'framer-motion';

/** The single easing curve the whole site animates on. */
export const EASE = [0.16, 1, 0.3, 1] as const;

export const springSoft: Transition = { type: 'spring', stiffness: 140, damping: 22, mass: 0.9 };
export const springSnappy: Transition = { type: 'spring', stiffness: 380, damping: 30 };

/** Standard viewport trigger — fires once, slightly before the element lands. */
export const viewportOnce = { once: true, margin: '0px 0px -12% 0px' } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE } },
};

/** Parent that staggers its children; pair with `fadeUp` on each child. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Word/line mask reveal — the child slides up out of an `overflow-hidden` parent. */
export const maskUp: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.95, ease: EASE } },
};
