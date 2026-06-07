import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import { useIdleCallback } from './hooks/useIdleCallback';
import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import FilmGrain from './components/FilmGrain';
import TrustBar from './components/TrustBar';
import WhatsAppWidget from './components/WhatsAppWidget';
import BackToTop from './components/BackToTop';
import NextPageButton from './components/NextPageButton';
import CookieConsent from './components/CookieConsent';
import QuickApply from './components/QuickApply';
import HeroSection from './sections/HeroSection';
import { LazySection } from './components/LazySection';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollProgress from './components/ScrollProgress';
// import ThemeToggle from './components/ThemeToggle';

// === Home page sections (below the fold) ===
// Each is split into its own JS chunk and only mounted when the section
// is within 300px of the viewport. Wrapped in ErrorBoundary for resilience.
const AboutSection = lazy(() => import('./sections/AboutSection'));
const StatsSection = lazy(() => import('./sections/StatsSection'));
const ProcessTimeline = lazy(() => import('./sections/ProcessTimeline'));
const ServicesSection = lazy(() => import('./sections/ServicesSection'));
const StudentRecruitmentSection = lazy(
  () => import('./sections/StudentRecruitmentSection')
);
const UniversitiesSection = lazy(() => import('./sections/UniversitiesSection'));
const ScholarshipsSection = lazy(() => import('./sections/ScholarshipsSection'));
const TestimonialsSection = lazy(() => import('./sections/TestimonialsSection'));
const ParentVoicesSection = lazy(() => import('./sections/ParentVoicesSection'));
const ContactSection = lazy(() => import('./sections/ContactSection'));
const Footer = lazy(() => import('./sections/Footer'));

// === Non-home routes ===
const ExploreUniversitiesPage = lazy(() => import('./sections/ExploreUniversitiesPage'));
const TeamPage = lazy(() => import('./sections/TeamPage'));
const ResourcesPage = lazy(() => import('./sections/ResourcesPage'));
const JourneyPage = lazy(() => import('./sections/JourneyPage'));
const NotFoundPage = lazy(() => import('./sections/NotFoundPage'));
const PrivacyPage = lazy(() => import('./sections/PrivacyPage'));
const TermsPage = lazy(() => import('./sections/TermsPage'));
const BlogPostPage = lazy(() => import('./sections/BlogPostPage'));

// === Non-critical widget ===
const PlacedNotification = lazy(() => import('./components/PlacedNotification'));

const PAGE_TITLES: Record<string, string> = {
  '/': 'Absolute Consultancy Firm | Study Abroad Consultants — Malaysia & Bangladesh',
  '/journey': 'Why Malaysia? | Absolute Consultancy Firm',
  '/explore': 'All Partner Universities | Absolute Consultancy Firm',
  '/resources': 'Resources Hub | Absolute Consultancy Firm',
  '/team': 'Meet The Team | Absolute Consultancy Firm',
  '/privacy': 'Privacy Policy | Absolute Consultancy Firm',
  '/terms': 'Terms of Service | Absolute Consultancy Firm',
  '/404': 'Page Not Found | Absolute Consultancy Firm',
};

function ScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      const scrollTo = sessionStorage.getItem('scrollToSection');
      if (scrollTo) {
        sessionStorage.removeItem('scrollToSection');
        const tryScroll = (attempt: number) => {
          const el = document.getElementById(scrollTo);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else if (attempt < 20) {
            setTimeout(() => tryScroll(attempt + 1), 200);
          }
        };
        tryScroll(0);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const title = PAGE_TITLES[location.pathname] ?? PAGE_TITLES['/404'];
    document.title = title;
  }, [location.pathname]);

  return null;
}

