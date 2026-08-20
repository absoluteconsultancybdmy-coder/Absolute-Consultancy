import { memo, useEffect, useState } from 'react';

interface GooeyBlobProps {
  blobCount?: number;
  colors?: string[];
  className?: string;
  filterId?: string;
}

function GooeyBlob({
  blobCount = 4,
  colors = [
    'rgb(var(--color-gold) / 0.3)',
    'rgb(var(--color-gold) / 0.4)',
    'rgb(var(--color-gold) / 0.2)',
    'rgb(var(--color-gold) / 0.35)',
  ],
  className = 'absolute inset-0 w-full h-full pointer-events-none',
  filterId = 'gooey-footer',
}: GooeyBlobProps) {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const [blobs, setBlobs] = useState<Array<{
    cx: number;
    cy: number;
    r: number;
    color: string;
    durX: number;
    durY: number;
    durR: number;
    delayX: number;
    delayY: number;
    targetX: number;
    targetY: number;
  }>>([]);

  useEffect(() => {
    const id = setTimeout(() => {
      setBlobs(
        Array.from({ length: blobCount }).map((_, i) => {
          const cx = 100 + Math.random() * 600;
          const cy = 100 + Math.random() * 200;
          const r = 40 + Math.random() * 40;
          return {
            cx,
            cy,
            r,
            color: colors[i % colors.length],
            durX: 8 + Math.random() * 4,
            durY: 10 + Math.random() * 4,
            durR: 6 + Math.random() * 4,
            delayX: Math.random() * 3,
            delayY: Math.random() * 3,
            targetX: cx + (100 - Math.random() * 200),
            targetY: cy + (80 - Math.random() * 160),
          };
        })
      );
    }, 0);
    return () => clearTimeout(id);
  }, [blobCount, colors]);

  return (
    <svg
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        {blobs.map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.color}>
            {!reducedMotion && (
              <>
                <animate
                  attributeName="cx"
                  values={`${b.cx};${b.targetX};${b.cx}`}
                  dur={`${b.durX}s`}
                  begin={`${b.delayX}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${b.cy};${b.targetY};${b.cy}`}
                  dur={`${b.durY}s`}
                  begin={`${b.delayY}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values={`${b.r};${b.r * 1.2};${b.r * 0.7};${b.r}`}
                  dur={`${b.durR}s`}
                  repeatCount="indefinite"
                />
              </>
            )}
          </circle>
        ))}
      </g>
    </svg>
  );
}

export default memo(GooeyBlob);
