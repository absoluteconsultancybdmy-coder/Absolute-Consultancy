import { useState } from 'react';

interface Pin {
  cx: number;
  cy: number;
  label: string;
  count: number;
}

const PINS: Pin[] = [
  { cx: 122, cy: 78, label: 'Kuala Lumpur', count: 8 },
  { cx: 119, cy: 79, label: 'Shah Alam', count: 2 },
  { cx: 121, cy: 79, label: 'Subang Jaya', count: 3 },
  { cx: 123, cy: 81, label: 'Cyberjaya', count: 2 },
  { cx: 126, cy: 83, label: 'Nilai', count: 2 },
  { cx: 124, cy: 76, label: 'Gombak', count: 1 },
  { cx: 128, cy: 85, label: 'Seremban', count: 1 },
  { cx: 175, cy: 110, label: 'Johor', count: 2 },
  { cx: 110, cy: 60, label: 'Penang', count: 1 },
  { cx: 100, cy: 68, label: 'Ipoh', count: 1 },
  { cx: 142, cy: 70, label: 'Kuantan', count: 1 },
  { cx: 260, cy: 152, label: 'Kuching (Sarawak)', count: 1 },
  { cx: 339, cy: 102, label: 'Kota Kinabalu (Sabah)', count: 1 },
];

interface MalaysiaMapProps {
  selectedPin?: string | null;
  onPinSelect?: (label: string | null) => void;
}

