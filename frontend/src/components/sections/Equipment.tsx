import { motion } from 'framer-motion';
import { equipment } from '@/data/site';
import { EASE, viewportOnce } from '@/lib/motion';
import { Reveal } from '@/components/ui/Reveal';
import { Eyebrow } from '@/components/ui/SectionHeading';

/**
 * The scanner, given its own section: the machine is a large part of what the
 * practice is actually selling, and it was previously only implied by the
 * "current-generation imaging" credential.
 *
 * The photograph is optional. Without one, the right column renders a
 * typographic plate with the model name rather than a broken image or a stock
 * photo of somebody else's equipment.
 */

const ClarityIcon = () => (
  <path
    d="M2 9c2.6-4 5.1-6 7-6s4.4 2 7 6c-2.6 4-5.1 6-7 6s-4.4-2-7-6Z M9 7.2A1.8 1.8 0 1 0 9 10.8 1.8 1.8 0 1 0 9 7.2Z"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinejoin="round"
  />
);

const VolumeIcon = () => (
  <path
    d="M9 2.4 15.4 6v6L9 15.6 2.6 12V6L9 2.4Z M9 2.4V9m0 0 6.4-3M9 9l-6.4-3M9 9v6.6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinejoin="round"
  />
);

const DopplerIcon = () => (
  <path
    d="M2 9h2.6l1.7-4.6L9 13.6l2.1-6 1.3 1.4H16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const SpeedIcon = () => (
  <path
    d="M10.1 2 4 10.2h3.9L7.4 16l6.2-8.2H9.6L10.1 2Z"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinejoin="round"
  />
);

const ICONS = [ClarityIcon, VolumeIcon, DopplerIcon, SpeedIcon];

export const Equipment = () => (
  <section id="equipment" className="scroll-mt-24 py-10 overflow-x-clip">
    <div className="shell">
      <div className="grid items-stretch gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
        {/* ------------------------------------------------- the case for it */}
        <div>
          <Eyebrow>{equipment.eyebrow}</Eyebrow>

          <h2 className="mt-6 font-display text-3xl leading-[1.12] text-ink-900 sm:text-4xl lg:text-[2.75rem]">
            {equipment.heading}
          </h2>

          <p className="mt-6 max-w-[54ch] text-sm leading-relaxed text-slate-body sm:text-base">
            {equipment.intro}
          </p>

          <dl className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {equipment.advantages.map((item, i) => {
              const Icon = ICONS[i] ?? ClarityIcon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.06 * i }}
                >
                  {/* Icon and title share a line; the explanation sits under
                      both, flush with the icon. */}
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="grid size-10 shrink-0 place-items-center rounded-xl border border-ink-900/12 bg-card text-rose-500"
                    >
                      <svg viewBox="0 0 18 18" className="size-[18px]">
                        <Icon />
                      </svg>
                    </span>
                    <dt className="text-[0.95rem] font-medium leading-snug text-ink-900">
                      {item.title}
                    </dt>
                  </div>
                  <dd className="mt-2.5 text-[0.85rem] leading-relaxed text-slate-body">
                    {item.body}
                  </dd>
                </motion.div>
              );
            })}
          </dl>
        </div>

        {/* ------------------------------------------------- the machine */}
        <Reveal scale direction="none" className="relative lg:h-full">
          <div className="relative overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-float lg:absolute lg:inset-0">
            {equipment.image ? (
              <div className="relative flex h-[26rem] w-full items-center justify-center p-6 pb-12 sm:h-[34rem] sm:p-8 sm:pb-14 lg:h-full lg:p-10 lg:pb-14">
                <img
                  src={equipment.image}
                  alt={equipment.imageAlt}
                  width={620}
                  height={1116}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-contain drop-shadow-[0_18px_28px_rgba(15,23,42,0.16)]"
                />
                <p className="label absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.55rem] text-ink-500">
                  {equipment.model} · {equipment.modelSuffix}
                </p>
              </div>
            ) : (
              <div className="relative grid h-[26rem] w-full place-items-center px-8 sm:h-[34rem] lg:h-full">
                <div className="relative text-center">
                  <p className="label text-[0.6rem] text-rose-500/80">{equipment.eyebrow}</p>
                  <p className="mt-4 font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
                    {equipment.model}
                  </p>
                  <p className="label mt-3 text-ink-500">{equipment.modelSuffix}</p>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
