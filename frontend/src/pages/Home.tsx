import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Certifications } from '@/components/sections/Certifications';
import { AreasOfCare } from '@/components/sections/AreasOfCare';
import { BabyJourney } from '@/components/sections/BabyJourney';
import { Testimonials } from '@/components/sections/Testimonials';
import { Location } from '@/components/sections/Location';
import { CTA } from '@/components/sections/CTA';
import { FAQ } from '@/components/sections/FAQ';
import { scrollTo } from '@/hooks/useLenis';

export const Home = () => {
  const { hash } = useLocation();

  // Handles arriving at `/#services` from the blog page.
  useEffect(() => {
    if (!hash) return;
    const timer = window.setTimeout(() => scrollTo(hash), 120);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <>
      {/* 1 */}
      <Hero />
      {/* 2 */}
      <About />
      {/* 3 & 4: Combined Credentials & Stats (Infrastructure) */}
      <Certifications />
      {/* Areas of Care */}
      <AreasOfCare />
      {/* 6 */}
      <BabyJourney />
      {/* 7 */}
      <Testimonials />
      {/* 8 */}
      <Location />
      {/* 9 */}
      <CTA />
      {/* 10 */}
      <FAQ />
    </>
  );
};
