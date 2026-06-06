import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const SCROLL_THRESHOLD = 800;
const CONTACT_VISIBLE_THRESHOLD = 0.15;

export default function QuickApply() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [contactVisible, setContactVisible] = useState(false);
  const [pastThreshold, setPastThreshold] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => setPastThreshold(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setContactVisible(false);
      return;
    }
    const contact = document.getElementById('contact');
    if (!contact) {
      setContactVisible(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setContactVisible(entry.isIntersecting);
      },
      { threshold: CONTACT_VISIBLE_THRESHOLD }
    );
    observer.observe(contact);
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldShow = isMobile ? pastThreshold : true;
  const visible = mounted && shouldShow && !contactVisible;

  const handleClick = () => {
    if (location.pathname === '/') {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      }
      return;
    }
    try {
      sessionStorage.setItem('scrollToSection', 'contact');
    } catch {
      return;
    }
    navigate('/');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Apply now — go to contact section"
      className="fixed left-1/2"
      style={{
        bottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
        transform: 'translateX(-50%)',
        zIndex: 40,
        maxWidth: 240,
        width: 'calc(100vw - 48px)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: reducedMotion
          ? 'opacity 200ms ease'
          : 'opacity 300ms ease, transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <span
        className="flex items-center justify-center gap-2 w-full"
        style={{
          padding: '12px 24px',
          borderRadius: 9999,
          background: 'linear-gradient(135deg, #C9A234 0%, #D4AF37 100%)',
          color: '#0A0A0A',
          fontFamily: 'Lato, sans-serif',
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          boxShadow:
            '0 10px 30px rgba(201,162,52,0.4), 0 0 0 1px rgba(201,162,52,0.5)',
          animation: reducedMotion ? undefined : 'qa-pulse 2.4s ease-in-out infinite',
        }}
      >
        Apply Now
        <ArrowRight size={14} strokeWidth={2.5} />
      </span>
      <style>{`
        @keyframes qa-pulse {
          0%, 100% {
            box-shadow: 0 10px 30px rgba(201,162,52,0.4), 0 0 0 1px rgba(201,162,52,0.5);
          }
          50% {
            box-shadow: 0 14px 40px rgba(201,162,52,0.6), 0 0 0 2px rgba(201,162,52,0.85);
          }
        }
      `}</style>
    </button>
  );
}
