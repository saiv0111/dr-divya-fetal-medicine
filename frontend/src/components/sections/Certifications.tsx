import { motion } from 'framer-motion';
import { certifications, stats } from '@/data/site';
import { EASE, viewportOnce } from '@/lib/motion';
import { Eyebrow } from '@/components/ui/SectionHeading';

/**
 * Credentials.
 *
 * The left column was a 2x2 grid of green tick circles — an off-palette colour
 * doing decorative work, in a layout that read as a product feature list rather
 * than a CV. It is now a ruled, numbered list: one qualification per row with
 * the institution as its supporting line.
 */
export const Certifications = () => (
  <section id="credentials" className="scroll-mt-24 py-11">
    <div className="shell">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
        {/* -------------------------------------------------------- copy */}
        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Eyebrow>{certifications.eyebrow}</Eyebrow>

          <h2 className="mt-4 max-w-[15ch] font-display text-3xl font-medium leading-[1.15] text-ink-900 sm:text-4xl lg:text-[2.75rem]">
            Trained for this, and only this
          </h2>

          <p className="mt-4 max-w-[46ch] text-[0.95rem] leading-relaxed text-slate-body">
            {certifications.intro}
          </p>

          {/* The number carries the eye instead of a coloured badge. */}
          <ol className="mt-9 divide-y divide-ink-900/8 border-y border-ink-900/8">
            {certifications.items.slice(0, 4).map((item, i) => (
              <li key={item.id} className="flex items-baseline gap-5 py-4">
                <span className="num w-6 shrink-0 text-[0.75rem] text-rose-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-[0.98rem] font-medium leading-snug text-ink-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 max-w-[44ch] text-[0.85rem] leading-relaxed text-slate-body">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-9 grid grid-cols-3 gap-6">
            {stats.items.slice(0, 3).map((s) => (
              <div key={s.label}>
                <p className="num text-[1.9rem] font-medium leading-none text-ink-900 sm:text-[2.1rem]">
                  {s.value.toLocaleString()}
                  <span className="text-rose-500">{s.suffix}</span>
                </p>
                <p className="mt-2 text-[0.78rem] text-slate-body">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ------------------------------------------------------- image */}
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          <div className="overflow-hidden rounded-xl border border-ink-900/8 shadow-lift">
            <img
              src="/credentials_doctor_scan.png"
              alt="Dr Divya reviewing a fetal ultrasound scan"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] size-full object-cover object-center sm:aspect-[1/1]"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// Kept so the old import name still resolves.
export const Stats = Certifications;
