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
    video: "/pregnant-lady-video.mp4"
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
    video: "/gynaecology-video.mp4"
  }
};

export const AreasOfCare = () => {
  const [activeTab, setActiveTab] = useState<CareTab>('pregnancy');
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const { open } = useBooking();

  const current = careData[activeTab];

  return (
    <section id="areas-of-care" className="scroll-mt-24 pt-20 pb-10">
      <div className="shell">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <Eyebrow className="justify-center">AREAS OF CARE</Eyebrow>
          <motion.h2
            className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-ink-900 leading-tight tracking-tight font-normal"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Two specialties. <br className="hidden sm:inline" />
            <span className="font-display text-ink-900 font-normal">One thoughtful approach.</span>
          </motion.h2>
        </div>

        {/* Card Container */}
        <motion.div
          className="mt-10 sm:mt-12 rounded-2xl sm:rounded-3xl border border-ink-900/10 bg-card p-6 sm:p-10 lg:p-14 shadow-float"
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
                  setHoveredIndex(0);
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
                  setHoveredIndex(0);
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
          <div className="mt-10 sm:mt-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === 'pregnancy' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === 'pregnancy' ? 20 : -20 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 items-start"
              >
                {/* Left Side: looping clip for the active area of care */}
                <div className="relative overflow-hidden rounded-2xl border border-ink-900/5 bg-[#e5ece8] aspect-[4/3] w-full min-h-[320px] shadow-inner sm:aspect-[1.1/1] sm:min-h-[380px]">
                  <video
                    key={current.video}
                    src={current.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-hidden
                    className="absolute inset-0 size-full rounded-2xl object-cover object-center"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-ink-950/20 via-transparent to-transparent"
                  />
                </div>

                {/* Right Side: Text & Interactive Features List */}
                <div className="flex flex-col justify-between self-stretch">
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

                    {/* Interactive Feature Items List with Constant Card Height */}
                    <div className="mt-6 border-t border-ink-900/10 pt-3 space-y-1">
                      {current.items.map((item, idx) => {
                        const isHovered = hoveredIndex === idx;

                        return (
                          <div
                            key={item.title}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onClick={() => setHoveredIndex(idx)}
                            className={`group cursor-pointer rounded-xl p-3 sm:p-3.5 transition-all duration-300 border ${
                              isHovered
                                ? 'bg-cream-100/90 border-ink-900/10 shadow-sm'
                                : 'bg-transparent border-transparent hover:bg-cream-100/40'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`text-xs transition-transform duration-300 ${
                                  isHovered ? 'text-rose-500 scale-125 rotate-45' : 'text-rose-400'
                                }`}
                                aria-hidden
                              >
                                ✦
                              </span>
                              <span
                                className={`text-sm sm:text-base transition-colors duration-200 ${
                                  isHovered ? 'font-semibold text-ink-900' : 'font-medium text-ink-800'
                                }`}
                              >
                                {item.title}
                              </span>
                            </div>

                            {/* Synchronous Height Toggle with Smooth Opacity Fade for 100% Constant Card Size */}
                            <div
                              className={`overflow-hidden pl-6 pr-2 transition-opacity duration-200 flex items-center ${
                                isHovered
                                  ? 'h-[2.6rem] mt-1.5 opacity-100'
                                  : 'h-0 mt-0 opacity-0 pointer-events-none'
                              }`}
                            >
                              <p className="text-xs sm:text-sm leading-snug text-slate-body font-normal line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
