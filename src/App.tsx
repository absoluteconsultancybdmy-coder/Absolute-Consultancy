import { useLenis } from './hooks/useLenis';
import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import StatsSection from './sections/StatsSection';
import ServicesSection from './sections/ServicesSection';
import DestinationsSection from './sections/DestinationsSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

export default function App() {
  useLenis();

  return (
    <div className="relative bg-mist min-h-screen">
      <CustomCursor />
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <ServicesSection />
        <DestinationsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
