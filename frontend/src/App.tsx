import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from '@/hooks/useLenis';
import { EASE } from '@/lib/motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/ui/Decor';
import { BookingProvider } from '@/components/booking/BookingContext';
import { BookingDrawer } from '@/components/booking/BookingDrawer';
import { Home } from '@/pages/Home';
import { Blog } from '@/pages/Blog';

const TITLES: Record<string, string> = {
  '/': "Dr. Divya · Fetal Medicine & Women's Health",
  '/blog': "Journal · Dr. Divya Fetal Medicine",
};

/** Resets scroll and document title on navigation (but not on hash links). */
const RouteEffects = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    document.title = TITLES[pathname] ?? TITLES['/']!;
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
};

const Page = ({ children }: { children: React.ReactNode }) => (
  <motion.main
    id="main"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35, ease: EASE }}
  >
    {children}
  </motion.main>
);

const NotFound = () => (
  <div className="shell flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
    <p className="label text-ink-500">404</p>
    <h1 className="display-lg max-w-[16ch] text-ink-900">This page has moved, or never existed.</h1>
    <a href="/" className="link-wipe text-sm text-ink-700">
      Back to the homepage
    </a>
  </div>
);

export const App = () => {
  const location = useLocation();
  useLenis();

  return (
    <BookingProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:text-cream-100"
      >
        Skip to content
      </a>

      <ScrollProgress />
      <RouteEffects />
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Page>
                <Home />
              </Page>
            }
          />
          <Route
            path="/blog"
            element={
              <Page>
                <Blog />
              </Page>
            }
          />
          <Route
            path="*"
            element={
              <Page>
                <NotFound />
              </Page>
            }
          />
        </Routes>
      </AnimatePresence>

      <Footer />
      <BookingDrawer />
    </BookingProvider>
  );
};
