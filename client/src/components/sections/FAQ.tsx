import { faqs, practice } from '@/data/site';
import { Accordion } from '@/components/ui/Accordion';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { SplitWords } from '@/components/ui/SplitWords';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { useBooking } from '@/components/booking/BookingContext';

export const FAQ = () => {
  const { open } = useBooking();

  return (
    <section id="faqs" className="scroll-mt-24 pt-10 pb-20">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow>{faqs.eyebrow}</Eyebrow>
            <SplitWords
              as="h2"
              words={faqs.heading.split(' ')}
              className="display-lg mt-5 max-w-[12ch] text-ink-900"
            />

            <Reveal delay={0.15} className="mt-10 rounded-2xl border border-ink-900/10 bg-card p-7">
              <p className="font-display text-xl leading-snug text-ink-900">
                Still not sure about something?
              </p>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-slate-body">
                Ask before you book. The front desk will put a clinical question to Dr. Divya and
                call you back — no appointment required.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button size="md" onClick={() => open()}>
                  Book an appointment
                </Button>
                <a
                  href={practice.phoneHref}
                  className="link-wipe w-fit text-sm text-ink-700"
                >
                  Or call {practice.phone}
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Accordion items={faqs.items} />
          </Reveal>
        </div>
      </div>
    </section>
  );
};
