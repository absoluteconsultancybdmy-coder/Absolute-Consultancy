import { useState, useEffect } from 'react';
import { useLenis } from './hooks/useLenis';
import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import TrustBar from './components/TrustBar';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import StatsSection from './sections/StatsSection';
import ServicesSection from './sections/ServicesSection';
import UniversitiesSection from './sections/UniversitiesSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';
import ExploreUniversitiesPage from './sections/ExploreUniversitiesPage';

function getPageFromHash(): 'home' | 'explore' {
  return window.location.hash === '#explore' ? 'explore' : 'home';
}

export default function App() {
  useLenis();
  const [currentPage, setCurrentPage] = useState<'home' | 'explore'>(getPageFromHash);

  // Listen for hash changes (back/forward navigation)
  useEffect(() => {
    const onHashChange = () => {
      const page = getPageFromHash();
      setCurrentPage(page);
      if (page === 'home') {
        const scrollTo = sessionStorage.getItem('scrollToSection');
        if (scrollTo) {
          sessionStorage.removeItem('scrollToSection');
          setTimeout(() => {
            const el = document.getElementById(scrollTo);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // On initial load, check for scroll target after returning
  useEffect(() => {
    if (currentPage === 'home') {
      const scrollTo = sessionStorage.getItem('scrollToSection');
      if (scrollTo) {
        sessionStorage.removeItem('scrollToSection');
        setTimeout(() => {
          const el = document.getElementById(scrollTo);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [currentPage]);

  const navigateTo = (page: 'home' | 'explore') => {
    if (page === 'explore') {
      window.location.hash = 'explore';
    } else {
      window.location.hash = '';
    }
    setCurrentPage(page);
  };

  if (currentPage === 'explore') {
    return (
      <ExploreUniversitiesPage onBack={() => {
        navigateTo('home');
      }} />
    );
  }

  return (
    <div className="relative bg-mist min-h-screen">
      <CustomCursor />
      <Navigation />
      <TrustBar />
      <main>
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <ServicesSection />
        <UniversitiesSection onExploreMore={() => {
          window.scrollTo({ top: 0 });
          navigateTo('explore');
        }} />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}