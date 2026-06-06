import { useEffect, useRef } from 'react';

interface ConstellationProps {
  dotCount?: number;
  connectionDistance?: number;
  mouseRadius?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Subscriber {
  isNear: (clientX: number, clientY: number) => boolean;
  onMove: (clientX: number, clientY: number) => void;
  onLeave: () => void;
}

const subscribers = new Set<Subscriber>();
let sharedListener: ((e: MouseEvent) => void) | null = null;
let isSharedListenerActive = false;

function ensureSharedListener() {
  if (isSharedListenerActive) return;
  isSharedListenerActive = true;
  sharedListener = (e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    for (const sub of subscribers) {
      if (sub.isNear(x, y)) {
        sub.onMove(x, y);
      } else {
        sub.onLeave();
      }
    }
  };
  window.addEventListener('mousemove', sharedListener, { passive: true });
}

function teardownSharedListener() {
  if (!isSharedListenerActive) return;
  isSharedListenerActive = false;
  if (sharedListener) {
    window.removeEventListener('mousemove', sharedListener);
    sharedListener = null;
  }
}

const Constellation = ({
  dotCount = 60,
  connectionDistance = 150,
  mouseRadius = 150,
  color = 'rgba(201, 162, 52, 0.95)',
  className = 'absolute inset-0 pointer-events-none',
  style,
}: ConstellationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2);

    let animationId = 0;
    let dots: Dot[] = [];
    let isVisible = true;
    let lastFrameTime = 0;
    const frameInterval = isMobile ? 1000 / 24 : 1000 / 30;

    const updateRect = () => {
      rectRef.current = canvas.getBoundingClientRect();
      return rectRef.current;
    };

    const resize = () => {
      const rect = updateRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initDots = () => {
      dots = [];
      const rect = updateRect();
      for (let i = 0; i < dotCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.2 + Math.random() * 0.3;
        dots.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 2 + Math.random() * 2,
        });
      }
    };

    const draw = (now: number) => {
      animationId = requestAnimationFrame(draw);
      if (!isVisible) return;

      const elapsed = now - lastFrameTime;
      if (elapsed < frameInterval) return;
      lastFrameTime = now - (elapsed % frameInterval);

      const rect = rectRef.current;
      const w = rect ? rect.width : canvas.width;
      const h = rect ? rect.height : canvas.height;

      ctx.clearRect(0, 0, w, h);

      for (const dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x <= 0) {
          dot.x = 0;
          dot.vx = Math.abs(dot.vx);
        } else if (dot.x >= w) {
          dot.x = w;
          dot.vx = -Math.abs(dot.vx);
        }
        if (dot.y <= 0) {
          dot.y = 0;
          dot.vy = Math.abs(dot.vy);
        } else if (dot.y >= h) {
          dot.y = h;
          dot.vy = -Math.abs(dot.vy);
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      ctx.lineWidth = 0.6;
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < connectionDistance * connectionDistance) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / connectionDistance) * 0.65;
            ctx.strokeStyle = `rgba(201, 162, 52, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      if (mouseRef.current.active) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        ctx.lineWidth = 0.8;
        for (const dot of dots) {
          const dx = mx - dot.x;
          const dy = my - dot.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < mouseRadius * mouseRadius) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / mouseRadius) * 0.95;
            ctx.strokeStyle = `rgba(201, 162, 52, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(dot.x, dot.y);
            ctx.stroke();
          }
        }
      }
    };

    resize();
    initDots();
    animationId = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      initDots();
    };
    window.addEventListener('resize', onResize);

    const subscriber: Subscriber = {
      isNear: (clientX, clientY) => {
        const rect = rectRef.current;
        if (!rect) return false;
        return (
          clientX >= rect.left - mouseRadius &&
          clientX <= rect.right + mouseRadius &&
          clientY >= rect.top - mouseRadius &&
          clientY <= rect.bottom + mouseRadius
        );
      },
      onMove: (clientX, clientY) => {
        const rect = rectRef.current;
        if (!rect) return;
        mouseRef.current.x = clientX - rect.left;
        mouseRef.current.y = clientY - rect.top;
        mouseRef.current.active = true;
      },
      onLeave: () => {
        mouseRef.current.active = false;
      },
    };

    subscribers.add(subscriber);
    ensureSharedListener();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting;
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        teardownSharedListener();
      }
      observer.disconnect();
    };
  }, [dotCount, connectionDistance, mouseRadius, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`constellation-canvas ${className}`.trim()}
      style={{ width: '100%', height: '100%', ...style }}
    />
  );
};

export default Constellation;
