import { useEffect, useRef, useState } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';

const DHAKA: [number, number] = [90.4125, 23.8103];
const KL: [number, number] = [101.6869, 3.139];

interface Globe3DProps {
  className?: string;
  height?: number;
}

const GOLD = '#C9A234';
const GOLD_BRIGHT = '#FFE3A0';

export default function Globe3D({ className = '', height = 520 }: Globe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 600, height });

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
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 180;
    controls.maxDistance = 600;
    controls.enablePan = false;
  }, [size.width]);

  const points = [
    { lat: DHAKA[1], lng: DHAKA[0], color: GOLD, size: 0.55, label: 'Dhaka' },
    { lat: KL[1], lng: KL[0], color: GOLD_BRIGHT, size: 0.7, label: 'Kuala Lumpur' },
  ];

  const arcs = [
    {
      startLat: DHAKA[1],
      startLng: DHAKA[0],
      endLat: KL[1],
      endLng: KL[0],
      color: ['rgba(255, 227, 160, 0.9)', 'rgba(201, 162, 52, 0.6)'],
    },
  ];

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
        globeImageUrl={`${import.meta.env.BASE_URL}textures/earth-night-2048.jpg`}
        showAtmosphere
        atmosphereColor={GOLD}
        atmosphereAltitude={0.18}
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.01}
        pointRadius="size"
        pointLabel="label"
        arcsData={arcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcStroke={0.6}
        arcAltitudeAutoScale={0.5}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={4000}
      />
    </div>
  );
}
