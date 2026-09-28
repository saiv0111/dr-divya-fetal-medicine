import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE, viewportOnce } from '@/lib/motion';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { useBooking } from '@/components/booking/BookingContext';
import type { SERVICE_IDS } from '@drdivya/shared';

type CareTab = 'pregnancy' | 'gynaecology' | 'invasive' | 'review';
type ServiceId = (typeof SERVICE_IDS)[number];

interface CareGroup {
  /** Sub-heading inside a tab, e.g. Therapeutic vs Diagnostic. */
  label?: string;
  items: string[];
}

interface Care {
  badge: string;
  title: string;
  subtitle: string;
  groups: CareGroup[];
  ctaText: string;
  serviceId: ServiceId;
  video: string;
  poster: string;
}

/**
 * Four areas of care, listed exactly as the practice publishes them.
 *
 * Items are plain strings: the list is the information. An earlier version gave
 * each one a hover-revealed description, which added a second reading order and
 * forced a fixed card height to stop the panel jumping.
 */
const careData: Record<CareTab, Care> = {
  pregnancy: {
    badge: 'PREGNANCY & FETAL MEDICINE',
    title: 'Pregnancy & Fetal Medicine',
    subtitle:
      'Consultant-led prenatal scanning through every stage, from confirming the pregnancy to planning the delivery.',
    groups: [
      {
        items: [
          'Viability / Early Pregnancy Scan',
          'NT Scan (11–13+6 weeks)',
          'Early Anomaly Scan (16–18 weeks)',
          'TIFFA / Anomaly Scan (19–24 weeks)',
          'Fetal Echo (23–24 weeks)',
          'Growth Scan ± Doppler',
          'AFI & Doppler',
          '3D / 4D Scan',
          'Twin / Multifetal Pregnancy Evaluation',
          'Cervical Length Assessment',
        ],
      },
    ],
    ctaText: 'Book a scan',
    serviceId: 'anomaly-scan',
    video: '/pregnant-lady-video.mp4',
    poster: '/pregnant-lady-poster.jpg',
  },
  gynaecology: {
    badge: "WOMEN'S HEALTH",
    title: 'Advanced Gynaecological Ultrasound',
    subtitle:
      'High-resolution pelvic imaging performed and reported personally, during your consultation.',
    groups: [
      {
        items: ['Pelvic Scan', 'Fibroid Mapping', 'Infertility Evaluation', 'Follicular Monitoring'],
      },
    ],
    ctaText: 'Discuss your care',
    serviceId: 'high-risk-consult',
    video: '/gynaecology-video.mp4',
    poster: '/gynaecology-poster.jpg',
  },
  invasive: {
    badge: 'INVASIVE PROCEDURES',
    title: 'Invasive Procedures',
    subtitle:
      'Therapeutic and diagnostic procedures carried out under direct ultrasound guidance.',
    groups: [
      { label: 'Therapeutic', items: ['Selective Fetal Reduction', 'Intrauterine Blood Transfusion'] },
      { label: 'Diagnostic', items: ['Amniocentesis', 'CVS'] },
    ],
    ctaText: 'Discuss a procedure',
    serviceId: 'genetic-counselling',
    video: '/invasive-procedures.mp4',
    poster: '/invasive-procedures-poster.jpg',
  },
  review: {
    badge: 'COUNSELLING / EXPERT REVIEW',
    title: 'Counselling & Expert Review',
    subtitle:
      'A second opinion and the time to talk it through, whether a screening result is unclear or a previous pregnancy was difficult.',
    groups: [
      {
        items: [
          'Counselling for Fetal Anomalies',
          'High-Risk / Intermediate-Risk on Screening',
          'Preconception & Prenatal Genetic Counselling',
          'Evaluation of Pregnancy with Bad Obstetric History',
        ],
      },
    ],
    ctaText: 'Book a consultation',
    serviceId: 'genetic-counselling',
    video: '/expert-review.mp4',
    poster: '/expert-review-poster.jpg',
  },
};

