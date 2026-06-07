import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import { useIsMobile } from '../hooks/use-mobile';

const DHAKA = { lat: 23.8103, lng: 90.4125 };
const KUALA_LUMPUR = { lat: 3.139, lng: 101.6869 };

const GOLD: [number, number, number] = [0.788, 0.635, 0.204];
const CREAM: [number, number, number] = [0.961, 0.91, 0.827];

const DEFAULT_PHI = 2.4;
const DEFAULT_THETA = 0.32;

export default function Globe3D({ className = '', height = 520 }: Globe3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const targetPhiRef = useRef(DEFAULT_PHI);
  const targetThetaRef = useRef(DEFAULT_THETA);
  const currentPhiRef = useRef(DEFAULT_PHI);
  const currentThetaRef = useRef(DEFAULT_THETA);
  const fadeInRef = useRef(0);
  const rotationVelocity = useRef(0.0025);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [cursorState, setCursorState] = useState<'grab' | 'grabbing'>('grab');
  const isMobile = useIsMobile();

  useEffect(() => {
    const updateSize = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    window.addEventListener('resize', updateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || size.width === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: dpr,
      width: size.width * dpr,
      height: size.height * dpr,
      phi: DEFAULT_PHI,
      theta: DEFAULT_THETA,
      dark: 1,
      diffuse: 1.2,
      mapSamples: isMobile ? 8000 : 16000,
      mapBrightness: 5,
      mapBaseBrightness: 0.18,
      baseColor: [0.06, 0.07, 0.12],
      markerColor: GOLD,
      glowColor: GOLD,
      markers: [
        { location: [DHAKA.lat, DHAKA.lng], size: 0.07, color: GOLD },
        { location: [KUALA_LUMPUR.lat, KUALA_LUMPUR.lng], size: 0.07, color: CREAM },
      ],
      arcs: [
        {
          from: [DHAKA.lat, DHAKA.lng],
          to: [KUALA_LUMPUR.lat, KUALA_LUMPUR.lng],
          color: GOLD,
        },
      ],
      arcColor: GOLD,
      arcWidth: 0.6,
      arcHeight: 0.5,
    });

    let raf = 0;
    const renderLoop = () => {
      if (pointerInteracting.current === null && Math.abs(rotationVelocity.current) > 0) {
        targetPhiRef.current += rotationVelocity.current;
      }
      currentPhiRef.current += (targetPhiRef.current - currentPhiRef.current) * 0.08;
      currentThetaRef.current += (targetThetaRef.current - currentThetaRef.current) * 0.08;
      fadeInRef.current = Math.min(1, fadeInRef.current + 0.02);
      if (canvasRef.current) {
        canvasRef.current.style.opacity = String(fadeInRef.current);
      }
      globe.update({
        phi: currentPhiRef.current,
        theta: currentThetaRef.current,
        width: size.width * dpr,
        height: size.height * dpr,
      });
      raf = requestAnimationFrame(renderLoop);
    };
    raf = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
    };
  }, [size.width, size.height, isMobile]);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerInteracting.current = e.clientX;
    pointerInteractionMovement.current = 0;
    rotationVelocity.current = 0;
    setCursorState('grabbing');
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };

  const handlePointerUp = () => {
    pointerInteracting.current = null;
    setCursorState('grab');
    if (Math.abs(pointerInteractionMovement.current) < 2) return;
    rotationVelocity.current = 0.0025 * Math.sign(pointerInteractionMovement.current);
  };

  const handlePointerOut = () => {
    pointerInteracting.current = null;
    setCursorState('grab');
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current;
      pointerInteracting.current = e.clientX;
      pointerInteractionMovement.current += delta;
      const interactionSpeed = isMobile ? 0.008 : 0.005;
      targetPhiRef.current += delta * interactionSpeed;
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.97 : 1.03;
    rotationVelocity.current *= factor;
    if (Math.abs(rotationVelocity.current) < 0.0005) {
      rotationVelocity.current = 0.0025 * Math.sign(rotationVelocity.current || 1);
    }
  };

  const resetView = () => {
    targetPhiRef.current = DEFAULT_PHI;
    targetThetaRef.current = DEFAULT_THETA;
    rotationVelocity.current = 0;
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full mx-auto select-none touch-none ${className}`}
      style={{ height, maxWidth: height * 1.4 }}
    >
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(201,162,52,0.08) 0%, rgba(201,162,52,0) 60%)',
          boxShadow: '0 0 120px 20px rgba(201,162,52,0.06), inset 0 0 60px rgba(201,162,52,0.05)',
        }}
      />

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerOut}
        onPointerMove={handlePointerMove}
        onWheel={handleWheel}
        style={{
          width: '100%',
          height: '100%',
          cursor: cursorState,
          contain: 'layout paint size',
          opacity: 0,
        }}
      />

      <Legend />

      <div
        className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 text-cream/50 font-body uppercase tracking-[0.25em]"
        style={{ fontSize: '9px' }}
      >
        <span className="inline-block w-6 h-px bg-gold/40" />
        <span>Drag to spin</span>
        <span className="inline-block w-6 h-px bg-gold/40" />
      </div>

      <button
        type="button"
        onClick={resetView}
        className="absolute top-3 right-3 px-3 py-1.5 rounded-full font-body uppercase tracking-[0.2em] text-cream/70 hover:text-gold bg-mist/60 hover:bg-mist/80 border border-gold/20 hover:border-gold/50 transition-colors duration-200 backdrop-blur-sm z-10"
        style={{ fontSize: '9px' }}
        aria-label="Reset globe view"
      >
        Reset
      </button>
    </div>
  );
}

function Legend() {
  return (
    <div className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-6 sm:gap-10">
      <div className="flex items-center gap-2">
        <span
          className="inline-block rounded-full"
          style={{
            width: '10px',
            height: '10px',
            background: '#C9A234',
            boxShadow: '0 0 10px rgba(201,162,52,0.8)',
          }}
        />
        <span className="font-body uppercase tracking-[0.3em] text-cream" style={{ fontSize: '10px' }}>
          DHAKA
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="inline-block rounded-full"
          style={{
            width: '10px',
            height: '10px',
            background: '#F5E8D3',
            boxShadow: '0 0 10px rgba(245,232,211,0.8)',
          }}
        />
        <span className="font-body uppercase tracking-[0.3em] text-cream" style={{ fontSize: '10px' }}>
          KUALA LUMPUR
        </span>
      </div>
    </div>
  );
}

interface Globe3DProps {
  className?: string;
  height?: number;
}
