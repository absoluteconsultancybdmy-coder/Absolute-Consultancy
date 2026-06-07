import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { FULL_GUIDES, type Guide } from '../data/guides';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const HERO_DOTS = Array.from({ length: 30 }, (_, i) => ({
  width: Math.random() * 4 + 2,
  height: Math.random() * 4 + 2,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  background: i % 3 === 0 ? '#C9A234' : i % 3 === 1 ? '#D4AF37' : '#FFD700',
}));

const GUIDES = FULL_GUIDES.map(g => ({
  category: g.category,
  title: g.title,
  description: g.description,
  readingTime: g.readingTime,
  icon: g.icon,
}));

const PDF_URL = '/guides/bangladesh-malaysia-guide.pdf';
const PDF_FILENAME = 'bangladesh-malaysia-guide.pdf';

const TOP_NAV = [
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Pathways', id: 'destinations' },
  { label: 'Stories', id: 'testimonials' },
  { label: 'Contact', id: 'contact' },
];

function GuideModal({ guide, onClose }: { guide: Guide; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    if (panelRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power2.out' }
      );
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 24, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' }
      );
    }

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, textarea, select'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previouslyFocusedRef.current?.focus?.();
    };
  }, [onClose]);

  const handleClose = () => {
    if (!panelRef.current || !overlayRef.current) {
      onClose();
      return;
    }
    gsap.to(panelRef.current, {
      opacity: 0,
      y: 12,
      scale: 0.98,
      duration: 0.2,
      ease: 'power2.in',
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: onClose,
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={handleClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-modal-title"
        className="relative w-full max-w-[820px] max-h-[85vh] overflow-y-auto rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, #0B1E42 0%, #0B2A5C 100%)',
          border: '1px solid rgba(201,162,52,0.3)',
          WebkitOverflowScrolling: 'touch',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          onClick={handleClose}
          aria-label="Close guide"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-cream/70 hover:text-cream transition-colors cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          ✕
        </button>

        <div className="p-6 md:p-8 lg:p-10">
          <p
            className="font-body uppercase text-gold/80 mb-3"
            style={{ fontSize: '10px', letterSpacing: '0.3em' }}
          >
            {guide.category}
          </p>
          <h2
            id="guide-modal-title"
            className="font-display font-bold text-kimono pr-12"
            style={{
              fontSize: 'clamp(20px, 3vw, 30px)',
              letterSpacing: '0.02em',
              lineHeight: 1.2,
            }}
          >
            {guide.title}
          </h2>
          <div className="flex items-center gap-3 mt-4 pb-6" style={{ borderBottom: '1px solid rgba(201,162,52,0.18)' }}>
            <span className="font-body text-mouse flex items-center gap-1.5" style={{ fontSize: '11px' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              {guide.readingTime}
            </span>
            <span className="font-body text-gold/70" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
              {guide.sections.length} sections
            </span>
          </div>

          <div className="mt-6 space-y-6">
            {guide.sections.map((s, i) => (
              <section key={s.heading}>
                <h3
                  className="font-display font-semibold text-gold uppercase flex items-center gap-2 mb-2"
                  style={{ fontSize: '13px', letterSpacing: '0.12em' }}
                >
                  <span
                    className="inline-flex items-center justify-center rounded-full font-bold"
                    style={{
                      width: 22,
                      height: 22,
                      background: 'rgba(201,162,52,0.15)',
                      color: '#C9A234',
                      fontSize: 10,
                      letterSpacing: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.heading}
                </h3>
                <p
                  className="font-serif font-light text-cream/80"
                  style={{ fontSize: '15px', lineHeight: 1.75 }}
                >
                  {s.body}
                </p>
              </section>
            ))}
          </div>

          <div
            className="mt-8 pt-6 flex flex-wrap items-center justify-between gap-3"
            style={{ borderTop: '1px solid rgba(201,162,52,0.18)' }}
          >
            <p className="font-body text-cream/50" style={{ fontSize: '11px' }}>
              Need help applying this guide to your own journey?
            </p>
            <a
              href={`https://wa.me/60175631621?text=Hi, I'd like to talk about the guide: ${encodeURIComponent(guide.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-[11px] uppercase tracking-widest transition-all duration-300 hover:scale-[1.03]"
              style={{ background: '#25D366', color: '#fff', fontWeight: 700, letterSpacing: '0.12em' }}
            >
              Talk to a counsellor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [headerCount, setHeaderCount] = useState(0);
  const [openGuide, setOpenGuide] = useState<Guide | null>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo('.hero-dot',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.015, ease: 'back.out(2)' }
      );
      gsap.fromTo('.hero-eyebrow',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.15 }
      );
      gsap.fromTo('.hero-heading',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.25 }
      );
      gsap.fromTo('.hero-sub',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.4 }
      );
    }
    if (gridRef.current) {
      gsap.fromTo('.featured-guide',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.55 }
      );
      gsap.fromTo('.guide-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', delay: 0.75 }
      );
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeaderCount(9);
      return;
    }
    setHeaderCount(0);
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: 9,
      duration: 1.2,
      ease: 'power2.out',
      delay: 0.2,
      onUpdate: () => setHeaderCount(Math.round(obj.val)),
    });
    return () => { tween.kill(); };
  }, [prefersReducedMotion]);

  const handleDownloadPdf = () => {
    const a = document.createElement('a');
    a.href = PDF_URL;
    a.download = PDF_FILENAME;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <style>{`@media (prefers-reduced-motion: reduce) { .hero-dot { animation: none !important; } }`}</style>

      <div style={{ minHeight: '100vh', background: '#0B1A33' }}>
        <div className="sticky top-0 z-50" style={{ background: 'rgba(11,26,51,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(201,162,52,0.15)' }}>
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 overflow-x-auto flex-nowrap scrollbar-none flex-shrink-0 max-w-full">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 text-gold/70 hover:text-gold transition-colors cursor-pointer font-body text-xs uppercase tracking-wider px-2 py-1.5 rounded-lg hover:bg-white/5 flex-shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Back
              </button>
              <div className="w-px h-4 mx-1 flex-shrink-0" style={{ background: 'rgba(201,162,52,0.2)' }} />
              {TOP_NAV.map(({ label, id }) => (
                <button
                  key={label}
                  onClick={() => {
                    sessionStorage.setItem('scrollToSection', id);
                    navigate('/');
                  }}
                  className="text-cream/40 hover:text-gold transition-colors cursor-pointer font-body text-xs uppercase tracking-wider px-2 py-1.5 rounded-lg hover:bg-white/5 whitespace-nowrap flex-shrink-0"
                >
                  {label}
                </button>
              ))}
              <span
                className="text-gold font-body text-xs uppercase tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0"
                style={{ background: 'rgba(201,162,52,0.12)', border: '1px solid rgba(201,162,52,0.4)' }}
              >
                ✦ Resources
              </span>
            </div>

            <div className="flex-1" />

            <span className="font-body text-xs text-cream/40 whitespace-nowrap flex-shrink-0">
              {headerCount} guides
            </span>
          </div>
        </div>

        <div
          ref={heroRef}
          className="relative overflow-hidden"
          style={{
            minHeight: '30vh',
            background: 'linear-gradient(135deg, #0A0A0A 0%, #0B1E42 50%, #0A0A0A 100%)',
            borderBottom: '1px solid rgba(201,162,52,0.15)',
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            {HERO_DOTS.map((dot, i) => (
              <div
                key={dot.width + dot.height + dot.left + dot.top + i}
                className="hero-dot absolute rounded-full"
                style={{
                  width: dot.width,
                  height: dot.height,
                  left: dot.left,
                  top: dot.top,
                  background: dot.background,
                  boxShadow: '0 0 8px rgba(201,162,52,0.5)',
                  opacity: 0,
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(201,162,52,0.08) 0%, transparent 60%)' }} />

          <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-20 flex flex-col items-center text-center">
            <p
              className="hero-eyebrow font-body uppercase text-gold mb-5"
              style={{ fontSize: '11px', letterSpacing: '0.4em', opacity: 0 }}
            >
              ✦ Resources Hub
            </p>
            <h1
              className="hero-heading font-display font-bold text-kimono uppercase"
              style={{
                fontSize: 'clamp(28px, 5vw, 52px)',
                letterSpacing: '0.04em',
                lineHeight: 1.1,
                maxWidth: '900px',
                opacity: 0,
              }}
            >
              Your complete guide to<br />
              <span style={{
                background: 'linear-gradient(135deg, #C9A234 0%, #FFD700 50%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 24px rgba(201,162,52,0.3))',
              }}>
                studying in Malaysia
              </span>
            </h1>
            <p
              className="hero-sub font-serif font-light text-cream/55 mt-6"
              style={{ fontSize: 'clamp(14px, 1.4vw, 17px)', lineHeight: 1.7, maxWidth: '640px', opacity: 0 }}
            >
              Practical guides, checklists, and resources to help you navigate every step of your journey from Bangladesh to Malaysia.
            </p>
            <div className="mt-8 flex items-center justify-center gap-2 hero-sub" style={{ opacity: 0 }}>
              <div className="w-12 h-px" style={{ background: 'rgba(201,162,52,0.4)' }} />
              <div className="w-2 h-2 rounded-full" style={{ background: '#C9A234' }} />
              <div className="w-12 h-px" style={{ background: 'rgba(201,162,52,0.4)' }} />
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-14 pb-6">
          <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
            <div>
              <div className="w-12 h-px mb-4" style={{ background: 'rgba(201,162,52,0.5)' }} />
              <h2 className="font-display font-bold text-kimono uppercase" style={{ fontSize: 'clamp(20px, 3vw, 28px)', letterSpacing: '0.05em' }}>
                Featured Resource
              </h2>
            </div>
          </div>

          <div
            className="featured-guide relative overflow-hidden rounded-3xl p-6 md:p-8 lg:p-10 grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 items-center"
            style={{
              background: 'linear-gradient(135deg, rgba(201,162,52,0.08) 0%, rgba(11,30,66,0.4) 100%)',
              border: '1.5px solid rgba(201,162,52,0.45)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,162,52,0.15)',
              opacity: 0,
            }}
          >
            <div className="absolute top-5 left-5">
              <span
                className="px-3 py-1 rounded-full text-[10px] font-body uppercase"
                style={{ background: '#C9A234', color: '#0B1A33', fontWeight: 700, letterSpacing: '0.18em' }}
              >
                ★ Most Popular
              </span>
            </div>

            <div className="md:pr-6">
              <p className="font-body uppercase text-gold/80 mb-3" style={{ fontSize: '10px', letterSpacing: '0.3em' }}>
                FREE PDF GUIDE
              </p>
              <h3
                className="font-display font-bold text-kimono"
                style={{ fontSize: 'clamp(22px, 3.2vw, 34px)', letterSpacing: '0.02em', lineHeight: 1.15 }}
              >
                The Complete 2026 Guide:<br />
                <span style={{ color: '#C9A234' }}>Bangladesh → Malaysia</span>
              </h3>
              <p className="font-serif font-light text-cream/65 mt-5" style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', lineHeight: 1.7, maxWidth: '520px' }}>
                A 24-page PDF covering university selection, EMGS visa process, scholarships, accommodation, and life in Malaysia.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-body text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 hover:scale-[1.03]"
                  style={{ background: '#C9A234', color: '#0B1A33', fontWeight: 700, letterSpacing: '0.16em', boxShadow: '0 8px 24px rgba(201,162,52,0.35)' }}
                >
                  Download Free PDF
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 4v12M6 12l6 6 6-6M5 20h14"/></svg>
                </button>
                <span className="font-body text-mouse/70" style={{ fontSize: '11px' }}>
                  No sign-up required
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: '5,200+', label: 'Downloads' },
                { value: '24', label: 'Pages' },
                { value: 'Jan 2026', label: 'Updated' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-2xl"
                  style={{ background: 'rgba(11,26,51,0.55)', border: '1px solid rgba(201,162,52,0.2)' }}
                >
                  <p className="font-display font-bold text-gold" style={{ fontSize: 'clamp(15px, 1.8vw, 20px)', letterSpacing: '0.04em' }}>
                    {stat.value}
                  </p>
                  <p className="font-body text-cream/50 uppercase tracking-wider mt-1" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={gridRef} className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-6 pb-16">
          <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
            <div>
              <div className="w-12 h-px mb-4" style={{ background: 'rgba(201,162,52,0.5)' }} />
              <h2 className="font-display font-bold text-kimono uppercase" style={{ fontSize: 'clamp(20px, 3vw, 28px)', letterSpacing: '0.05em' }}>
                All Guides
              </h2>
              <p className="font-serif font-light text-cream/50 mt-2" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                Bite-sized reading for every stage of your journey.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GUIDES.map((guide, idx) => (
              <div
                key={guide.title}
                className="guide-card rounded-2xl p-5 cursor-pointer group relative flex flex-col"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                  transition: 'transform 180ms ease-out, border-color 300ms ease, background 300ms ease, box-shadow 300ms ease',
                  minHeight: '260px',
                  opacity: 0,
                }}
                onMouseMove={e => {
                  if (prefersReducedMotion) return;
                  const el = e.currentTarget;
                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const rotateY = ((x / rect.width) - 0.5) * 8;
                  const rotateX = ((y / rect.height) - 0.5) * -8;
                  el.style.transition = 'transform 80ms ease-out, border-color 200ms ease, background 200ms ease, box-shadow 250ms ease';
                  el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                  el.style.borderColor = 'rgba(201,162,52,0.55)';
                  el.style.background = 'rgba(255,255,255,0.06)';
                  el.style.boxShadow = `0 25px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(201,162,52,0.35), inset 0 1px 0 rgba(201,162,52,0.15)`;
                  const dot = el.querySelector('.tilt-dot') as HTMLElement | null;
                  if (dot) {
                    dot.style.left = `${x}px`;
                    dot.style.top = `${y}px`;
                    dot.style.opacity = '1';
                  }
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.transition = 'transform 500ms ease, border-color 400ms ease, background 400ms ease, box-shadow 400ms ease';
                  el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
                  el.style.borderColor = 'rgba(255,255,255,0.07)';
                  el.style.background = 'rgba(255,255,255,0.03)';
                  el.style.boxShadow = 'none';
                  const dot = el.querySelector('.tilt-dot') as HTMLElement | null;
                  if (dot) dot.style.opacity = '0';
                }}
                onClick={() => setOpenGuide(FULL_GUIDES[idx] ?? null)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenGuide(FULL_GUIDES[idx] ?? null);
                  }
                }}
                aria-label={`Read full guide: ${guide.title}`}
              >
                <span
                  className="tilt-dot absolute w-2.5 h-2.5 rounded-full pointer-events-none"
                  style={{
                    background: '#C9A234',
                    boxShadow: '0 0 14px rgba(201,162,52,0.9), 0 0 4px rgba(255,215,0,0.6)',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0,
                    transition: 'opacity 250ms ease',
                    zIndex: 5,
                  }}
                  aria-hidden="true"
                />

                <div className="flex items-start justify-between gap-3 mb-4">
                  <span
                    className="px-2.5 py-1 rounded-full text-[9px] font-body uppercase"
                    style={{
                      background: 'rgba(201,162,52,0.12)',
                      color: '#C9A234',
                      border: '1px solid rgba(201,162,52,0.3)',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                    }}
                  >
                    {guide.category}
                  </span>
                  <span style={{ color: 'rgba(201,162,52,0.6)' }} className="flex-shrink-0">
                    {guide.icon}
                  </span>
                </div>

                <h3
                  className="font-display font-bold text-kimono leading-snug mb-3"
                  style={{ fontSize: 'clamp(15px, 1.4vw, 17px)', letterSpacing: '0.02em' }}
                >
                  {guide.title}
                </h3>

                <p
                  className="font-serif font-light text-cream/60 mb-5"
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {guide.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="font-body text-mouse/60 flex items-center gap-1.5" style={{ fontSize: '11px' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                    {guide.readingTime}
                  </span>
                  <span className="font-body text-gold/70 group-hover:text-gold transition-colors flex items-center gap-1" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    Read more
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pb-20">
          <div
            className="rounded-3xl p-8 md:p-10 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(11,30,66,0.5) 0%, rgba(11,42,92,0.3) 100%)',
              border: '1px solid rgba(201,162,52,0.2)',
            }}
          >
            <p
              className="font-body uppercase text-gold/80 mb-3"
              style={{ fontSize: '10px', letterSpacing: '0.3em' }}
            >
              Still Have Questions?
            </p>
            <h3
              className="font-display font-bold text-kimono"
              style={{ fontSize: 'clamp(20px, 3vw, 28px)', letterSpacing: '0.03em', lineHeight: 1.2 }}
            >
              Read our full <span style={{ color: '#C9A234' }}>FAQ section</span>
            </h3>
            <p
              className="font-serif font-light text-cream/55 mt-3 mx-auto"
              style={{ fontSize: '14px', lineHeight: 1.7, maxWidth: '520px' }}
            >
              Get answers to the most common questions about admissions, visas, fees, and life in Malaysia.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full font-body text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.03]"
              style={{ border: '1px solid rgba(201,162,52,0.5)', color: '#C9A234', letterSpacing: '0.16em' }}
            >
              Open FAQ
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </div>

      {openGuide && <GuideModal guide={openGuide} onClose={() => setOpenGuide(null)} />}
    </>
  );
}
