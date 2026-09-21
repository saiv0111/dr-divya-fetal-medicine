import { motion } from 'framer-motion';
import { stats } from '@/data/site';
import { EASE, viewportOnce } from '@/lib/motion';
import { Counter } from '@/components/ui/Counter';

const credentialBadges = [
  {
    tag: 'FMF',
    sub: 'UK',
    title: 'FMF UK Certified',
    body: 'Licensed to Fetal Medicine Foundation (London) standards, with annual measurement audit.',
  },
  {
    tag: 'ISUOG',
    sub: '2024',
    title: 'ISUOG-Aligned Protocols',
    body: 'Every examination follows International Society of Ultrasound guidelines, end to end.',
  },
  {
    tag: '2D/4D',
    sub: 'SCAN',
    title: 'Current-Generation Imaging',
    body: 'High-resolution 2D, colour & pulsed-wave Doppler, 4D volume imaging and cardiac presets.',
  },
  {
    tag: 'FMF',
    sub: 'CARE',
    title: 'Counselling That Slows Down',
    body: 'Findings explained in plain language, written down before you leave, and revisited as needed.',
  },
];

export const Certifications = () => {
  return (
    <section
      id="credentials"
      className="relative overflow-hidden bg-shell py-20 text-cream-100"
    >


      {/* Decorative concentric arcs (matching reference image background) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-25">
        <svg viewBox="0 0 1440 600" fill="none" className="size-full stroke-cream-100/10" strokeWidth="0.8">
          {[120, 220, 320, 420, 520, 620, 720, 820].map((r) => (
            <ellipse key={r} cx="720" cy="300" rx={r * 1.8} ry={r * 0.7} />
          ))}
        </svg>
      </div>

      <div className="shell relative z-10">
        {/* Top Header Row (Matching Reference Layout) */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-cream-100/10 pb-7">
          <div>
            <span className="label text-[0.6875rem] uppercase tracking-widest text-cream-100/50">
              Infrastructure
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-cream-50">
              Built for scale. Certified for security.
            </h2>
          </div>
          <p className="max-w-xs text-xs sm:text-sm leading-relaxed text-cream-100/60 md:text-right">
            Over a decade of specialized care, held to international fetal medicine standards.
          </p>
        </div>

        {/* Middle Row: Large Metrics / Stats (Matching Reference Image) */}
        <div className="pt-7 pb-14 border-b border-cream-100/10">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-cream-100/10">
            {stats.items.map((item, index) => (
              <motion.div
                key={item.label}
                className="lg:px-8 first:lg:pl-0 last:lg:pr-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.6, ease: EASE, delay: index * 0.1 }}
              >
                <dd className="num text-4xl text-cream-50 sm:text-5xl lg:text-6xl">
                  <Counter value={item.value} suffix={item.suffix} duration={1800 + index * 180} />
                </dd>
                <dt className="mt-3 text-xs sm:text-sm text-cream-100/70">{item.label}</dt>
                <p className="mt-1 text-[0.6875rem] text-cream-100/40">{item.sub}</p>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* Bottom Row: Credential Badges Grid (Matching Reference Image) */}
        <div className="pt-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {credentialBadges.map((badge, index) => (
              <motion.div
                key={badge.title}
                className="flex flex-col items-start"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.7, ease: EASE, delay: 0.15 + index * 0.08 }}
              >
                {/* Circular Emblem Icon */}
                <div className="flex size-14 items-center justify-center rounded-full border border-cream-100/20 bg-cream-100/5 text-center shadow-inner">
                  <div className="flex flex-col items-center leading-none text-cream-100/80">
                    <span className="font-mono text-[0.65rem] font-bold tracking-wider">{badge.tag}</span>
                    <span className="font-mono text-[0.5rem] tracking-tighter opacity-70 mt-0.5">{badge.sub}</span>
                  </div>
                </div>

                <h3 className="mt-6 font-sans font-semibold text-base text-cream-50 leading-snug">
                  {badge.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-cream-100/60">
                  {badge.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Export Stats alias for backwards compatibility
export const Stats = Certifications;
