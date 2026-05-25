import { useEffect, useRef } from 'react';

/**
 * CustomCursor — Two operational states:
 * Default: 6px solid gold dot with 0.12 lerp lag
 * Hover:   28px outlined gold circle (transparent fill)
 *
 * Mobile: hidden entirely on pointer:coarse devices
 * mix-blend-mode: difference ensures visibility on dark + light panels
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Disable on touch / coarse-pointer devices (mobile)
    const isTouchDevice =
      window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (isTouchDevice) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Hide system cursor
    document.body.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        'a, button, [role="button"], .polaroid, .polaroid-hero, .glass-card, input, textarea, select, .pathway-cluster'
      );
      if (isInteractive && !isHoveringRef.current) {
        isHoveringRef.current = true;
        // Dot: shrink to near-invisible
        dot.style.transform = 'translate(-50%, -50%) scale(0)';
        dot.style.opacity = '0';
        // Ring: expand to 28px outlined circle
        ring.style.width = '28px';
        ring.style.height = '28px';
        ring.style.borderColor = 'rgba(201, 162, 52, 0.9)';
        ring.style.opacity = '1';
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        'a, button, [role="button"], .polaroid, .polaroid-hero, .glass-card, input, textarea, select, .pathway-cluster'
      );
      if (isInteractive && isHoveringRef.current) {
        isHoveringRef.current = false;
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
        dot.style.opacity = '1';
        ring.style.width = '28px';
        ring.style.height = '28px';
        ring.style.borderColor = 'rgba(201, 162, 52, 0.35)';
        ring.style.opacity = '0.5';
      }
    };

    // rAF loop: smooth lerp at 0.12 lag coefficient
    const animate = () => {
      const LERP = 0.12;
      posRef.current.x += (targetRef.current.x - posRef.current.x) * LERP;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * LERP;

      const x = posRef.current.x;
      const y = posRef.current.y;

      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Skip render entirely on touch devices
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  return (
    <>
      {/* Dot — solid 6px gold core */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#C9A234',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'opacity 200ms ease, transform 200ms ease',
          mixBlendMode: 'difference',
        }}
      />
      {/* Ring — 28px outlined circle, always trailing */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '1px solid rgba(201, 162, 52, 0.35)',
          backgroundColor: 'transparent',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0.5,
          transition: 'width 250ms cubic-bezier(0.16,1,0.3,1), height 250ms cubic-bezier(0.16,1,0.3,1), border-color 250ms ease, opacity 250ms ease',
        }}
      />
    </>
  );
}
