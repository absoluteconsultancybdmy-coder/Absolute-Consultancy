import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ac_splash_last_shown';
const SPLASH_INTERVAL_MS = 60 * 60 * 1000;
const TOTAL_MS = 7200;

const FONT_STACK = "'Cormorant Garamond', 'Playfair Display', Georgia, serif";

export default function SplashScreen() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('replay') === '1') {
        localStorage.removeItem(STORAGE_KEY);
        return true;
      }
    } catch {
      // ignore
    }
    try {
      const last = localStorage.getItem(STORAGE_KEY);
      if (!last) return true;
      const lastTs = parseInt(last, 10);
      if (!Number.isFinite(lastTs)) return true;
      return Date.now() - lastTs >= SPLASH_INTERVAL_MS;
    } catch {
      return true;
    }
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('replay') !== '1') {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      }
    } catch {
      // ignore
    }
    const fadeTimer = window.setTimeout(() => setFading(true), TOTAL_MS - 600);
    const hideTimer = window.setTimeout(() => setVisible(false), TOTAL_MS);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading Absolute Consultancy"
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0E1F3D 0%, #060812 75%)',
        opacity: fading ? 0 : 1,
        transition: 'opacity 600ms ease',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <div
        className="splash-camera absolute inset-0"
        style={{ transformOrigin: '50% 50%' }}
      >
        <div
          className="splash-bg-shift absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, rgb(var(--color-gold) / 0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(11,42,92,0.20) 0%, transparent 55%)',
          }}
        />

        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            className="splash-halo absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '640px',
              height: '640px',
              background:
                'conic-gradient(from 0deg, rgb(var(--color-gold) / 0) 0%, rgb(var(--color-gold) / 0.22) 22%, rgb(var(--color-gold) / 0) 50%, rgba(11,42,92,0.22) 72%, rgb(var(--color-gold) / 0) 100%)',
              borderRadius: '50%',
              filter: 'blur(48px)',
            }}
          />
        </div>

        <div className="splash-bokeh absolute inset-0 pointer-events-none" aria-hidden>
          {[
            { top: '14%', left: '18%', size: 140, dur: 9000, delay: 0, color: 'rgb(var(--color-gold) / 0.10)' },
            { top: '70%', left: '12%', size: 100, dur: 11000, delay: 1500, color: 'rgba(11,42,92,0.18)' },
            { top: '22%', left: '78%', size: 180, dur: 13000, delay: 800, color: 'rgb(var(--color-gold) / 0.09)' },
            { top: '72%', left: '82%', size: 120, dur: 10000, delay: 2200, color: 'rgba(11,42,92,0.15)' },
            { top: '46%', left: '50%', size: 90, dur: 8000, delay: 600, color: 'rgb(var(--color-gold) / 0.12)' },
          ].map((b, i) => (
            <div
              key={i}
              className="splash-bokeh-blob"
              style={{
                position: 'absolute',
                top: b.top,
                left: b.left,
                width: `${b.size}px`,
                height: `${b.size}px`,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
                filter: 'blur(20px)',
                animation: `bokehDrift ${b.dur}ms ease-in-out ${b.delay}ms infinite alternate`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div
          className="splash-lightleak absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              'linear-gradient(115deg, transparent 30%, rgba(245,226,168,0.10) 48%, rgb(var(--color-gold) / 0.18) 50%, rgba(245,226,168,0.10) 52%, transparent 70%)',
            mixBlendMode: 'screen',
            filter: 'blur(8px)',
          }}
        />

        <div
          className="splash-grid absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage:
              'linear-gradient(rgb(var(--color-gold) / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-gold) / 0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)',
          }}
        />

        <div
          className="splash-dust absolute inset-0 pointer-events-none"
          aria-hidden
        >
          {Array.from({ length: 18 }).map((_, i) => {
            const left = (i * 37) % 100;
            const top = (i * 53) % 100;
            const dur = 6000 + (i % 5) * 900;
            const delay = (i * 200) % 4000;
            return (
              <span
                key={i}
                className="splash-dust-mote"
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: `${top}%`,
                  width: i % 4 === 0 ? '3px' : '2px',
                  height: i % 4 === 0 ? '3px' : '2px',
                  borderRadius: '50%',
                  background: 'rgba(245,226,168,0.6)',
                  boxShadow: '0 0 6px rgb(var(--color-gold) / 0.5)',
                  animation: `dustFloat ${dur}ms ease-in-out ${delay}ms infinite alternate`,
                }}
              />
            );
          })}
        </div>

        <div
          className="absolute"
          aria-hidden
          style={{ inset: '0', pointerEvents: 'none' }}
        >
          <svg
            className="bracket-tl"
            width="80"
            height="80"
            viewBox="0 0 80 80"
            style={{ position: 'absolute', top: 'calc(50% - 180px)', left: 'calc(50% - 360px)' }}
          >
            <defs>
              <linearGradient id="splashGoldTL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5E2A8" />
                <stop offset="50%" stopColor="rgb(var(--color-gold))" />
                <stop offset="100%" stopColor="#8C6E1C" />
              </linearGradient>
            </defs>
            <path
              d="M 10 50 L 10 10 L 50 10"
              stroke="url(#splashGoldTL)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="bracket-tr"
            width="80"
            height="80"
            viewBox="0 0 80 80"
            style={{ position: 'absolute', top: 'calc(50% - 180px)', right: 'calc(50% - 360px)' }}
          >
            <defs>
              <linearGradient id="splashGoldTR" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5E2A8" />
                <stop offset="50%" stopColor="rgb(var(--color-gold))" />
                <stop offset="100%" stopColor="#8C6E1C" />
              </linearGradient>
            </defs>
            <path
              d="M 30 10 L 70 10 L 70 50"
              stroke="url(#splashGoldTR)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="bracket-bl"
            width="80"
            height="80"
            viewBox="0 0 80 80"
            style={{ position: 'absolute', bottom: 'calc(50% - 180px)', left: 'calc(50% - 360px)' }}
          >
            <defs>
              <linearGradient id="splashGoldBL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5E2A8" />
                <stop offset="50%" stopColor="rgb(var(--color-gold))" />
                <stop offset="100%" stopColor="#8C6E1C" />
              </linearGradient>
            </defs>
            <path
              d="M 10 30 L 10 70 L 50 70"
              stroke="url(#splashGoldBL)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="bracket-br"
            width="80"
            height="80"
            viewBox="0 0 80 80"
            style={{ position: 'absolute', bottom: 'calc(50% - 180px)', right: 'calc(50% - 360px)' }}
          >
            <defs>
              <linearGradient id="splashGoldBR" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5E2A8" />
                <stop offset="50%" stopColor="rgb(var(--color-gold))" />
                <stop offset="100%" stopColor="#8C6E1C" />
              </linearGradient>
            </defs>
            <path
              d="M 30 70 L 70 70 L 70 30"
              stroke="url(#splashGoldBR)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <div
            className="splash-name-wrap relative"
            style={{
              display: 'inline-block',
              paddingBottom: '24px',
              ['--progress' as string]: 0,
            } as React.CSSProperties}
          >
            <h1
              className="splash-name-text"
              aria-label="Absolute Consultancy Firm"
              style={{
                fontFamily: FONT_STACK,
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(34px, 6.4vw, 78px)',
                lineHeight: 1,
                letterSpacing: '0.01em',
                margin: 0,
                padding: '0 4px',
                background: 'linear-gradient(180deg, #F5E2A8 0%, rgb(var(--color-gold)) 50%, #8C6E1C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                filter: 'drop-shadow(0 0 28px rgb(var(--color-gold) / 0.35))',
                clipPath: 'inset(0 calc((1 - var(--progress)) * 100%) 0 0)',
                WebkitClipPath: 'inset(0 calc((1 - var(--progress)) * 100%) 0 0)',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              Absolute Consultancy Firm
            </h1>

            <div
              className="splash-ink-trail"
              aria-hidden
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                width: 'var(--pen-x, 0%)',
                height: '8px',
                transform: 'translateY(-50%)',
                background: 'linear-gradient(90deg, transparent 0%, rgb(var(--color-gold) / 0.45) 60%, rgb(var(--color-gold) / 0.7) 100%)',
                filter: 'blur(2px)',
                borderRadius: '4px',
                pointerEvents: 'none',
                opacity: 0,
                transition: 'opacity 200ms ease',
              }}
            />

            <svg
              className="splash-underline-svg"
              width="100%"
              height="14"
              viewBox="0 0 500 14"
              preserveAspectRatio="none"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: '0',
                overflow: 'visible',
                pointerEvents: 'none',
              }}
              aria-hidden
            >
              <defs>
                <linearGradient id="splashLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(var(--color-gold))" stopOpacity="0" />
                  <stop offset="20%" stopColor="rgb(var(--color-gold))" stopOpacity="1" />
                  <stop offset="80%" stopColor="rgb(var(--color-gold))" stopOpacity="1" />
                  <stop offset="100%" stopColor="rgb(var(--color-gold))" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 2 6 Q 125 2, 250 7 T 498 5"
                stroke="url(#splashLine)"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                className="splash-underline-path"
              />
            </svg>

            <div
              className="splash-pen"
              aria-hidden
              style={{
                position: 'absolute',
                top: '50%',
                left: 'var(--pen-x, 0%)',
                pointerEvents: 'none',
                zIndex: 3,
                opacity: 0,
                willChange: 'transform, left, opacity',
              }}
            >
              <div className="splash-pen-inner">
                <svg
                  width="160"
                  height="80"
                  viewBox="-80 -40 160 80"
                  style={{ display: 'block', overflow: 'visible', transform: 'translateX(-22px)' }}
                >
                  <defs>
                    <linearGradient id="penBody" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#000000" />
                      <stop offset="50%" stopColor="#1a1208" />
                      <stop offset="100%" stopColor="#000000" />
                    </linearGradient>
                    <linearGradient id="penNib" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFF6D8" />
                      <stop offset="50%" stopColor="#FFD86B" />
                      <stop offset="100%" stopColor="#8C6E1C" />
                    </linearGradient>
                    <linearGradient id="penCap" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#1a1208" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>
                    <linearGradient id="penGrip" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3a2410" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>
                    <filter id="penGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2.4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <g
                    style={{
                      transformOrigin: '0 0',
                      transform: 'rotate(26deg) translate(-8px, -3px)',
                      filter: 'url(#penGlow)',
                    }}
                  >
                    <rect x="10" y="-5" width="46" height="10" rx="1.5" fill="url(#penCap)" />
                    <rect x="11" y="-11" width="2.2" height="22" rx="0.6" fill="rgb(var(--color-gold))" opacity="0.9" />
                    <rect x="14" y="-11" width="1.2" height="22" rx="0.4" fill="#8C6E1C" opacity="0.7" />
                    <rect x="17" y="-11" width="0.8" height="22" rx="0.3" fill="#F5E2A8" opacity="0.5" />

                    <rect x="-3" y="-4" width="14" height="8" rx="1" fill="url(#penGrip)" />

                    <rect x="-25" y="-3" width="22" height="6" rx="0.8" fill="url(#penBody)" />
                    <rect x="-48" y="-2.4" width="23" height="4.8" rx="0.6" fill="url(#penBody)" />
                    <rect x="-65" y="-1.8" width="17" height="3.6" rx="0.4" fill="url(#penBody)" />

                    <circle cx="6" cy="0" r="1.4" fill="rgb(var(--color-gold))" opacity="0.8" />
                    <circle cx="-30" cy="0" r="0.6" fill="#8C6E1C" opacity="0.7" />
                  </g>

                  <g
                    style={{
                      transformOrigin: '0 0',
                    }}
                  >
                    <path
                      d="M 0 -6 L -22 0 L 0 6 Z"
                      fill="url(#penNib)"
                      stroke="#8C6E1C"
                      strokeWidth="0.6"
                    />
                    <line x1="-10" y1="0" x2="-22" y2="0" stroke="#021635" strokeWidth="0.9" />
                    <circle cx="-22" cy="0" r="1.4" fill="#021635" />

                    <circle
                      cx="-22"
                      cy="0"
                      r="7"
                      fill="rgb(var(--color-gold) / 0.32)"
                      className="splash-pen-nib-glow"
                    />
                    <circle
                      cx="-22"
                      cy="0"
                      r="3.5"
                      fill="rgba(255,230,150,0.7)"
                      className="splash-pen-nib-flash"
                    />
                    <circle
                      cx="-22"
                      cy="0"
                      r="1.2"
                      fill="rgb(var(--color-gold))"
                      className="splash-pen-nib-core"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div className="relative text-center px-6 mt-4">
            <p
              className="splash-tagline font-body uppercase text-cream/60"
              style={{ fontSize: 'clamp(9px, 1.1vw, 11px)', letterSpacing: '0.35em' }}
            >
              ✦ Your Journey To Malaysia ✦
            </p>
            <p
              className="splash-tagline-late font-body uppercase text-cream/60 mt-1.5"
              style={{ fontSize: 'clamp(8px, 0.9vw, 10px)', letterSpacing: '0.3em' }}
            >
              Dhaka · Kuala Lumpur · Est. 2024
            </p>
          </div>
        </div>

        <div
          className="splash-vignette absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)',
          }}
        />

        <div
          className="splash-grain absolute inset-0 pointer-events-none mix-blend-overlay"
          aria-hidden
          style={{
            opacity: 0.06,
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: '200px 200px',
          }}
        />

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-56">
          <div
            className="overflow-hidden"
            style={{
              width: '100%',
              height: '1px',
              background: 'rgb(var(--color-gold) / 0.15)',
            }}
          >
            <div className="splash-progress" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes splashSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .splash-halo {
          animation: splashSpin 8s linear infinite;
        }

        @keyframes bokehDrift {
          0%   { transform: translate(-50%, -50%) translate(0, 0) scale(1); }
          50%  { transform: translate(-50%, -50%) translate(20px, -16px) scale(1.08); }
          100% { transform: translate(-50%, -50%) translate(-12px, 18px) scale(0.95); }
        }

        @keyframes dustFloat {
          0%   { transform: translate(0, 0); opacity: 0.2; }
          50%  { transform: translate(6px, -10px); opacity: 0.9; }
          100% { transform: translate(-4px, -18px); opacity: 0.3; }
        }

        @keyframes lightLeakSweep {
          0%   { transform: translateX(-110%); opacity: 0; }
          20%  { opacity: 0.9; }
          80%  { opacity: 0.9; }
          100% { transform: translateX(110%); opacity: 0; }
        }
        .splash-lightleak {
          animation: lightLeakSweep 3000ms cubic-bezier(0.4, 0, 0.6, 1) 600ms forwards;
        }

        @keyframes cameraZoom {
          0%   { transform: scale(1) rotate(0deg); }
          100% { transform: scale(1.04) rotate(0.25deg); }
        }
        .splash-camera {
          animation: cameraZoom 7000ms ease-out forwards;
        }

        @keyframes cameraShake {
          0%, 100% { translate: 0 0; }
          20%      { translate: 0.6px -0.4px; }
          40%      { translate: -0.5px 0.5px; }
          60%      { translate: 0.4px 0.6px; }
          80%      { translate: -0.6px -0.3px; }
        }

        .bracket-tl path, .bracket-tr path, .bracket-bl path, .bracket-br path {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawIn 600ms ease-out forwards;
        }
        .bracket-tl path { animation-delay: 0ms; }
        .bracket-tr path { animation-delay: 120ms; }
        .bracket-bl path { animation-delay: 240ms; }
        .bracket-br path { animation-delay: 360ms; }

        @keyframes drawIn {
          to { stroke-dashoffset: 0; }
        }

        .splash-name-wrap {
          animation: progressWrite 3000ms cubic-bezier(0.65, 0.05, 0.35, 1) 700ms forwards;
        }
        @keyframes progressWrite {
          from { --progress: 0; }
          to   { --progress: 1; }
        }

        @property --progress {
          syntax: '<number>';
          initial-value: 0;
          inherits: true;
        }

        .splash-ink-trail {
          animation: inkTrailFade 250ms ease-out 700ms forwards;
        }
        @keyframes inkTrailFade {
          0%   { opacity: 0; }
          100% { opacity: 0.85; }
        }

        .splash-pen {
          left: var(--pen-x, 0%);
          top: 50%;
          animation: penAppear 250ms ease-out 700ms forwards,
                     penFollowWrite 3000ms cubic-bezier(0.65, 0.05, 0.35, 1) 700ms forwards,
                     penExit 700ms cubic-bezier(0.5, 0, 0.75, 0) 5400ms forwards;
        }
        @keyframes penAppear {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes penFollowWrite {
          0%   { --pen-x: 0%; }
          100% { --pen-x: 100%; }
        }
        @property --pen-x {
          syntax: '<length-percentage>';
          initial-value: 0%;
          inherits: true;
        }
        @keyframes penExit {
          0%   { left: var(--pen-x, 0%); top: 50%; opacity: 1; }
          100% { left: calc(var(--pen-x, 0%) + 80px); top: calc(50% - 90px); opacity: 0; }
        }

        .splash-pen-inner {
          position: relative;
          transform: translateY(-2px);
          animation: penJitter 180ms ease-in-out 700ms infinite;
          will-change: transform;
        }
        @keyframes penJitter {
          0%, 100% { translate: 0 0; }
          25%      { translate: 0 -1.4px; }
          50%      { translate: 0 1px; }
          75%      { translate: 0 -0.6px; }
        }

        .splash-pen-nib-glow {
          transform-origin: -14px 0;
          animation: nibPulse 1.2s ease-in-out 700ms infinite;
        }
        @keyframes nibPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50%      { transform: scale(1.7); opacity: 0.7; }
        }

        .splash-pen-nib-flash {
          transform-origin: -14px 0;
          animation: nibFlash 0.8s ease-out 700ms infinite;
        }
        @keyframes nibFlash {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          50%      { opacity: 0.9; transform: scale(1.2); }
        }

        .splash-underline-path {
          stroke-dasharray: 520;
          stroke-dashoffset: 520;
          animation: underlineDraw 800ms ease-out 3800ms forwards;
        }
        @keyframes underlineDraw {
          to { stroke-dashoffset: 0; }
        }

        .splash-tagline {
          opacity: 0;
          transform: translateY(8px);
          animation: lineIn 500ms ease-out 4400ms forwards;
        }
        .splash-tagline-late {
          opacity: 0;
          animation: lineIn 500ms ease-out 4700ms forwards;
        }
        @keyframes lineIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .splash-progress {
          width: 0%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgb(var(--color-gold)), transparent);
          animation: splashProgressAnim 6500ms ease-out 600ms forwards;
        }
        @keyframes splashProgressAnim {
          to { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .splash-camera, .splash-halo, .splash-lightleak, .splash-bokeh-blob, .splash-dust-mote {
            animation: none !important;
          }
          .bracket-tl path, .bracket-tr path, .bracket-bl path, .bracket-br path {
            stroke-dashoffset: 0 !important;
            animation: none !important;
          }
          .splash-name-wrap { animation: none !important; }
          .splash-name-text { clip-path: none !important; -webkit-clip-path: none !important; }
          .splash-pen, .splash-pen-inner, .splash-pen-nib-glow, .splash-pen-nib-flash, .splash-ink-trail {
            animation: none !important;
          }
          .splash-pen { opacity: 0 !important; left: 100% !important; }
          .splash-ink-trail { opacity: 0.6 !important; }
          .splash-underline-path { stroke-dashoffset: 0 !important; animation: none !important; }
          .splash-tagline, .splash-tagline-late { opacity: 1 !important; transform: none !important; animation: none !important; }
          .splash-progress { width: 100% !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}
