import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE, viewportOnce } from '@/lib/motion';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { useBooking } from '@/components/booking/BookingContext';

type CareTab = 'pregnancy' | 'gynaecology';

interface CareItem {
  title: string;
  description: string;
}

const careData = {
  pregnancy: {
    id: 'pregnancy',
    badge: "PREGNANCY & FETAL MEDICINE",
    title: "Pregnancy & Fetal Medicine",
    subtitle: "Consultant-led prenatal care, accredited screening and advanced ultrasound diagnostics through every week of your pregnancy.",
    items: [
      {
        title: "First & second trimester screening",
        description: "Combined NT screening, early structural anomaly surveys, and blood biomarker risk calculation."
      },
      {
        title: "High-risk pregnancy consultation",
        description: "Specialised management for multiple gestations, growth restriction, and complex maternal conditions."
      },
      {
        title: "Fetal echocardiography & Dopplers",
        description: "Targeted structural heart evaluation with umbilical, MCA, and ductus venosus flow surveillance."
      },
      {
        title: "Genetic counselling & diagnostics",
        description: "Clear pre-test guidance for NIPT, CVS, and amniocentesis with direct ultrasound guidance."
      }
    ] as CareItem[],
    ctaText: "Book a scan",
    video: "/pregnant-lady-video.mp4",
    poster: "/pregnant-lady-poster.jpg"
  },
  gynaecology: {
    id: 'gynaecology',
    badge: "WOMEN'S HEALTH",
    title: "Gynaecology",
    subtitle: "Thoughtful women's healthcare across routine concerns, preventive care and conditions that deserve specialist attention.",
    items: [
      {
        title: "Preventive consultations",
        description: "Annual wellness check-ups, cervical cancer screening, and personalized preventive care routines."
      },
      {
        title: "Menstrual concerns",
        description: "Evaluation and evidence-based relief for irregular cycles, heavy bleeding, and pelvic pain."
      },
      {
        title: "Preconception counselling",
        description: "Health optimization, risk screening, and medical guidance before embarking on pregnancy."
      },
      {
        title: "Ultrasound-led assessment",
        description: "High-resolution pelvic ultrasound scans performed personally during your consultation."
      }
    ] as CareItem[],
    ctaText: "Discuss your care",
    video: "/gynaecology-video.mp4",
    poster: "/gynaecology-poster.jpg"
  }
};

export const AreasOfCare = () => {
  const [activeTab, setActiveTab] = useState<CareTab>('pregnancy');
  const { open } = useBooking();

  const current = careData[activeTab];

  return (
    <section id="services" className="scroll-mt-24 py-11">
      <div className="shell">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">AREAS OF CARE</Eyebrow>
          <motion.h2
            className="mt-4 font-display text-[2rem] font-normal leading-tight tracking-tight text-ink-900 sm:text-[2.6rem] lg:text-[3.1rem]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Two specialties.{' '}
            <span className="font-display font-normal text-ink-900">One thoughtful approach.</span>
          </motion.h2>
        </div>

        {/* Card Container */}
        <motion.div
          className="mt-10 sm:mt-9 rounded-2xl sm:rounded-3xl border border-ink-900/8 bg-cream-50 p-6 sm:p-10 lg:p-14 shadow-lift"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
        >
          {/* Tab Controls (Centered) */}
          <div className="flex justify-center">
            <div className="inline-flex items-center rounded-full bg-ink-900/[0.055] p-1.5 border border-ink-900/10">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('pregnancy');
                }}
                className={`relative rounded-full px-5 sm:px-7 py-2.5 text-xs sm:text-sm font-medium transition-colors duration-300 ${
                  activeTab === 'pregnancy'
                    ? 'text-cream-50 font-semibold'
                    : 'text-ink-700 hover:text-ink-900'
                }`}
              >
                {activeTab === 'pregnancy' && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-full bg-ink-900"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10">Pregnancy & Fetal Medicine</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('gynaecology');
                }}
                className={`relative rounded-full px-5 sm:px-7 py-2.5 text-xs sm:text-sm font-medium transition-colors duration-300 ${
                  activeTab === 'gynaecology'
                    ? 'text-cream-50 font-semibold'
                    : 'text-ink-700 hover:text-ink-900'
                }`}
              >
                {activeTab === 'gynaecology' && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-full bg-ink-900"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10">Gynaecology</span>
              </button>
            </div>
          </div>

          {/* Tab Content (Grid Layout) */}
          <div className="mt-10 sm:mt-10">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 items-start">
              {/* Left Side: both clips stay mounted and crossfade.
                  Unmounting them on tab change threw away the decoded video and
                  made the card flash its background colour on every switch. The
                  poster is each clip's own first frame, so there is nothing
                  visible to "swap" once the video starts. */}
              <div className="relative overflow-hidden rounded-2xl border border-ink-900/5 bg-[#e5ece8] aspect-[4/3] w-full min-h-[320px] shadow-inner sm:aspect-[1.1/1] sm:min-h-[380px]">
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

              {/* Right Side: Text & Interactive Features List */}
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
                    <span className="label text-[0.6875rem] uppercase tracking-widest text-rose-500/90 font-semibold">
                      {current.badge}
                    </span>

                    <h3 className="mt-3 font-display text-3xl sm:text-4xl text-ink-900 leading-tight font-normal">
                      {current.title}
                    </h3>

                    <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-body">
                      {current.subtitle}
                    </p>

                    {/* Just the points. The hover-reveal description under each
                        one added a second reading order to scan and forced a
                        fixed card height to stop the panel jumping. */}
                    <ul className="mt-6 space-y-1 border-t border-ink-900/10 pt-4">
                      {current.items.map((item) => (
                        <li key={item.title} className="flex items-center gap-3 py-2">
                          <span aria-hidden className="text-xs text-rose-500">
                            ✦
                          </span>
                          <span className="text-sm font-medium text-ink-800 sm:text-base">
                            {item.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => open(activeTab === 'gynaecology' ? 'high-risk-consult' : 'anomaly-scan')}
                    >
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
