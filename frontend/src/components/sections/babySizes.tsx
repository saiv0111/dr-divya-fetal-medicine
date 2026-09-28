/**
 * Fruit-to-baby size comparison for the journey section.
 *
 * One entry per milestone, so the index lines up with `journey.stages`.
 * `scale` is the fruit element's width as a fraction of the well. It is not a
 * fruit-to-fruit ratio: each drawing fills a different share of its own canvas
 * (the orange 52%, the pineapple only 39% across), so the value is corrected
 * per fruit to make the *visible* fruit match the *visible* baby at that week.
 * The numbers come from measuring the opaque bounds of each PNG against the
 * stage artwork's ink. Matching purely on area makes a tall, narrow drawing
 * (the pineapple, crown included) read as larger than the baby, and matching
 * purely on height makes it read as smaller, so each value sits between the
 * two. Re-measure if any drawing is replaced.
 */
export interface BabySize {
  fruit: string;
  /** Square, transparent fruit artwork. */
  src: string;
  /** 0-1, relative to the largest fruit. */
  scale: number;
  /**
   * Horizontal nudge, in rem, that re-centres the pair on the column.
   * Each drawing is centred in its own half, but the two inks are different
   * widths, so their combined silhouette sits off-centre by exactly
   * (babyInk - fruitInk) / 4. It matters for the pineapple, whose ink is
   * narrow (97px) against the baby's 149px; elsewhere it is about a pixel.
   */
  nudge: number;
  line: string;
}

/** Indexed to match `journey.stages` — weeks 5-8, 9-12, 16-24, 28-36, 37-40. */
export const BABY_SIZES: BabySize[] = [
  {
    fruit: 'Cherry',
    src: '/journey/fruit-cherry.png',
    scale: 0.449,
    nudge: -0.06,
    line:
      'Your baby is as tiny as a cherry — but the heart has already started to whisper its first beats.',
  },
  {
    fruit: 'Strawberry',
    src: '/journey/fruit-strawberry.png',
    scale: 0.703,
    nudge: 0.13,
    line:
      'Now as big as a strawberry. Your baby is starting to stretch and wiggle, and tiny fingers and toes are forming beautifully.',
  },
  {
    fruit: 'Orange',
    src: '/journey/fruit-orange.png',
    scale: 1,
    nudge: -0.19,
    line:
      'As big as an orange. Your baby can now hear your voice, and little kicks may soon become your favourite feeling.',
  },
  {
    fruit: 'Pineapple',
    src: '/journey/fruit-pineapple.png',
    scale: 0.900,
    nudge: 0.81,
    line:
      'Now the size of a pineapple. Your baby is gaining strength and those tiny lungs are maturing beautifully.',
  },
  {
    fruit: 'Watermelon',
    src: '/journey/fruit-watermelon.png',
    scale: 0.858,
    nudge: 0,
    line:
      'As big as a watermelon. Your little miracle is ready to say hello.',
  },
];
