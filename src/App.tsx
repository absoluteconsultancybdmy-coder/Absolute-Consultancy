import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import FilmGrain from './components/FilmGrain';
import TrustBar from './components/TrustBar';
import TrustStrip from './components/TrustStrip';
import WhatsAppWidget from './components/WhatsAppWidget';
import ChatWidget from './components/ChatWidget';
import BackToTop from './components/BackToTop';
import CookieConsent from './components/CookieConsent';
import QuickApply from './components/QuickApply';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import StatsSection from './sections/StatsSection';
import ServicesSection from './sections/ServicesSection';
import WhyMalaysiaSection from './sections/WhyMalaysiaSection';
import ProcessTimeline from './sections/ProcessTimeline';
import UniversitiesSection from './sections/UniversitiesSection';
import ScholarshipsSection from './sections/ScholarshipsSection';
import StudentRecruitmentSection from './sections/StudentRecruitmentSection';
import MatcherSection from './sections/MatcherSection';
import ArcSection from './sections/ArcSection';
import BlogSection from './sections/BlogSection';
import TestimonialsSection from './sections/TestimonialsSection';
import FaqSection from './sections/FaqSection';
import ParentVoicesSection from './sections/ParentVoicesSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';
import PlacedNotification from './components/PlacedNotification';
import ScrollProgress from './components/ScrollProgress';

const ExploreUniversitiesPage = lazy(() => import('./sections/ExploreUniversitiesPage'));
const TeamPage = lazy(() => import('./sections/TeamPage'));
const ResourcesPage = lazy(() => import('./sections/ResourcesPage'));
const NotFoundPage = lazy(() => import('./sections/NotFoundPage'));
const PrivacyPage = lazy(() => import('./sections/PrivacyPage'));
const TermsPage = lazy(() => import('./sections/TermsPage'));
const BlogPostPage = lazy(() => import('./sections/BlogPostPage'));

const PAGE_TITLES: Record<string, string> = {
  '/': 'Absolute Consultancy Firm | Study Abroad Consultants — Malaysia & Bangladesh',
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
        setTimeout(() => {
          const el = document.getElementById(scrollTo);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
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

function HomePage() {
  useLenis();

  return (
    <div className="relative min-h-[100dvh] bg-mist">
      <ScrollHandler />
      <CustomCursor />
      <Navigation />
      <TrustBar />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <TrustStrip />
        <ServicesSection />
        <WhyMalaysiaSection />
        <ProcessTimeline />
        <UniversitiesSection />
        <ScholarshipsSection />
        <StudentRecruitmentSection />
        <MatcherSection />
        <ArcSection />
        <BlogSection />
        <TestimonialsSection />
        <FaqSection />
        <ParentVoicesSection />
        <ContactSection />
      </main>
      <Footer />
      <PlacedNotification />
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
      <ChatWidget />
      <BackToTop />
      <CookieConsent />
      <QuickApply />
    </>
  );
}
