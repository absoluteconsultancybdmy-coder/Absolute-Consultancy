import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Constellation from '../components/Constellation';
import GooeyBlob from '../components/GooeyBlob';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Pathways', href: '#destinations' },
  { label: 'Stories', href: '#testimonials' },
  { label: 'Resources', href: '/resources' },
  { label: 'Newsletter', href: '#newsletter' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/60175631621',
    icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@absoluteconsultancy',
    icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/18bRc7r8cA/?mibextid=wwXIfr',
    icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
];

const STORAGE_KEY = 'newsletter_subscribers';
const SOURCE = 'footer-signup';
const AUTO_DISMISS_MS = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Subscriber = {
  email: string;
  date: string;
  source: string;
};

type Status =
  | { kind: 'idle' }
  | { kind: 'error'; message: string }
  | { kind: 'duplicate' }
  | { kind: 'success' };

function readSubscribers(): Subscriber[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Subscriber =>
        typeof item === 'object' &&
        item !== null &&
        'email' in item &&
        'date' in item &&
        'source' in item &&
        typeof (item as Subscriber).email === 'string' &&
        typeof (item as Subscriber).date === 'string' &&
        typeof (item as Subscriber).source === 'string',
    );
  } catch {
    return [];
  }
}

function writeSubscribers(subscribers: Subscriber[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
  } catch {
    return;
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const dismissRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (dismissRef.current !== null) {
        window.clearTimeout(dismissRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (status.kind !== 'success') return;
    if (dismissRef.current !== null) {
      window.clearTimeout(dismissRef.current);
    }
    dismissRef.current = window.setTimeout(() => {
      setStatus({ kind: 'idle' });
      dismissRef.current = null;
    }, AUTO_DISMISS_MS);
    return () => {
      if (dismissRef.current !== null) {
        window.clearTimeout(dismissRef.current);
        dismissRef.current = null;
      }
    };
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dismissRef.current !== null) {
      window.clearTimeout(dismissRef.current);
      dismissRef.current = null;
    }
    const normalized = normalizeEmail(email);
    if (!normalized || !EMAIL_PATTERN.test(normalized)) {
      setStatus({ kind: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    const subscribers = readSubscribers();
    const isDuplicate = subscribers.some(
      (sub) => normalizeEmail(sub.email) === normalized,
    );
    if (isDuplicate) {
      setStatus({ kind: 'duplicate' });
      setEmail('');
      return;
    }
    const next: Subscriber = {
      email: normalized,
      date: new Date().toISOString(),
      source: SOURCE,
    };
    writeSubscribers([...subscribers, next]);
    setEmail('');
    setStatus({ kind: 'success' });
  };

  if (status.kind === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 px-5 py-3 rounded-full"
        style={{
          background: 'rgba(212,248,122,0.12)',
          border: '1px solid rgba(212,248,122,0.4)',
          color: '#D4F87A',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
        <span className="font-body text-sm">
          Welcome! We&apos;ll send your first guide within 24 hours.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full sm:w-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
        noValidate
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status.kind === 'error' || status.kind === 'duplicate') {
              setStatus({ kind: 'idle' });
            }
          }}
          aria-invalid={status.kind === 'error' ? 'true' : 'false'}
          aria-describedby={
            status.kind === 'error' || status.kind === 'duplicate'
              ? 'newsletter-status'
              : undefined
          }
          className="px-4 py-3 rounded-full font-body text-sm w-full sm:w-[260px] focus:outline-none"
          style={{
            background: 'rgba(10,10,10,0.6)',
            color: 'var(--color-kimono)',
            border:
              status.kind === 'error'
                ? '1px solid rgba(220,90,90,0.6)'
                : '1px solid rgba(201,162,52,0.35)',
            letterSpacing: '0.02em',
          }}
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-full font-body text-[11px] uppercase tracking-[0.18em] transition-all duration-200 hover:scale-[1.02] focus:outline-none"
          style={{
            backgroundColor: 'var(--color-gold)',
            color: 'var(--color-mist)',
            fontWeight: 600,
          }}
        >
          Subscribe
        </button>
      </form>
      <div
        id="newsletter-status"
        aria-live="polite"
        className="min-h-[18px] font-body"
        style={{ fontSize: 11, lineHeight: 1.4 }}
      >
        {status.kind === 'error' && (
          <span style={{ color: 'rgba(220,140,140,0.95)' }}>{status.message}</span>
        )}
        {status.kind === 'duplicate' && (
          <span style={{ color: 'rgba(212,248,122,0.85)' }}>
            You&apos;re already on our list!
          </span>
        )}
        {status.kind === 'idle' && (
          <span className="text-mouse/55">
            We send 1 email per month. Unsubscribe anytime. We never share your email.
          </span>
        )}
      </div>
    </div>
  );
}

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (href: string): boolean => {
    if (href.startsWith('/')) {
      return location.pathname === href || location.pathname.startsWith(href + '/');
    }
    if (location.pathname !== '/') return false;
    const currentHash = location.hash || '#hero';
    return currentHash === href;
  };

  const scrollTo = (href: string) => {
    if (href.startsWith('/')) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        if (href === '#hero') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return;
    }
    if (href === '#hero') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-mist pt-16 pb-10 overflow-hidden">
      <GooeyBlob blobCount={4} className="absolute inset-0 -z-10 pointer-events-none hidden md:block" />
      <Constellation dotCount={50} connectionDistance={100} className="absolute inset-0 -z-10 pointer-events-none" />
      {/* Top gold hairline */}
      <div className="hairline-draw absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(201,162,52,0.3)' }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left — Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.png" alt="Absolute Consultancy Firm" width={192} height={48} loading="lazy" decoding="async" className="h-12 w-auto" />
            </div>
            <p className="small-caps text-mouse mb-4" style={{ fontSize: '11px', lineHeight: 1.7 }}>
              Malaysia<br />
              Est. 2024 · Registered Education Consultancy
            </p>
            <p className="font-serif font-light text-mouse/60" style={{ fontSize: '13px', lineHeight: 1.6 }}>
              Helping elite students from Malaysia<br />
              and Bangladesh reach the world's<br />
              finest universities since 2024.
            </p>
          </div>

          {/* Center — Nav */}
          <div className="flex flex-col items-start md:items-center">
            <p className="small-caps text-gold/60 mb-6" style={{ fontSize: '10px' }}>Navigate</p>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`nav-link small-caps cursor-pointer bg-transparent text-left transition-colors duration-200 ${
                    isActive(link.href) ? 'text-gold' : 'text-kimono/60 hover:text-kimono'
                  }`}
                  style={{ fontSize: '11px' }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right — Social + contact */}
          <div className="flex flex-col items-start md:items-end">
            <p className="small-caps text-gold/60 mb-6" style={{ fontSize: '10px' }}>Connect</p>
            <div className="flex flex-col gap-3">
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon flex items-center gap-3 group"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={icon} />
                  </svg>
                  <span className="small-caps text-mouse group-hover:text-kimono transition-colors duration-200" style={{ fontSize: '11px' }}>
                    {label}
                  </span>
                </a>
              ))}
              <a
                href="tel:+60175631621"
                className="small-caps text-mouse hover:text-gold transition-colors duration-200 flex items-center gap-3 mt-2"
                style={{ fontSize: '11px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.89 9.37 19.79 19.79 0 01.82 .74 2 2 0 012.81 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l.96-.96a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                +60 17-563 1621
              </a>
            </div>
          </div>
        </div>

        {/* Business Verification */}
        <div
          className="mb-10 p-6 rounded-lg"
          style={{ background: 'rgba(201,162,52,0.06)', border: '1px solid rgba(201,162,52,0.15)' }}
        >
          <p className="font-body uppercase tracking-[0.2em] text-gold/80 mb-4" style={{ fontSize: '10px' }}>
            ✦ Business Verification
          </p>
          <p className="font-display text-cream/80 mb-4" style={{ fontSize: '16px', letterSpacing: '0.02em' }}>
            Official Status Confirmation — Absolute Consultancy Firm
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-4">
            <p className="font-body text-mouse/60" style={{ fontSize: '12px', lineHeight: 1.8 }}>
              <span className="text-mouse/40">Company Name</span><br />
              Absolute Consultancy Firm
            </p>
            <p className="font-body text-mouse/60" style={{ fontSize: '12px', lineHeight: 1.8 }}>
              <span className="text-mouse/40">Registered Trade License</span><br />
              04-046-18947
            </p>
            <p className="font-body text-mouse/60" style={{ fontSize: '12px', lineHeight: 1.8 }}>
              <span className="text-mouse/40">Head Office</span><br />
              Old Kachari Road, Naogaon Sadar, Naogaon-6500
            </p>
            <p className="font-body text-mouse/60" style={{ fontSize: '12px', lineHeight: 1.8 }}>
              <span className="text-mouse/40">Sub Office</span><br />
              Persiaran Multimedia, Cyber 11, 63000 Cyberjaya, Selangor
            </p>
            <p className="font-body text-mouse/60" style={{ fontSize: '12px', lineHeight: 1.8 }}>
              <span className="text-mouse/40">Email</span><br />
              <span className="text-gold/60">contact@absoluteconsultancyfirm.com</span>
            </p>
            <p className="font-body text-mouse/60" style={{ fontSize: '12px', lineHeight: 1.8 }}>
              <span className="text-mouse/40">Phone</span><br />
              <span className="text-gold/60">+60 17-563 1621</span>
            </p>
          </div>
          <p className="font-body text-mouse/60" style={{ fontSize: '12px', lineHeight: 1.8 }}>
            <span className="text-mouse/40">Operating Hours:</span> 24/7
          </p>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(201,162,52,0.1)' }}>
            <p className="font-body text-mouse/50" style={{ fontSize: '11px', lineHeight: 1.7 }}>
              <span className="text-gold/50 font-semibold">Verification Statement</span> — Absolute Consultancy Firm is a legally registered consultancy service permitted to operate student application and support activities for international education.
            </p>
            <p className="font-body text-mouse/40 mt-2" style={{ fontSize: '11px' }}>
              Issued 2025
            </p>
          </div>
        </div>

        {/* Newsletter signup */}
        <div
          id="newsletter"
          className="mb-10 p-6 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 scroll-mt-24"
          style={{ background: 'rgba(11,42,92,0.18)', border: '1px solid rgba(201,162,52,0.25)' }}
        >
          <div className="flex-1 min-w-0">
            <p
              className="font-body uppercase tracking-[0.2em] text-gold/80 mb-2"
              style={{ fontSize: 10 }}
            >
              ✦ Newsletter
            </p>
            <p
              className="font-display text-kimono"
              style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', letterSpacing: '0.02em' }}
            >
              Get monthly guides for studying in Malaysia
            </p>
            <p
              className="font-body text-mouse/70 mt-1"
              style={{ fontSize: 12, lineHeight: 1.6 }}
            >
              University picks, visa tips, and student stories — once a month.
            </p>
          </div>

          <NewsletterSignup />
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-mouse/70 font-body" style={{ fontSize: '11px' }}>
            &copy; {new Date().getFullYear()} Absolute Consultancy Firm. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/privacy')}
              aria-current={location.pathname === '/privacy' ? 'page' : undefined}
              className={`font-body transition-colors duration-200 ${
                location.pathname === '/privacy' ? 'text-gold' : 'text-mouse/70 hover:text-gold'
              }`}
              style={{ fontSize: '11px' }}
            >
              Privacy
            </button>
            <span className="text-mouse/30" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => navigate('/terms')}
              aria-current={location.pathname === '/terms' ? 'page' : undefined}
              className={`font-body transition-colors duration-200 ${
                location.pathname === '/terms' ? 'text-gold' : 'text-mouse/70 hover:text-gold'
              }`}
              style={{ fontSize: '11px' }}
            >
              Terms
            </button>
            <span className="text-mouse/30 hidden sm:inline" aria-hidden="true">·</span>
            <p className="text-mouse/70 font-body italic hidden sm:block" style={{ fontSize: '11px' }}>
              Designed for students who dare to dream further.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
