import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doctor, footer, practice } from '@/data/site';
import { EASE, viewportOnce } from '@/lib/motion';
import { scrollToId } from '@/lib/utils';
import { scrollTo } from '@/hooks/useLenis';
import { useBooking } from '@/components/booking/BookingContext';

export const Footer = () => {
  const { open } = useBooking();

  const handleAnchor = (href: string) => (event: React.MouseEvent) => {
    if (href === '#book') {
      event.preventDefault();
      open();
      return;
    }
    if (!href.includes('#')) return;
    event.preventDefault();
    const hash = `#${href.split('#')[1]}`;
    if (!scrollTo(hash)) scrollToId(hash);
  };

  return (
    <footer className="relative overflow-hidden bg-shell text-cream-100">
      <div className="shell relative z-10 pt-20">
        <div className="grid gap-14 pb-16 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-10">
          <div className="max-w-sm">
            <Link to="/" aria-label={practice.name}>
              <img
                src="/brand-logo.png"
                alt={practice.name}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-cream-100/60">{footer.blurb}</p>
            <div className="mt-7 space-y-1.5 text-sm">
              <a href={practice.phoneHref} className="link-wipe block w-fit text-cream-100/85">
                {practice.phone}
              </a>
              <a href={`mailto:${practice.email}`} className="link-wipe block w-fit text-cream-100/85">
                {practice.email}
              </a>
              <a
                href={`mailto:${practice.emailAlt}`}
                className="link-wipe block w-fit text-cream-100/85"
              >
                {practice.emailAlt}
              </a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {practice.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="label link-wipe text-cream-100/50 hover:text-cream-50"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="label text-cream-100/40">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/blog') ? (
                      <Link to={link.href} className="link-wipe text-sm text-cream-100/70 hover:text-cream-50">
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        onClick={handleAnchor(link.href)}
                        className="link-wipe text-sm text-cream-100/70 hover:text-cream-50"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

        </div>

        {/* Oversized wordmark that rises into place as the footer enters view. */}
        <div className="overflow-hidden border-t border-cream-100/12 pt-10">
          {/* SVG rather than a font-size clamp: `textLength` pins the name to the
              container width, so it fits exactly at every breakpoint instead of
              running past the edge on wide screens. The viewBox matches the
              name's natural width at this font size (1748 units in Baskervville),
              so the glyphs are not stretched or squashed to get there — it just
              scales down to whatever the container is. Re-measure if the name or
              the display font changes. */}
          <motion.svg
            aria-hidden
            viewBox="0 0 1748 196"
            preserveAspectRatio="xMidYMid meet"
            className="block w-full select-none overflow-visible"
            initial={{ y: '18%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <text
              x="874"
              y="150"
              textAnchor="middle"
              textLength="1748"
              lengthAdjust="spacing"
              fontSize="150"
              className="fill-cream-100/16 font-display"
            >
              Dr. Divya&rsquo;s Fetal Medicine
            </text>
          </motion.svg>
        </div>

        <div className="flex flex-col gap-6 border-t border-cream-100/12 py-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-[0.7rem] leading-relaxed text-cream-100/40">{footer.disclaimer}</p>
            <p className="text-[0.7rem] text-cream-100/30">
              © {new Date().getFullYear()} {practice.name}. {doctor.registration}.
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="link-wipe text-[0.7rem] text-cream-100/45">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
