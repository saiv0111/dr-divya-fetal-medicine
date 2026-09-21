import { trustMarquee } from '@/data/site';
import { Marquee } from '@/components/ui/Marquee';

const Item = ({ label }: { label: string }) => (
  <span className="flex shrink-0 items-center gap-8 px-8">
    <span className="label whitespace-nowrap text-cream-100/70">{label}</span>
    <svg viewBox="0 0 12 12" aria-hidden className="size-2 shrink-0 text-rose-300">
      <circle cx="6" cy="6" r="3" fill="currentColor" />
    </svg>
  </span>
);

/** Thin credential ticker that separates the hero from the story below it. */
export const TrustMarquee = () => (
  <div className="relative z-10 border-y border-cream-100/10 bg-shell py-5">
    <h2 className="sr-only">Accreditations and areas of practice</h2>
    <Marquee duration={48} fade>
      {trustMarquee.map((label) => (
        <Item key={label} label={label} />
      ))}
    </Marquee>
  </div>
);
