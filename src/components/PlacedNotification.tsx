import { memo, useEffect, useRef, useState } from 'react';

type Placed = {
  name: string;
  from: string;
  university: string;
  program: string;
};

const notifications: Placed[] = [
  { name: 'Nusrat Jahan', from: 'Dhaka', university: 'Multimedia University (MMU)', program: 'BSc Computer Science' },
  { name: 'Tanvir Hossain', from: 'Chittagong', university: 'Asia Pacific University', program: 'BEng Civil Engineering' },
  { name: 'Arisha Rahman', from: 'Dhaka', university: 'UCSI University', program: 'BBA Business' },
  { name: 'Farhan Azmi', from: 'Sylhet', university: 'Sunway University', program: 'BSc Software Engineering' },
  { name: 'Priya Subramaniam', from: 'Khulna', university: "Taylor's University", program: 'BSc Hospitality' },
  { name: 'Reuben Lim', from: 'Rajshahi', university: 'HELP University', program: 'LLB Law' },
  { name: 'Mehedi Hasan', from: 'Comilla', university: 'SEGi University', program: 'BSc Accounting' },
  { name: 'Sumaiya Akter', from: 'Barisal', university: 'INTO University', program: 'BSc Business IT' },
];

const INITIAL_DELAY = 5000;
const VISIBLE_DURATION = 6000;
const POPUP_INTERVAL_MS = 15 * 60 * 1000;
const MAX_POPUPS_PER_DAY = 2;
const RESET_WINDOW_MS = 24 * 60 * 60 * 1000;

const LS_LAST_POPUP = 'lastPopupTime';
const LS_POPUP_COUNT = 'popupCount';
const LS_COUNT_RESET_AT = 'popupCountResetAt';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function readNumber(key: string): number {
  if (typeof window === 'undefined') return 0;
  const raw = window.localStorage.getItem(key);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

function writeNumber(key: string, value: number): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // ignore quota / privacy errors
  }
}

function PlacedNotification() {
  const [current, setCurrent] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const indexRef = useRef(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  const scheduleTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  };

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (typeof window === 'undefined') return;

    const now = Date.now();

    const resetAt = readNumber(LS_COUNT_RESET_AT);
    if (!resetAt || now - resetAt >= RESET_WINDOW_MS) {
      writeNumber(LS_POPUP_COUNT, 0);
      writeNumber(LS_COUNT_RESET_AT, now);
      writeNumber(LS_LAST_POPUP, 0);
    }

    const popupCount = readNumber(LS_POPUP_COUNT);
    if (popupCount >= MAX_POPUPS_PER_DAY) {
      return;
    }

    const lastPopupTime = readNumber(LS_LAST_POPUP);
    if (lastPopupTime && now - lastPopupTime < POPUP_INTERVAL_MS) {
      return;
    }

    scheduleTimeout(() => {
      setCurrent(indexRef.current);
      setVisible(true);
      writeNumber(LS_LAST_POPUP, Date.now());
      writeNumber(LS_POPUP_COUNT, readNumber(LS_POPUP_COUNT) + 1);
    }, INITIAL_DELAY);

    return clearTimers;
  }, []);

  useEffect(() => {
    if (!visible || current === null) return;

    const dismissTimeout = scheduleTimeout(() => {
      setVisible(false);
    }, VISIBLE_DURATION);

    return () => clearTimeout(dismissTimeout);
  }, [visible, current]);

  useEffect(() => {
    if (visible) return;
    if (current === null) return;

    if (typeof window === 'undefined') return;

    const popupCount = readNumber(LS_POPUP_COUNT);
    if (popupCount >= MAX_POPUPS_PER_DAY) {
      return;
    }

    const nextTimeout = scheduleTimeout(() => {
      const lastPopupTime = readNumber(LS_LAST_POPUP);
      const now = Date.now();
      if (lastPopupTime && now - lastPopupTime < POPUP_INTERVAL_MS) {
        return;
      }
      indexRef.current = (indexRef.current + 1) % notifications.length;
      setCurrent(indexRef.current);
      setVisible(true);
      writeNumber(LS_LAST_POPUP, Date.now());
      writeNumber(LS_POPUP_COUNT, readNumber(LS_POPUP_COUNT) + 1);
    }, POPUP_INTERVAL_MS);

    return () => clearTimeout(nextTimeout);
  }, [visible, current]);

  if (current === null) return null;
  const n = notifications[current];

  return (
    <div
      className="fixed left-4 right-4 sm:right-auto sm:max-w-sm z-30"
      style={{
        bottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'opacity 500ms var(--ease-standard), transform 500ms var(--ease-standard)',
      }}
      role="status"
      aria-live="polite"
    >
      <div
        className="glass-card p-5 flex items-start gap-3 cursor-pointer"
        style={{ borderLeft: '4px solid var(--color-gold)' }}
        onClick={() => setVisible(false)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 mt-0.5"
          aria-hidden="true"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
        <div className="min-w-0 flex-1">
          <p className="text-kimono text-[15px] leading-snug">
            <span className="text-gold font-medium">{n.name}</span> from {n.from}
            <br />
            just got placed at <span className="text-gold font-medium">{n.university}</span>
          </p>
          <p className="text-mouse/70 text-xs mt-1">🎓 {n.program}</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
          }}
          aria-label="Dismiss notification"
          className="text-mouse/60 hover:text-kimono transition-colors shrink-0 -mt-1 -mr-1 p-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default memo(PlacedNotification);
