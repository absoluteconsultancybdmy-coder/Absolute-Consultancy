import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from '../hooks/useLenis';
import Navigation from '../components/Navigation';
import CustomCursor from '../components/CustomCursor';
import TrustBar from '../components/TrustBar';
import PlacedNotification from '../components/PlacedNotification';
import WhyMalaysiaSection from './WhyMalaysiaSection';
import MatcherSection from './MatcherSection';
import BlogSection from './BlogSection';
import FaqSection from './FaqSection';
import Footer from './Footer';
import TrustStrip from '../components/TrustStrip';
import ArcSection from './ArcSection';

const JourneyHero = lazy(() => import('./JourneyHero'));

function JourneyScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/journey') {
      const scrollTo = sessionStorage.getItem('scrollToSection');
      if (scrollTo) {
        sessionStorage.removeItem('scrollToSection');
        setTimeout(() => {
          const el = document.getElementById(scrollTo);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    }
  }, [location.pathname]);

  return null;
}

export default function JourneyPage() {
  useLenis();

  return (
    <div className="relative min-h-[100dvh] bg-mist">
      <JourneyScrollHandler />
      <CustomCursor />
      <Navigation />
      <TrustBar />
      <main id="main-content">
        <Suspense
          fallback={
            <div
              className="relative w-full overflow-hidden bg-mist"
              style={{ minHeight: '60vh' }}
              aria-hidden="true"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-10 h-10 rounded-full border-2 border-gold/20 border-t-gold animate-spin"
                  aria-hidden="true"
                />
              </div>
            </div>
          }
        >
          <JourneyHero />
        </Suspense>
        <WhyMalaysiaSection />
        <MatcherSection />
        <TrustStrip />
        <ArcSection />
        <BlogSection />
        <FaqSection />
      </main>
      <Footer />
      <PlacedNotification />
    </div>
  );
}
