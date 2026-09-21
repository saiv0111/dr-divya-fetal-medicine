import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { navLinks, practice } from '@/data/site';
import { EASE } from '@/lib/motion';
import { cn, scrollToId } from '@/lib/utils';
import { lockScroll, scrollTo } from '@/hooks/useLenis';
import { Button } from '@/components/ui/Button';
import { Magnetic } from '@/components/ui/Magnetic';
import { useBooking } from '@/components/booking/BookingContext';

const Wordmark = () => (
  <Link
    to="/"
    className="group flex items-center gap-2.5"
    aria-label={`${practice.name} — home`}
  >
    <img
      src="/fetal-medicine-logo.png"
      alt={practice.name}
      className="h-10 w-auto object-contain brightness-0 dark:brightness-100"
    />
  </Link>
);

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { open } = useBooking();
  const location = useLocation();
  const navigate = useNavigate();

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(current > 24);
    // Hide on the way down, reveal the moment the user scrolls back up.
    setHidden(current > previous && current > 320 && !menuOpen);
  });

  useEffect(() => {
    lockScroll(menuOpen);
    return () => lockScroll(false);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleNav = (href: string) => (event: React.MouseEvent) => {
    setMenuOpen(false);
    if (!href.includes('#')) return;
    event.preventDefault();
    const hash = `#${href.split('#')[1]}`;
    if (location.pathname !== '/') {
      navigate(`/${hash}`);
      return;
    }
    if (!scrollTo(hash)) scrollToId(hash);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div
          className={cn(
            'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
            scrolled ? 'glass border-b border-ink-900/8 py-2.5' : 'border-b border-transparent py-4',
          )}
        >
          <nav className="shell flex items-center justify-between gap-6">
            <Wordmark />

            <ul className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) =>
                link.href.startsWith('/blog') ? (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className={cn(
                        'rounded-full px-3.5 py-2 text-[0.8125rem] transition-colors duration-300 hover:text-rose-500',
                        location.pathname === link.href ? 'text-rose-500' : 'text-ink-700',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ) : (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={handleNav(link.href)}
                      className="rounded-full px-3.5 py-2 text-[0.8125rem] text-ink-700 transition-colors duration-300 hover:text-rose-500"
                    >
                      {link.label}
                    </a>
                  </li>
                ),
              )}
            </ul>

            <div className="flex items-center gap-3">
              <Magnetic className="hidden sm:block">
                <Button size="md" onClick={() => open()}>
                  Book a scan
                </Button>
              </Magnetic>

              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                className="grid size-10 place-items-center rounded-full border border-ink-900/15 lg:hidden"
              >
                <span className="relative block h-3 w-4">
                  <motion.span
                    className="absolute left-0 top-0 block h-px w-full bg-ink-900"
                    animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                  <motion.span
                    className="absolute left-0 top-1.5 block h-px w-full bg-ink-900"
                    animate={{ opacity: menuOpen ? 0 : 1, x: menuOpen ? 8 : 0 }}
                    transition={{ duration: 0.25 }}
                  />
                  <motion.span
                    className="absolute bottom-0 left-0 block h-px w-full bg-ink-900"
                    animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink-900 px-6 pb-10 pt-28 text-cream-100 lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <motion.ul
              className="flex flex-1 flex-col justify-center gap-1"
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.06, delayChildren: 0.18 }}
            >
              {navLinks.map((link) => (
                <li key={link.href} className="overflow-hidden">
                  <motion.div
                    variants={{ hidden: { y: '100%', opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    {link.href.startsWith('/blog') ? (
                      <Link
                        to={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block py-2.5 font-display text-4xl tracking-tight"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        onClick={handleNav(link.href)}
                        className="block py-2.5 font-display text-4xl tracking-tight"
                      >
                        {link.label}
                      </a>
                    )}
                  </motion.div>
                </li>
              ))}
            </motion.ul>

            <motion.div
              className="space-y-4 border-t border-cream-100/15 pt-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: EASE }}
            >
              <Button
                variant="onDark"
                className="w-full"
                onClick={() => {
                  setMenuOpen(false);
                  open();
                }}
              >
                Book a scan
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
