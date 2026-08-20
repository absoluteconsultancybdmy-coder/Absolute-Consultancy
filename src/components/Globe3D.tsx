import { useEffect, useMemo, useRef, useState } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const DHAKA: [number, number] = [90.4125, 23.8103];
const KL: [number, number] = [101.6869, 3.139];

interface Globe3DProps {
  className?: string;
  height?: number;
}

/**
 * three.js parses colours with THREE.Color, which understands `#hex` and
 * `rgb(r, g, b)` but not `var(--token)` — an unresolved variable falls through
 * to its unknown-colour path and silently renders white. The brand tokens are
 * stored as bare channel triplets for Tailwind's alpha syntax, so read the
 * computed value once and hand three real numbers.
 */
function readToken(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return /^\d/.test(raw) ? `rgb(${raw.split(/\s+/).join(', ')})` : fallback;
}

function rgba(name: string, alpha: number, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return /^\d/.test(raw) ? `rgba(${raw.split(/\s+/).join(', ')}, ${alpha})` : fallback;
}

export default function Globe3D({ className = '', height = 520 }: Globe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 600, height });
  const reducedMotion = usePrefersReducedMotion();

  // Read during render rather than in an effect: the values are needed for the
  // first paint, and an effect would flash the wrong colour for a frame.
  const [theme] = useState(() => ({
    accent: readToken('--color-navy', '#031d4c'),
    accentSoft: rgba('--color-navy', 0.55, 'rgba(3, 29, 76, 0.55)'),
    ink: readToken('--color-kimono', '#0a1b33'),
  }));

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const apply = () => {
      setSize({ width: el.offsetWidth, height });
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener('resize', apply);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
    };
  }, [height]);

  useEffect(() => {
    if (!globeEl.current) return;
    const g = globeEl.current;
    g.pointOfView({ lat: 13, lng: 96, altitude: 2.4 }, 0);
    const controls = g.controls();
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.35;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 180;
    controls.maxDistance = 600;
    controls.enablePan = false;
  }, [size.width, reducedMotion]);

  const points = useMemo(
    () => [
      { lat: DHAKA[1], lng: DHAKA[0], color: theme.accent, size: 0.6, label: 'Dhaka' },
      { lat: KL[1], lng: KL[0], color: theme.ink, size: 0.75, label: 'Kuala Lumpur' },
    ],
    [theme]
  );

  const arcs = useMemo(
    () => [
      {
        startLat: DHAKA[1],
        startLng: DHAKA[0],
        endLat: KL[1],
        endLng: KL[0],
        color: [theme.accentSoft, theme.accent],
      },
    ],
    [theme]
  );

  // A ripple at each endpoint, so the two cities read as places rather than dots.
  const rings = useMemo(
    () => [
      { lat: DHAKA[1], lng: DHAKA[0] },
      { lat: KL[1], lng: KL[0] },
    ],
    []
  );

  const ringColor = useMemo(() => {
    const raw = theme.accentSoft.replace(/rgba?\(([^)]+)\)/, '$1').split(',');
    const [r, g, b] = raw;
    return () => (t: number) => `rgba(${r}, ${g}, ${b}, ${(1 - t).toFixed(2)})`;
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: `${height}px`, position: 'relative' }}
    >
      <Globe
        ref={globeEl}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={`${import.meta.env.BASE_URL}textures/earth-2048.jpg`}
        showAtmosphere
        atmosphereColor={theme.accent}
        atmosphereAltitude={0.16}
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.012}
        pointRadius="size"
        pointLabel="label"
        arcsData={arcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcStroke={0.7}
        arcAltitudeAutoScale={0.5}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={reducedMotion ? 0 : 4000}
        ringsData={rings}
        ringLat="lat"
        ringLng="lng"
        ringColor={ringColor}
        ringMaxRadius={3.5}
        ringPropagationSpeed={1.2}
        ringRepeatPeriod={1400}
      />
    </div>
  );
}
