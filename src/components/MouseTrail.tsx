import { useEffect, useRef } from 'react';

interface PhotoData {
  initials: string;
  color: string;
  image?: string;
}

const PHOTO_DATA: PhotoData[] = [
  { initials: 'AR', color: '#1A3A6B' },
  { initials: 'TH', color: '#1B5E20' },
  { initials: 'PS', color: '#7B0000' },
  { initials: 'FA', color: '#1A3A6B' },
  { initials: 'NJ', color: '#1B5E20' },
  { initials: 'RL', color: '#7B0000' },
  { initials: 'MH', color: '#1A3A6B' },
];

const LERP_VALUES = [0.5, 0.35, 0.2, 0.15, 0.1, 0.07, 0.05];
const Y_OFFSETS = [-100, -65, -30, 0, 30, 65, 100];
const PHOTO_SIZE = 56;
const IDLE_TIMEOUT_MS = 1200;

export default function MouseTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const positionsRef = useRef<{ x: number; y: number; targetX: number; targetY: number; opacity: number }[]>(
    PHOTO_DATA.map(() => ({ x: 0, y: 0, targetX: 0, targetY: 0, opacity: 0 }))
  );
  const lastMoveRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.innerWidth < 768) return;

    const container = containerRef.current;
    if (!container) return;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < -50 || x > rect.width + 50 || y < -50 || y > rect.height + 50) {
        if (isActiveRef.current) {
          isActiveRef.current = false;
        }
        return;
      }
      positionsRef.current.forEach((p) => {
        p.targetX = x;
        p.targetY = y;
      });
      lastMoveRef.current = performance.now();
      if (!isActiveRef.current) {
        isActiveRef.current = true;
      }
    };

    let rafId = 0;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!isVisibleRef.current) return;

      const idle = performance.now() - lastMoveRef.current > IDLE_TIMEOUT_MS;
      const targetOpacity = isActiveRef.current && !idle ? 1 : 0;

      for (let i = 0; i < positionsRef.current.length; i++) {
        const p = positionsRef.current[i];
        const lerp = LERP_VALUES[i] ?? 0.1;
        p.x += (p.targetX - p.x) * lerp;
        p.y += (p.targetY - p.y) * lerp;
        p.opacity += (targetOpacity - p.opacity) * 0.08;
        const el = photoRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${p.x - PHOTO_SIZE / 2}px, ${p.y - PHOTO_SIZE / 2 + (Y_OFFSETS[i] ?? 0)}px, 0)`;
          el.style.opacity = String(p.opacity);
        }
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisibleRef.current = entry.isIntersecting;
        }
      },
      { threshold: 0 }
    );
    observer.observe(container);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden hidden md:block"
      aria-hidden="true"
    >
      {PHOTO_DATA.map((photo, i) => (
        <div
          key={i}
          ref={(el) => {
            photoRefs.current[i] = el;
          }}
          className="absolute rounded-full flex items-center justify-center font-bold"
          style={{
            width: `${PHOTO_SIZE}px`,
            height: `${PHOTO_SIZE}px`,
            top: 0,
            left: 0,
            backgroundColor: photo.color,
            border: '1px solid rgb(var(--color-gold) / 0.4)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            color: 'rgb(var(--color-cream))',
            fontSize: '15px',
            fontFamily: 'Lato, sans-serif',
            letterSpacing: '0.05em',
            opacity: 0,
            willChange: 'transform, opacity',
            transform: 'translate3d(-100px, -100px, 0)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {photo.initials}
        </div>
      ))}
    </div>
  );
}
