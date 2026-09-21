import { practice } from '@/data/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="size-[1.15rem]">
    <path
      d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const DirectionsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="size-4">
    <path
      d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Zm0 0v13m6-10.5v13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ExternalIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
    <path
      d="M6 3h7v7M13 3 4 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MapFrame = () => (
  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-ink-900/10 lg:aspect-auto lg:h-full lg:min-h-[34rem]">
    <iframe
      src={practice.mapsEmbedUrl}
      title={`Map showing ${practice.name}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      className="size-full border-0"
    />

    {/* Floating control, so the embed itself stays uncluttered. */}
    <a
      href={practice.mapsDirectionsUrl}
      target="_blank"
      rel="noreferrer noopener"
      className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-lg bg-card px-3.5 py-2.5 text-[0.8125rem] font-semibold text-ink-900 shadow-lift transition-transform duration-300 hover:-translate-y-0.5"
    >
      Open in Maps
      <ExternalIcon />
    </a>
  </div>
);

export const Location = () => (
  <section id="location" className="scroll-mt-24 py-10">
    <div className="shell">
      <SectionHeading
        eyebrow="Find Us"
        heading="One clinic, easy to reach"
        intro="Ground-level access, a quiet waiting area kept deliberately small, and parking in the same building."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
        {/* ------------------------------------------------- address + hours */}
        <div className="flex flex-col gap-6">
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-ink-900/10 bg-card p-7 md:p-8">
              <div className="flex items-start gap-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-ink-900/12 text-ink-700">
                  <PinIcon />
                </span>

                <div>
                  <h3 className="font-display text-xl leading-snug text-ink-900">
                    {practice.name}
                  </h3>
                  <address className="mt-3 not-italic text-[0.95rem] leading-[1.9] text-slate-body">
                    {practice.address.line1}
                    <br />
                    {practice.address.line2}
                    <br />
                    {practice.address.city}
                  </address>
                </div>
              </div>

              <a
                href={practice.mapsDirectionsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="label mt-7 inline-flex items-center gap-2.5 border-b border-ink-900/25 pb-1.5 text-ink-900 transition-colors duration-300 hover:border-rose-500 hover:text-rose-500"
              >
                <DirectionsIcon />
                Get directions
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="rounded-2xl bg-ink-900 p-7 text-cream-100 md:p-8">
              <p className="label text-cream-100/55">Clinic hours</p>

              <dl className="mt-5 divide-y divide-cream-100/12 border-t border-cream-100/12">
                {practice.hours.map((slot) => (
                  <div key={slot.day} className="flex items-baseline justify-between gap-6 py-3.5">
                    <dt className="text-[0.95rem] text-cream-100/75">{slot.day}</dt>
                    <dd className="num text-[0.95rem] text-cream-50">{slot.time}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-cream-100/12 pt-5">
                <a
                  href={practice.phoneHref}
                  className="num text-[0.95rem] text-cream-50 transition-colors duration-300 hover:text-rose-300"
                >
                  {practice.phone}
                </a>
                <a
                  href={`mailto:${practice.email}`}
                  className="text-[0.875rem] text-cream-100/60 transition-colors duration-300 hover:text-rose-300"
                >
                  {practice.email}
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ------------------------------------------------------------ map */}
        <Reveal direction="left" delay={0.12} className="lg:h-full">
          <MapFrame />
        </Reveal>
      </div>
    </div>
  </section>
);
