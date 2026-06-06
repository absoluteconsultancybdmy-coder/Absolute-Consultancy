import { useEffect, useRef } from 'react';

export default function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2);

    let animationId = 0;
    let isVisible = true;
    let lastFrameTime = 0;
    const frameInterval = isMobile ? 1000 / 12 : 1000 / 15;
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Small tile for performance — pattern-fill the full canvas from it.
    const tileSize = 256;
    const tileCanvas = document.createElement('canvas');
    tileCanvas.width = tileSize;
    tileCanvas.height = tileSize;
    const tileCtx = tileCanvas.getContext('2d');
    if (!tileCtx) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const generateTile = () => {
      const imageData = tileCtx.createImageData(tileSize, tileSize);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < 0.02) {
          const v = 200 + Math.random() * 55;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = 20;
        } else {
          data[i + 3] = 0;
        }
      }
      tileCtx.putImageData(imageData, 0, 0);
    };

    const drawGrain = () => {
      generateTile();
      const pattern = ctx.createPattern(tileCanvas, 'repeat');
      if (!pattern) return;
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const tick = (now: number) => {
      animationId = requestAnimationFrame(tick);
      if (!isVisible) return;
      const elapsed = now - lastFrameTime;
      if (elapsed < frameInterval) return;
      lastFrameTime = now - (elapsed % frameInterval);
      drawGrain();
    };

    resize();
    if (reducedMotion) {
      drawGrain();
    } else {
      animationId = requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize);
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%', zIndex: 2, opacity: 0.4, mixBlendMode: 'overlay' }}
    />
  );
}
