import { memo, useEffect, useState } from 'react';
import { getLenis } from '../hooks/useLenis';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let raf = 0;

    const update = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const total = doc.scrollHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const ratio = Math.max(0, Math.min(1, scrollTop / total));
      setProgress(ratio * 100);
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    const lenis = getLenis();
    if (lenis) {
      lenis.on('scroll', schedule);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      if (lenis) lenis.off('scroll', schedule);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 pointer-events-none"
      style={{ height: 3, zIndex: 60 }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background:
            'linear-gradient(90deg, rgb(var(--color-gold) / 0.4) 0%, rgb(var(--color-gold)) 50%, rgb(var(--color-gold) / 0.9) 100%)',
          boxShadow: '0 0 8px rgb(var(--color-gold) / 0.6)',
          transition: reduceMotion ? 'none' : 'width 200ms ease',
        }}
      />
    </div>
  );
}

export default memo(ScrollProgress);
