import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';

const DHAKA: [number, number] = [90.4125, 23.8103];
const KL: [number, number] = [101.6869, 3.139];

interface Globe3DProps {
  className?: string;
  height?: number;
}

const SPIN_SPEED = 0.0035;

export default function Globe3D({ className = '', height = 520 }: Globe3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const phiRef = useRef(Math.PI / 2.4);
  const thetaRef = useRef(0);
  const fadeInRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const [cursorState, setCursorState] = useState<'grab' | 'grabbing'>('grab');

  useEffect(() => {
    let width = 0;
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: Math.max(width * 2, 600),
      height: height * 2,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 4,
      baseColor: [0.12, 0.12, 0.15],
      markerColor: [0.79, 0.64, 0.2],
      glowColor: [0.08, 0.08, 0.1],
      markers: [
        { location: DHAKA, size: 0.08 },
        { location: KL, size: 0.08 },
      ],
      arcs: [
        {
          from: DHAKA,
          to: KL,
          color: [0.79, 0.64, 0.2],
        },
      ],
      arcColor: [0.79, 0.64, 0.2],
      arcWidth: 0.4,
      arcHeight: 0.6,
    });

    let raf = 0;
    const animate = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (fadeInRef.current < 1) {
        fadeInRef.current = Math.min(1, fadeInRef.current + delta / 800);
      }

      if (pointerInteracting.current === null) {
        thetaRef.current -= fadeInRef.current * SPIN_SPEED * (delta / 16);
      }

      globe.update({ phi: phiRef.current, theta: thetaRef.current });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      globe.destroy();
    };
  }, [height]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const id = window.requestAnimationFrame(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = '1';
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointerInteracting.current = e.clientX;
    setCursorState('grabbing');
  };

  const handlePointerUp = () => {
    pointerInteracting.current = null;
    setCursorState('grab');
  };

  const handlePointerOut = () => {
    pointerInteracting.current = null;
    setCursorState('grab');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current;
      pointerInteracting.current = e.clientX;
      thetaRef.current += delta * 0.005;
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    phiRef.current = Math.min(
      Math.PI / 2,
      Math.max(Math.PI / 4, phiRef.current + e.deltaY * 0.003)
    );
    thetaRef.current += e.deltaX * 0.003;
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerOut}
      onPointerMove={handlePointerMove}
      onWheel={handleWheel}
      style={{
        width: '100%',
        height: `${height}px`,
        maxWidth: '100%',
        cursor: cursorState,
        contain: 'layout paint size',
        opacity: 0,
        transition: 'opacity 800ms ease',
      }}
      className={className}
    />
  );
}
