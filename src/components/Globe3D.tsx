import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';

const DHAKA: [number, number] = [90.4125, 23.8103];
const KL: [number, number] = [101.6869, 3.139];

interface Globe3DProps {
  className?: string;
  height?: number;
}

export default function Globe3D({ className = '', height = 520 }: Globe3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [{ phi, theta }, setRotation] = useState({
    phi: Math.PI / 2.4,
    theta: 0,
  });
  const [cursorState, setCursorState] = useState<'grab' | 'grabbing'>('grab');
  const fadeInRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

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
      width: width * 2,
      height: height * 2,
      phi: phi,
      theta: theta,
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
        setRotation((prev) => {
          const newPhi = Math.min(
            Math.PI / 2,
            Math.max(Math.PI / 4, prev.phi + fadeInRef.current * 0.0006 * delta)
          );
          const newTheta = prev.theta + fadeInRef.current * 0.0008 * delta;
          globe.update({ phi: newPhi, theta: newTheta });
          return { phi: newPhi, theta: newTheta };
        });
      } else {
        globe.update({ phi, theta });
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      globe.destroy();
    };
  }, [height, phi, theta]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const id = window.requestAnimationFrame(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = '1';
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointerInteracting.current = e.clientX;
    pointerInteractionMovement.current = 0;
    setCursorState('grabbing');
  };

  const handlePointerUp = () => {
    if (pointerInteracting.current !== null) {
      pointerInteractionMovement.current = 0;
      pointerInteracting.current = null;
      setCursorState('grab');
    }
  };

  const handlePointerOut = () => {
    pointerInteracting.current = null;
    setCursorState('grab');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      pointerInteracting.current = e.clientX;
      setRotation((prev) => ({
        phi: prev.phi,
        theta: prev.theta + delta * 0.005,
      }));
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setRotation((prev) => ({
      phi: Math.min(
        Math.PI / 2,
        Math.max(Math.PI / 4, prev.phi + e.deltaY * 0.003)
      ),
      theta: prev.theta + e.deltaX * 0.003,
    }));
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