export default function MalaysiaMap({ selectedPin, onPinSelect }: MalaysiaMapProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const interactive = Boolean(onPinSelect);

  return (
    <div
      className="relative w-full"
      style={{ maxWidth: '420px' }}
    >
      <svg
        viewBox="0 0 400 220"
        width="100%"
        height="auto"
        style={{ display: 'block' }}
        aria-label="Map of Malaysia with partner university locations"
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(var(--color-gold) / 0.18)" />
            <stop offset="100%" stopColor="rgb(var(--color-gold) / 0)" />
          </radialGradient>
          <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <style>{`
            @keyframes mapPinPulse {
              0%, 100% { opacity: 0.25; transform: scale(1); }
              50% { opacity: 0.55; transform: scale(1.25); }
            }
            .map-pin-active-aura {
              transform-origin: center;
              transform-box: fill-box;
              animation: mapPinPulse 1.6s ease-in-out infinite;
            }
          `}</style>
        </defs>

        <rect width="400" height="220" fill="url(#mapGlow)" />

        {/* Peninsular Malaysia (simplified outline) */}
        <path
          d="M 78 22
             C 86 18, 98 22, 104 30
             C 110 38, 106 50, 100 56
             C 96 62, 98 72, 104 78
             C 110 84, 116 86, 122 88
             C 128 92, 134 96, 140 102
             C 148 108, 158 112, 168 112
             C 174 113, 178 116, 174 120
             C 170 122, 162 118, 154 114
             C 146 110, 140 104, 134 98
             C 128 92, 122 88, 116 84
             C 110 80, 104 74, 98 68
             C 92 62, 88 54, 86 46
             C 84 38, 80 30, 78 22 Z"
          fill="rgba(11,42,92,0.45)"
          stroke="rgb(var(--color-gold) / 0.55)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Borneo (Sarawak + Sabah) */}
        <path
          d="M 246 144
             C 254 138, 266 138, 276 142
             C 286 146, 296 146, 306 144
             C 318 142, 328 138, 338 132
             C 348 126, 358 118, 366 112
             C 372 108, 376 110, 372 116
             C 368 122, 360 130, 350 136
             C 340 142, 328 148, 318 152
             C 306 156, 294 158, 282 156
             C 270 154, 258 150, 250 148
             C 244 147, 242 146, 246 144 Z"
          fill="rgba(11,42,92,0.45)"
          stroke="rgb(var(--color-gold) / 0.55)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Connector line between peninsular and borneo (sea) */}
        <path
          d="M 170 105 C 200 110, 220 115, 248 130"
          fill="none"
          stroke="rgb(var(--color-gold) / 0.18)"
          strokeWidth="0.8"
          strokeDasharray="2,3"
        />

        {/* Pins */}
        {PINS.map((pin, i) => {
          const isHovered = hovered === i;
          const isSelected = selectedPin === pin.label;
          return (
            <g
              key={pin.label}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : undefined}
              aria-label={interactive ? `Filter by ${pin.label}` : undefined}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                if (!onPinSelect) return;
                onPinSelect(isSelected ? null : pin.label);
              }}
              onKeyDown={e => {
                if (!onPinSelect) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onPinSelect(isSelected ? null : pin.label);
                }
              }}
              style={{ cursor: interactive ? 'pointer' : 'default', outline: 'none' }}
            >
              {isSelected && (
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r="11"
                  fill="rgb(var(--color-gold) / 0.4)"
                  className="map-pin-active-aura"
                />
              )}
              <circle
                cx={pin.cx}
                cy={pin.cy}
                r={isSelected ? 11 : isHovered ? 9 : 6}
                fill={isSelected ? 'rgb(var(--color-gold) / 0.45)' : 'rgb(var(--color-gold) / 0.18)'}
                style={{ transition: 'r 200ms ease, fill 200ms ease' }}
              />
              <circle
                cx={pin.cx}
                cy={pin.cy}
                r={isSelected ? 5.5 : isHovered ? 4.5 : 3.2}
                fill={isSelected ? '#FFE3A0' : 'rgb(var(--color-gold))'}
                stroke="rgb(var(--color-gold) / 0.5)"
                strokeWidth="0.5"
                filter="url(#pinGlow)"
                style={{ transition: 'r 200ms ease, fill 200ms ease' }}
              />

              {(isHovered || isSelected) && (
                <g style={{ pointerEvents: 'none' }}>
                  <rect
                    x={pin.cx + 8}
                    y={pin.cy - 12}
                    width={Math.max(pin.label.length * 6.2 + (isSelected ? 32 : 16), 80)}
                    height="22"
                    rx="4"
                    fill={isSelected ? 'rgb(var(--color-gold) / 0.95)' : 'rgba(2, 22, 53,0.92)'}
                    stroke="rgb(var(--color-gold) / 0.5)"
                    strokeWidth="0.6"
                  />
                  <text
                    x={pin.cx + 16}
                    y={pin.cy + 2}
                    fill={isSelected ? '#021635' : 'rgb(var(--color-cream))'}
                    style={{ fontSize: '9px', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em', fontWeight: isSelected ? 700 : 400 }}
                  >
                    {pin.label} · {pin.count}{isSelected ? ' ✓' : ''}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Labels for major regions */}
        <text
          x="125"
          y="125"
          fill="rgb(var(--color-gold) / 0.45)"
          style={{ fontSize: '7px', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.25em', textTransform: 'uppercase' }}
        >
          PENINSULAR
        </text>
        <text
          x="290"
          y="168"
          fill="rgb(var(--color-gold) / 0.45)"
          style={{ fontSize: '7px', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.25em', textTransform: 'uppercase' }}
        >
          BORNEO
        </text>
      </svg>

      <div className="mt-2 flex items-center justify-between font-body text-cream/60" style={{ fontSize: '10px', letterSpacing: '0.15em' }}>
        <span className="flex items-center gap-2">
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'rgb(var(--color-gold))', boxShadow: '0 0 6px rgb(var(--color-gold) / 0.6)' }} />
          {selectedPin ? `FILTER: ${selectedPin.toUpperCase()}` : `${PINS.reduce((sum, p) => sum + p.count, 0)} PARTNER LOCATIONS`}
        </span>
        <span className="uppercase">{interactive ? 'TAP A PIN' : '13 CITIES'}</span>
      </div>
    </div>
  );
}
