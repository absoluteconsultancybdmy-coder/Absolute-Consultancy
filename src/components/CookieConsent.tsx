import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const STORAGE_KEY = 'cookie-consent';
const SHOW_DELAY_MS = 1500;

type ConsentValue = 'accepted' | 'declined';

function readConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'accepted' || raw === 'declined') return raw;
    return null;
  } catch {
    return null;
  }
}

function writeConsent(value: ConsentValue) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    return;
  }
}

function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (readConsent() !== null) return;
    const id = window.setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    }, SHOW_DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  const handleChoice = (value: ConsentValue) => {
    writeConsent(value);
    setVisible(false);
    window.setTimeout(() => setMounted(false), 300);
  };

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed left-1/2 z-50 px-4"
      style={{
        bottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
        transform: visible
          ? 'translate(-50%, 0)'
          : reducedMotion
            ? 'translate(-50%, 0)'
            : 'translate(-50%, calc(100% + 32px))',
        opacity: visible ? 1 : 0,
        transition: reducedMotion
          ? 'opacity 200ms ease'
          : 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease',
        width: 'min(600px, calc(100vw - 32px))',
      }}
    >
      <div
        className="relative rounded-2xl p-5 sm:p-6"
        style={{
          background: 'rgba(2, 22, 53, 0.92)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          aria-hidden="true"
          className="absolute -top-px left-6 right-6 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.7) 50%, transparent 100%)',
          }}
        />

        <div className="flex items-start gap-3 mb-4">
          <span
            aria-hidden="true"
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-gold)' }}>
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
              <path d="M8.5 8.5h.01" />
              <path d="M16 15.5h.01" />
              <path d="M11.5 12h.01" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p
              className="font-body uppercase tracking-[0.28em] text-gold/80 mb-1.5"
              style={{ fontSize: '10px' }}
            >
              Cookies
            </p>
            <p
              className="font-serif font-light text-cream/85"
              style={{ fontSize: '15px', lineHeight: 1.55 }}
            >
              We use cookies to improve your experience. By continuing, you agree to our use of cookies.{' '}
              <Link
                to="/privacy"
                className="text-gold underline underline-offset-4 decoration-gold/40 hover:decoration-gold transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => handleChoice('declined')}
            className="pill-button order-2 sm:order-1"
            style={{
              fontSize: '11px',
              padding: '10px 22px',
              backgroundColor: 'transparent',
              color: 'var(--color-cream)',
              border: '1px solid rgba(245, 232, 211, 0.25)',
            }}
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => handleChoice('accepted')}
            className="pill-button pill-button-primary order-1 sm:order-2"
            style={{ fontSize: '11px', padding: '10px 22px' }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(CookieConsent);
