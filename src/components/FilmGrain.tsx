import { memo, useState } from 'react';

interface Grain {
  noiseUrl: string | null;
  animate: boolean;
}

// Generated once during the first render rather than in an effect: the tile is
// a one-shot value, so an effect would only cost an extra render pass.
function buildGrain(): Grain {
  if (typeof window === 'undefined') return { noiseUrl: null, animate: false };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  const tileSize = isMobile ? 64 : 96;
  const density = isMobile ? 0.04 : 0.025;

  const tileCanvas = document.createElement('canvas');
  tileCanvas.width = tileSize;
  tileCanvas.height = tileSize;
  const tileCtx = tileCanvas.getContext('2d');
  if (!tileCtx) return { noiseUrl: null, animate: false };

  const imageData = tileCtx.createImageData(tileSize, tileSize);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < density) {
      const v = 200 + Math.random() * 55;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 28;
    } else {
      data[i + 3] = 0;
    }
  }
  tileCtx.putImageData(imageData, 0, 0);

  return { noiseUrl: tileCanvas.toDataURL('image/png'), animate: !reduceMotion };
}

function FilmGrain() {
  const [{ noiseUrl, animate }] = useState(buildGrain);

  return (
    <div
      className="film-grain-overlay fixed inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        zIndex: 2,
        opacity: 0.4,
        mixBlendMode: 'overlay',
        backgroundImage: noiseUrl ? `url(${noiseUrl})` : undefined,
        backgroundSize: '192px 192px',
        backgroundRepeat: 'repeat',
        animationName: animate ? 'grainShift' : undefined,
        animationDuration: animate ? '0.4s' : undefined,
        animationTimingFunction: animate ? 'steps(6)' : undefined,
        animationIterationCount: animate ? 'infinite' : undefined,
        willChange: animate ? 'background-position' : undefined,
      }}
    />
  );
}

export default memo(FilmGrain);
