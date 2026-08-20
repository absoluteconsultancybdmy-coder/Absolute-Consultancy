import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface Suggestion {
  label: string;
  href: string;
  keywords: string[];
}

const SUGGESTIONS: Suggestion[] = [
  { label: 'Home', href: '/', keywords: ['home', 'main', 'landing', 'hero', 'absolute'] },
  { label: 'All Universities', href: '/explore', keywords: ['universities', 'explore', 'campus', 'apu', 'inti', 'taylor', 'mmu', 'monash', 'sunway', 'help'] },
  { label: 'Resources', href: '/resources', keywords: ['resources', 'guides', 'visa', 'emgs', 'scholarship', 'life', 'culture', 'finance', 'guide', 'article'] },
  { label: 'Team', href: '/team', keywords: ['team', 'people', 'staff', 'coo', 'counsellor', 'about', 'who'] },
  { label: 'Contact', href: '/#contact', keywords: ['contact', 'reach', 'whatsapp', 'email', 'phone', 'call', 'message'] },
];

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    document.title = 'Page Not Found | Absolute Consultancy Firm';
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SUGGESTIONS;
    return SUGGESTIONS.filter((s) =>
      s.label.toLowerCase().includes(q) ||
      s.keywords.some((k) => k.includes(q))
    );
  }, [query]);

  const handleSuggestion = (href: string) => {
    if (href.startsWith('/#')) {
      const hash = href.slice(1);
      navigate('/');
      window.setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    navigate(href);
  };

  return (
    <main
      id="main-content"
      className="relative min-h-screen flex items-center justify-center bg-mist overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 255, 255,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute"
          style={{
            top: '20%',
            left: '15%',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255,0.4)',
            boxShadow: '0 0 12px rgba(255, 255, 255,0.6)',
            animation: reducedMotion ? undefined : 'nf-twinkle 4s ease-in-out infinite',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute"
          style={{
            top: '70%',
            right: '20%',
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: 'rgba(245,232,211,0.5)',
            animation: reducedMotion ? undefined : 'nf-twinkle 5s ease-in-out infinite 1s',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute"
          style={{
            top: '35%',
            right: '12%',
            width: 2,
            height: 2,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255,0.6)',
            animation: reducedMotion ? undefined : 'nf-twinkle 6s ease-in-out infinite 0.5s',
          }}
          aria-hidden="true"
        />
      </div>

      <style>{`
        @keyframes nf-compass-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes nf-compass-wobble {
          0%, 100% { transform: rotate(-12deg); }
          50%      { transform: rotate(12deg); }
        }
        @keyframes nf-needle-shake {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(-30deg); }
          50%      { transform: rotate(20deg); }
          75%      { transform: rotate(-10deg); }
        }
        @keyframes nf-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50%      { opacity: 1; transform: scale(1.2); }
        }
        @keyframes nf-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
      `}</style>

      <div className="relative z-10 text-center px-6 w-full max-w-[640px] py-16">
        <div
          className="relative mx-auto mb-6"
          style={{
            width: 120,
            height: 120,
            animation: reducedMotion ? undefined : 'nf-float 5s ease-in-out infinite',
          }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '1.5px solid rgba(255, 255, 255,0.5)',
              boxShadow: '0 0 30px rgba(255, 255, 255,0.15), inset 0 0 20px rgba(255, 255, 255,0.08)',
              animation: reducedMotion ? undefined : 'nf-compass-spin 28s linear infinite',
            }}
          >
            <span className="absolute left-1/2 top-1 -translate-x-1/2 text-gold" style={{ fontSize: '10px' }}>N</span>
            <span className="absolute left-1/2 bottom-1 -translate-x-1/2 text-cream/60" style={{ fontSize: '10px' }}>S</span>
            <span className="absolute top-1/2 left-1 -translate-y-1/2 text-cream/60" style={{ fontSize: '10px' }}>W</span>
            <span className="absolute top-1/2 right-1 -translate-y-1/2 text-cream/60" style={{ fontSize: '10px' }}>E</span>
          </div>

          <div
            className="absolute inset-3 rounded-full"
            style={{
              border: '1px dashed rgba(255, 255, 255,0.3)',
              animation: reducedMotion ? undefined : 'nf-compass-wobble 4s ease-in-out infinite',
            }}
          />

          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: 4,
              height: 50,
              marginLeft: -2,
              marginTop: -25,
              transformOrigin: 'center center',
              animation: reducedMotion ? undefined : 'nf-needle-shake 3.5s ease-in-out infinite',
            }}
          >
            <div
              className="w-full"
              style={{ height: '50%', background: 'var(--color-gold)', borderRadius: '2px 2px 0 0' }}
            />
            <div
              className="w-full"
              style={{ height: '50%', background: 'rgba(245,232,211,0.35)', borderRadius: '0 0 2px 2px' }}
            />
          </div>

          <div
            className="absolute left-1/2 top-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full"
            style={{ background: 'var(--color-gold)', boxShadow: '0 0 10px rgba(255, 255, 255,0.7)' }}
          />
        </div>

        <p
          className="font-body uppercase tracking-[0.4em] text-gold/70 mb-4"
          style={{ fontSize: '11px' }}
        >
          404 — Lost On The Journey
        </p>
        <h1
          className="font-display font-bold text-kimono leading-[0.95] mb-6"
          style={{ fontSize: 'clamp(64px, 14vw, 160px)', letterSpacing: '0.02em' }}
        >
          <span style={{ WebkitTextStroke: '1.5px rgba(255, 255, 255,0.55)', color: 'transparent' }}>404</span>
        </h1>
        <p
          className="font-serif font-light text-cream/70 mb-10 mx-auto"
          style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', lineHeight: 1.7, maxWidth: 520 }}
        >
          The page you're looking for has wandered off the path. Let's get you back on the road to your future.
        </p>

        <div
          className="mb-10 rounded-2xl p-5 sm:p-6 text-left"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255, 255, 255,0.2)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <label
            htmlFor="nf-search"
            className="block font-body uppercase tracking-[0.28em] text-gold/70 mb-3"
            style={{ fontSize: '10px' }}
          >
            Search the site
          </label>
          <div className="relative">
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              id="nf-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try 'visa', 'universities', 'contact'…"
              className="w-full pl-10 pr-4 py-3 rounded-full font-body text-sm"
              style={{
                background: 'rgba(2, 22, 53,0.6)',
                color: 'var(--color-kimono)',
                border: '1px solid rgba(255, 255, 255,0.35)',
                letterSpacing: '0.02em',
              }}
            />
          </div>

          <p
            className="mt-4 mb-3 font-body uppercase tracking-[0.24em] text-cream/60"
            style={{ fontSize: '10px' }}
          >
            Maybe you were looking for
          </p>
          <div className="flex flex-wrap gap-2">
            {matches.length === 0 ? (
              <p
                className="font-serif font-light text-cream/60"
                style={{ fontSize: '13px' }}
              >
                No matches. Try 'home', 'team', or 'contact'.
              </p>
            ) : (
              matches.map((s) => (
                <button
                  key={s.href}
                  type="button"
                  onClick={() => handleSuggestion(s.href)}
                  className="px-4 py-2 rounded-full font-body text-[11px] uppercase tracking-[0.16em] transition-colors duration-200"
                  style={{
                    background: 'rgba(255, 255, 255,0.08)',
                    border: '1px solid rgba(255, 255, 255,0.35)',
                    color: 'var(--color-cream)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255,0.18)';
                    e.currentTarget.style.color = 'var(--color-gold)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255,0.08)';
                    e.currentTarget.style.color = 'var(--color-cream)';
                  }}
                >
                  {s.label}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="pill-button pill-button-primary"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="pill-button pill-button-outline"
          >
            Explore Universities
          </button>
        </div>
      </div>
    </main>
  );
}
