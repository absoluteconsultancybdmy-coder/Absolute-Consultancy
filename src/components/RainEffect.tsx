import { useEffect, useRef } from 'react';

/**
 * RainEffect — A gentle rainfall overlay inspired by snowfall aesthetics.
 * Renders for exactly 4–5 seconds then fades out and unmounts itself.
 * Usage: Drop <RainEffect /> anywhere inside your Hero section JSX.
 */
export default function RainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match parent container size
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Rain drop config ──────────────────────────────────────────
    const NUM_DROPS = 180;
    const DURATION_MS = 4500; // 4.5 seconds total

    interface Drop {
      x: number;
      y: number;
      len: number;       // streak length
      speed: number;     // px per frame
      opacity: number;
      width: number;
    }

    const drops: Drop[] = Array.from({ length: NUM_DROPS }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 1.5 - canvas.height * 0.5,
      len: 12 + Math.random() * 20,
      speed: 6 + Math.random() * 8,
      opacity: 0.12 + Math.random() * 0.35,
      width: 0.5 + Math.random() * 0.8,
    }));

    const startTime = performance.now();
    let animId: number;

    const draw = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION_MS, 1);

      // Global fade envelope: fade in for first 0.1, hold until 0.75, fade out
      let globalAlpha = 1;
      if (progress < 0.1) globalAlpha = progress / 0.1;
      else if (progress > 0.75) globalAlpha = 1 - (progress - 0.75) / 0.25;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drops.forEach((d) => {
        // Move drop down
        d.y += d.speed;
        // Reset when off screen
        if (d.y - d.len > canvas.height) {
          d.y = -d.len;
          d.x = Math.random() * canvas.width;
        }

        // Draw streak
        const grad = ctx.createLinearGradient(d.x, d.y - d.len, d.x, d.y);
        grad.addColorStop(0, `rgba(174, 214, 241, 0)`);           // transparent top
        grad.addColorStop(0.6, `rgba(200, 230, 255, ${d.opacity * globalAlpha})`);
        grad.addColorStop(1, `rgba(230, 245, 255, ${(d.opacity * 0.7) * globalAlpha})`);

        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.len);
        ctx.lineTo(d.x, d.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = d.width;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Tiny splash dot at the tip
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.width * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 240, 255, ${d.opacity * 0.5 * globalAlpha})`;
        ctx.fill();
      });

      if (progress < 1) {
        animId = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Fade out the whole canvas element so React can clean up
        if (canvas) canvas.style.opacity = '0';
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
        transition: 'opacity 0.6s ease',
      }}
    />
  );
}