function SectionFallback() {
  return (
    <div
      className="relative w-full overflow-hidden bg-mist"
      style={{ minHeight: '60vh' }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-x-0 top-0 h-px animate-pulse"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(201,162,52,0.45) 50%, transparent 100%)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-full border-2 border-gold/20 border-t-gold animate-spin"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/**
 * IdlePlacedNotification — wraps the lazy PlacedNotification widget and
 * only begins to fetch / mount it once the browser is idle. Until then a
 * zero-height placeholder is rendered so layout is unaffected.
 */
function IdlePlacedNotification() {
  const ready = useIdleCallback(undefined, 4000);
  // The hook always runs, but we only render after it's been scheduled.
  // The 4s timeout ensures the chunk is requested within 4s regardless
  // of idle state. The first render returns null; once idle, we mount.
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <PlacedNotification />
    </Suspense>
  );
}

interface SectionBoundaryProps {
  name: string;
  children: ReactNode;
  minHeight?: string;
}

/**
 * SectionBoundary — single Suspense + ErrorBoundary pair so each lazy
 * section is independently resilient and a failure in one doesn't break
 * the rest of the home page.
 */
function SectionBoundary({ name, children, minHeight = '60vh' }: SectionBoundaryProps) {
  return (
    <ErrorBoundary name={name}>
      <Suspense fallback={<SectionFallback />}>
        <LazySection minHeight={minHeight} rootMargin="300px">
          {children}
        </LazySection>
      </Suspense>
    </ErrorBoundary>
  );
}

function HomePage() {
  useLenis();

  return (
    <div className="relative min-h-[100dvh] bg-mist">
      <ScrollHandler />
      <CustomCursor />
      <Navigation />
      <TrustBar />
      <main id="main-content">
        {/* Above the fold — eager */}
        <HeroSection />
        <SectionBoundary name="About the Firm" minHeight="80vh">
          <AboutSection />
        </SectionBoundary>
        <SectionBoundary name="Result" minHeight="40vh">
          <StatsSection />
        </SectionBoundary>
        <SectionBoundary name="Your Journey" minHeight="70vh">
          <ProcessTimeline />
        </SectionBoundary>
        <SectionBoundary name="Student Recruitment" minHeight="60vh">
          <StudentRecruitmentSection />
        </SectionBoundary>
        <SectionBoundary name="Our Partner Uni" minHeight="90vh">
          <UniversitiesSection />
        </SectionBoundary>
        <SectionBoundary name="Scholarship" minHeight="60vh">
          <ScholarshipsSection />
        </SectionBoundary>
        <SectionBoundary name="Service" minHeight="70vh">
          <ServicesSection />
        </SectionBoundary>
        <SectionBoundary name="Student Stories" minHeight="60vh">
          <TestimonialsSection />
        </SectionBoundary>
        <SectionBoundary name="Parent Stories" minHeight="60vh">
          <ParentVoicesSection />
        </SectionBoundary>
        <SectionBoundary name="Contact" minHeight="80vh">
          <ContactSection />
        </SectionBoundary>
      </main>
      <SectionBoundary name="Footer" minHeight="30vh">
        <Footer />
      </SectionBoundary>
      <IdlePlacedNotification />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollProgress />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <FilmGrain />
      <div className="relative" style={{ zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/explore"
            element={
              <Suspense fallback={<SectionFallback />}>
                <ExploreUniversitiesPage />
              </Suspense>
            }
          />
          <Route
            path="/journey"
            element={
              <Suspense fallback={<SectionFallback />}>
                <JourneyPage />
              </Suspense>
            }
          />
          <Route
            path="/team"
            element={
              <Suspense fallback={<SectionFallback />}>
                <TeamPage />
              </Suspense>
            }
          />
          <Route
            path="/resources"
            element={
              <Suspense fallback={<SectionFallback />}>
                <ResourcesPage />
              </Suspense>
            }
          />
          <Route
            path="/privacy"
            element={
              <Suspense fallback={<SectionFallback />}>
                <PrivacyPage />
              </Suspense>
            }
          />
          <Route
            path="/terms"
            element={
              <Suspense fallback={<SectionFallback />}>
                <TermsPage />
              </Suspense>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <Suspense fallback={<SectionFallback />}>
                <BlogPostPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<SectionFallback />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Routes>
      </div>
      <WhatsAppWidget />
      <BackToTop />
      <NextPageButton />
      <CookieConsent />
      <QuickApply />
      {/* <ThemeToggle /> hidden — theme toggle not final */}
    </>
  );
}
