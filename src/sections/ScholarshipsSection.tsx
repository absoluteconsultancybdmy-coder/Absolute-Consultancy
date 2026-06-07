import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/SectionLabel';
import {
  GraduationCap,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

const WA_NUMBER = '60175631621';
const WA_SCHOLARSHIP_TEXT =
  "Hi! I'd like a free scholarship assessment for studying in Malaysia. Could you help me check which scholarships I might qualify for?";

interface Category {
  Icon: LucideIcon;
  title: string;
  description: string;
  value: string;
  eligible: 'Yes' | 'No' | 'Depends';
}

const categories: Category[] = [
  {
    Icon: GraduationCap,
    title: 'University Merit Scholarships',
    description:
      'Most partner universities offer partial tuition waivers (10%–50%) for students with strong academic records (GPA 3.5+, IELTS 6.5+). Awarded at admission time — no separate application.',
    value: '10%–50% tuition waiver',
    eligible: 'Depends',
  },
  {
    Icon: Trophy,
    title: 'Sports & Talent Scholarships',
    description:
      'Several Malaysian universities offer talent-based scholarships for athletes, musicians, debaters, and student leaders. Portfolio + audition required. Less competitive than merit awards.',
    value: 'Tuition reduction + extras',
    eligible: 'Depends',
  },
];

export default function ScholarshipsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!sectionRef.current) return;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      sectionRef.current
        .querySelectorAll<HTMLElement>('[data-anim]')
        .forEach((el) => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      return;
    }

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        const els = headerRef.current.querySelectorAll<HTMLElement>('[data-anim]');
        if (els.length) {
          gsap.fromTo(
            els,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: headerRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll<HTMLElement>('.sch-card');
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const els = sectionRef.current?.querySelectorAll<HTMLElement>('[data-anim]');
      els?.forEach((el) => {
        if (el.style.opacity === '' || el.style.opacity === '0') {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [isMobile]);

  const whatsappHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_SCHOLARSHIP_TEXT)}`;

  return (
    <section
      ref={sectionRef}
      id="scholarships"
      className="relative w-full py-32 lg:py-44 overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#0A0A0A',
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 85% 15%, rgba(11,42,92,0.55) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 85%, rgba(201,162,52,0.08) 0%, transparent 60%)',
        }}
      />

      <svg
        className="absolute inset-0 z-0 pointer-events-none"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="sch-grid"
            x="0"
            y="0"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 64 0 L 0 0 0 64"
              fill="none"
              stroke="rgba(201,162,52,0.05)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="sch-fade" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0" />
            <stop offset="100%" stopColor="#0A0A0A" stopOpacity="1" />
          </radialGradient>
          <mask id="sch-mask">
            <rect width="100%" height="100%" fill="url(#sch-fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#sch-grid)" mask="url(#sch-mask)" />
      </svg>



      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="mb-8 lg:mb-10">
          <SectionLabel name="Scholarships for Bangladeshi Students" />
        </div>
        <div ref={headerRef} className="max-w-[860px] mb-16 lg:mb-20">
          <p
            data-anim
            className="small-caps text-gold mb-5"
            style={{ fontSize: '11px', letterSpacing: '0.32em', opacity: 0 }}
          >
            Scholarships &amp; Funding
          </p>
          <h2
            data-anim
            className="font-display font-bold text-cream"
            style={{
              fontSize: 'clamp(36px, 6.5vw, 72px)',
              lineHeight: 1.05,
              letterSpacing: '0.02em',
              opacity: 0,
            }}
          >
            Real scholarship pathways for{' '}
            <span style={{ color: '#C9A234' }}>Bangladeshi students</span>
          </h2>
          <p
            data-anim
            className="font-serif font-light text-cream/60 mt-6"
            style={{ fontSize: 'clamp(16px, 1.6vw, 20px)', lineHeight: 1.75, opacity: 0 }}
          >
            Malaysian universities and the Malaysian government offer meaningful scholarships for international students. Here&apos;s what you need to know.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {categories.map((cat) => {
            const Icon = cat.Icon;
            return (
              <article
                key={cat.title}
                data-anim
                className="sch-card group relative rounded-2xl p-7 flex flex-col gap-5 cursor-default"
                style={{
                  opacity: 0,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(201,162,52,0.25)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  transition:
                    'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), border-color 300ms ease, box-shadow 300ms ease, background 300ms ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(-4px)';
                  el.style.borderColor = 'rgba(201,162,52,0.7)';
                  el.style.background = 'rgba(255,255,255,0.06)';
                  el.style.boxShadow = '0 12px 32px rgba(201,162,52,0.18)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(0)';
                  el.style.borderColor = 'rgba(201,162,52,0.25)';
                  el.style.background = 'rgba(255,255,255,0.04)';
                  el.style.boxShadow = 'none';
                }}
              >
                <span
                  className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 0%, rgba(201,162,52,0.10) 0%, transparent 60%)',
                  }}
                />
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: 'rgba(201,162,52,0.12)',
                    border: '1px solid rgba(201,162,52,0.35)',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <Icon className="w-6 h-6 text-gold" strokeWidth={1.5} />
                </div>
                <h3
                  className="font-body font-bold text-cream"
                  style={{ fontSize: '16px', letterSpacing: '0.01em', lineHeight: 1.3 }}
                >
                  {cat.title}
                </h3>
                <p
                  className="font-body font-light text-cream/65 text-sm"
                  style={{ lineHeight: 1.65 }}
                >
                  {cat.description}
                </p>
                <div
                  className="mt-auto pt-4 flex flex-col gap-1.5"
                  style={{ borderTop: '1px solid rgba(201,162,52,0.15)' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="small-caps text-mouse"
                      style={{ fontSize: '9px' }}
                    >
                      Typical value
                    </span>
                    <span
                      className="font-body text-gold"
                      style={{ fontSize: '12px', fontWeight: 600, textAlign: 'right' }}
                    >
                      {cat.value}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="small-caps text-mouse"
                      style={{ fontSize: '9px' }}
                    >
                      Eligible?
                    </span>
                    <span
                      className="small-caps text-cream/80"
                      style={{ fontSize: '10px' }}
                    >
                      {cat.eligible}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div
          ref={ctaRef}
          className="mt-12 lg:mt-16 rounded-2xl p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(201,162,52,0.4)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 12px 40px rgba(201,162,52,0.08)',
            opacity: 0,
          }}
        >
          <div
            aria-hidden="true"
            className="absolute -top-px left-6 right-6 h-px lg:hidden"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(201,162,52,0.5) 50%, transparent 100%)',
            }}
          />
          <div className="flex-1 min-w-0">
            <p
              className="font-display font-bold text-cream uppercase mb-3"
              style={{ fontSize: 'clamp(20px, 2.6vw, 28px)', letterSpacing: '0.04em', lineHeight: 1.15 }}
            >
              Not sure if you qualify?
            </p>
            <p
              className="font-serif font-light text-cream/70"
              style={{ fontSize: 'clamp(14px, 1.5vw, 16px)', lineHeight: 1.7 }}
            >
              Talk to our team — we&apos;ll review your profile for free and tell you which scholarships to apply for.
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-body whitespace-nowrap flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #C9A234 0%, #D4AF37 100%)',
              color: '#0A0A0A',
              padding: '14px 28px',
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              boxShadow: '0 10px 28px rgba(201,162,52,0.3), 0 0 0 1px rgba(201,162,52,0.45)',
              transition:
                'transform 250ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 14px 36px rgba(201,162,52,0.45), 0 0 0 1px rgba(201,162,52,0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 10px 28px rgba(201,162,52,0.3), 0 0 0 1px rgba(201,162,52,0.45)';
            }}
          >
            Get a Free Scholarship Assessment
            <ArrowRight size={16} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </section>
  );
}
