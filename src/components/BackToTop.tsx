import { memo, useEffect, useState } from 'react';
import { getLenis } from '../hooks/useLenis';

const SHOW_THRESHOLD = 1000;

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let raf = 0;
    const update = () => {
      raf = 0;
      setVisible(window.scrollY > SHOW_THRESHOLD);
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const handleClick = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      className="fixed flex items-center justify-center rounded-full focus:outline-none"
      style={{
        right: 'max(24px, env(safe-area-inset-right, 24px))',
        bottom: 96,
        width: 44,
        height: 44,
        backgroundColor: '#C9A234',
        color: '#0A0A0A',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        zIndex: 40,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.92)',
        transition: 'opacity 300ms ease, transform 300ms ease, background-color 200ms ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D4AF37')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#C9A234')}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

export default memo(BackToTop);
