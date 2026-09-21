/*
 * GENERATED from design-assets/fetus-journey-assets.svg.
 * Do not hand-edit — re-run the extraction if the source artwork changes.
 *
 * The artwork is a flat 3x2 grid of six gestational stages. Each cell is
 * normalised to a common height, centred on (150,150) in a 300x300 viewBox
 * and written to public/journey/, so swapping a drawing never changes the
 * apparent size on its own. Growth is applied separately and continuously
 * by BabyJourney, via `rel`, on a wrapper element.
 *
 * The stages are static files rather than inline paths because the path
 * data is ~350 KB — inlining it grew the main JS chunk 15x for a purely
 * decorative graphic.
 */

export interface EmbryoFrame {
  /** Gestational age this drawing is shown for. */
  week: number;
  /** Size relative to the last frame (0-1), monotonically increasing. */
  rel: number;
  /** Normalised, centred stage artwork. */
  src: string;
}

export const EMBRYO_FRAMES: EmbryoFrame[] = [
  {
    week: 8,
    rel: 0.5714,
    src: '/journey/stage-1.svg',
  },
  {
    week: 12,
    rel: 0.6864,
    src: '/journey/stage-2.svg',
  },
  {
    week: 20,
    rel: 0.7557,
    src: '/journey/stage-3.svg',
  },
  {
    week: 28,
    rel: 0.8592,
    src: '/journey/stage-4.svg',
  },
  {
    week: 36,
    rel: 0.9295,
    src: '/journey/stage-5.svg',
  },
  {
    week: 40,
    rel: 1.0,
    src: '/journey/stage-6.svg',
  },
];
