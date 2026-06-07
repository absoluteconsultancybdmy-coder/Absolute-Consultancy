import { memo, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const BOTTOM_THRESHOLD = 200;

function NextPageButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [nearBottom, setNearBottom] = useState(false);
  const [hovered, setHovered] = useState(false);
  const rafIdRef = useRef<number | null>(null);

  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) {
      setNearBottom(false);
      return;
    }
    if (typeof window === 'undefined') return;

    const evaluate = () => {
      rafIdRef.current = null;
      const scrollPos = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      setNearBottom(scrollPos >= pageHeight - BOTTOM_THRESHOLD);
    };

    const onScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = window.requestAnimationFrame(evaluate);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    evaluate();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isHome]);

  if (!isHome) return null;

  const visible = nearBottom;
  const baseShadow = '0 8px 24px rgba(201,162,52,0.45), 0 0 32px rgba(212,175,55,0.25)';
  const hoverShadow = '0 12px 32px rgba(201,162,52,0.6), 0 0 48px rgba(212,175,55,0.4)';

  return (
    <button
      type="button"
      onClick={() => navigate('/journey')}
      aria-label="Go to Your Journey page"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed inline-flex items-center gap-2 font-semibold tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        left: '50%',
        bottom: isMobile ? 76 : 92,
        transform: `translateX(-50%) translateY(${visible ? '0px' : '20px'}) scale(${
          visible && hovered ? 1.05 : 1
        })`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        background: 'linear-gradient(135deg, #C9A234 0%, #D4AF37 100%)',
        color: '#0A0A0A',
        padding: isMobile ? '10px 18px' : '14px 26px',
        fontSize: isMobile ? 14 : 15,
        borderRadius: 9999,
        border: 'none',
        boxShadow: hovered ? hoverShadow : baseShadow,
        zIndex: 40,
        transition:
          'opacity 300ms ease-out, transform 300ms ease-out, box-shadow 300ms ease-out',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      <span>Your Journey</span>
      <ArrowRight size={isMobile ? 16 : 18} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}

export default memo(NextPageButton);