const TABS: { id: CareTab; label: string }[] = [
  { id: 'pregnancy', label: 'Pregnancy & Fetal Medicine' },
  { id: 'gynaecology', label: 'Gynaecology' },
  { id: 'invasive', label: 'Invasive Procedures' },
  { id: 'review', label: 'Expert Review' },
];

export const AreasOfCare = () => {
  const [activeTab, setActiveTab] = useState<CareTab>('pregnancy');
  const { open } = useBooking();

  const current = careData[activeTab];
  const total = current.groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <section id="services" className="scroll-mt-24 pt-20 pb-10">
      <div className="shell">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">AREAS OF CARE</Eyebrow>
          <motion.h2
            className="mt-4 font-display text-4xl font-normal leading-tight tracking-tight text-ink-900 sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Four areas of care.{' '}
            <span className="font-display font-normal text-ink-900">One thoughtful approach.</span>
          </motion.h2>
        </div>

        {/* Card Container */}
        <motion.div
          className="mt-10 rounded-2xl border border-ink-900/10 bg-card p-6 shadow-float sm:mt-12 sm:rounded-3xl sm:p-10 lg:p-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
        >
          {/* Tab Controls — wraps on narrow screens rather than overflowing. */}
          <div className="flex justify-center">
            <div
              role="tablist"
              aria-label="Areas of care"
              className="inline-flex flex-wrap justify-center gap-1 rounded-[1.75rem] border border-ink-900/10 bg-ink-900/[0.055] p-1.5"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative rounded-full px-4 py-2.5 text-xs font-medium transition-colors duration-300 sm:px-5 sm:text-sm ${
                    activeTab === tab.id
                      ? 'font-semibold text-cream-50'
                      : 'text-ink-700 hover:text-ink-900'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 rounded-full bg-ink-900"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-10 sm:mt-14">
            <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
              {/* Every clip stays mounted and crossfades. Unmounting on tab
                  change threw away the decoded video and made the card flash
                  its background colour on each switch. */}
              <div className="relative aspect-[4/3] min-h-[320px] w-full overflow-hidden rounded-2xl border border-ink-900/5 bg-[#e5ece8] shadow-inner sm:aspect-[1.1/1] sm:min-h-[380px]">
                {(Object.keys(careData) as CareTab[]).map((tab) => (
                  <video
                    key={tab}
                    src={careData[tab].video}
                    poster={careData[tab].poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden
                    className={`absolute inset-0 size-full rounded-2xl object-cover object-center transition-opacity duration-500 ${
                      activeTab === tab ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-ink-950/20 via-transparent to-transparent"
                />
              </div>

              {/* Right Side: copy and the service list */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex flex-col justify-between self-stretch"
                >
                  <div>
                    <span className="label text-[0.6875rem] font-semibold uppercase tracking-widest text-rose-500/90">
                      {current.badge}
                    </span>

                    <h3 className="mt-3 font-display text-3xl font-normal leading-tight text-ink-900 sm:text-4xl">
                      {current.title}
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-slate-body sm:text-base">
                      {current.subtitle}
                    </p>

                    <div className="mt-6 border-t border-ink-900/10 pt-5">
                      {current.groups.map((group) => (
                        <div key={group.label ?? 'all'} className="[&+&]:mt-5">
                          {group.label && (
                            <p className="label mb-2 text-[0.65rem] uppercase tracking-widest text-ink-500">
                              {group.label}
                            </p>
                          )}
                          {/* Longer lists run in two columns so the panel does
                              not grow taller than the clip beside it. */}
                          <ul className={total > 6 ? 'gap-x-6 sm:columns-2' : ''}>
                            {group.items.map((item) => (
                              <li
                                key={item}
                                className="flex break-inside-avoid items-start gap-2.5 py-1.5"
                              >
                                <span aria-hidden className="mt-1 text-[0.7rem] text-rose-500">
                                  ✦
                                </span>
                                <span className="text-sm font-medium text-ink-800">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button variant="secondary" size="md" onClick={() => open(current.serviceId)}>
                      {current.ctaText}
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
