import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Globe,
  Coins,
  BookOpen,
  HeartHandshake,
  Plane,
  ShieldCheck,
  Briefcase,
  Compass,
} from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

interface Benefit {
  icon: typeof Globe;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: Globe,
    title: 'Globally Recognised Degrees',
    description:
      '20+ Malaysian universities in QS World Rankings, with branch campuses of Monash, Heriot-Watt, and University of Wollongong offering international degrees.',
  },
  {
    icon: Coins,
    title: 'Affordable Education',
    description:
      'Tuition and living costs are typically a fraction of UK, US, or Australia. World-class education without the world-class debt.',
  },
  {
    icon: BookOpen,
    title: 'English-Medium Programs',
    description:
      'Top in Asia for English proficiency. Most programmes taught entirely in English — no language barrier.',
  },
  {
    icon: HeartHandshake,
    title: 'Multicultural & Muslim-Friendly',
    description:
      'A welcoming environment with halal food, mosques, and a thriving South Asian community. Feel at home from day one.',
  },
  {
    icon: Plane,
    title: 'Strategic Location',
    description:
      'Heart of Southeast Asia. Weekend trips to Bali, Singapore, Bangkok. Affordable flights to all ASEAN capitals.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Peaceful',
    description:
      'Ranked among the most peaceful countries globally. Modern cities, reliable public transport, low crime.',
  },
  {
    icon: Briefcase,
    title: 'Work While You Study',
    description:
      '20 hours per week during semester, full-time during breaks. Gain real-world experience and offset living costs.',
  },
  {
    icon: Compass,
    title: 'Pathway to the World',
    description:
      'Many degrees include credit transfer to Australian, UK, and US campuses. A Malaysian degree is your launchpad.',
  },
];

type CellKind = 'check' | 'cross' | 'text';

interface ComparisonCell {
  kind: CellKind;
  value?: string;
}

interface ComparisonRow {
  label: string;
  cells: [ComparisonCell, ComparisonCell, ComparisonCell, ComparisonCell];
}

const countries = ['Malaysia', 'UK', 'Australia', 'Canada'] as const;

const comparisonRows: ComparisonRow[] = [
  {
    label: 'Tuition Cost',
    cells: [
      { kind: 'check', value: 'Affordable' },
      { kind: 'cross', value: 'Expensive' },
      { kind: 'cross', value: 'Expensive' },
      { kind: 'cross', value: 'Expensive' },
    ],
  },
  {
    label: 'Visa Process',
    cells: [
      { kind: 'check', value: 'Simple' },
      { kind: 'cross', value: 'Complex' },
      { kind: 'cross', value: 'Complex' },
      { kind: 'cross', value: 'Complex' },
    ],
  },
  {
    label: 'Travel from Dhaka',
    cells: [
      { kind: 'check', value: '4 hours' },
      { kind: 'cross', value: '11+ hours' },
      { kind: 'cross', value: '10+ hours' },
      { kind: 'cross', value: '16+ hours' },
    ],
  },
  {
    label: 'English-Medium',
    cells: [
      { kind: 'check' },
      { kind: 'check' },
      { kind: 'check' },
      { kind: 'check' },
    ],
  },
  {
    label: 'Post-Study Work',
    cells: [
      { kind: 'text', value: '1 year' },
      { kind: 'text', value: '2 years' },
      { kind: 'text', value: '2–4 years' },
      { kind: 'text', value: 'Up to 3 years' },
    ],
  },
];

export default function WhyMalaysiaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!sectionRef.current) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
        const headerEls = headerRef.current.querySelectorAll<HTMLElement>('[data-anim]');
        if (headerEls.length) {
          gsap.fromTo(
            headerEls,
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
        const cards = gridRef.current.querySelectorAll<HTMLElement>('.why-card');
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: isMobile ? 0.06 : 0.1,
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

      if (comparisonRef.current) {
        const rows = comparisonRef.current.querySelectorAll<HTMLElement>('.compare-row');
        if (rows.length) {
          gsap.fromTo(
            rows,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: comparisonRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 lg:py-44 overflow-hidden"
      id="why-malaysia"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#0A0A0A',
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 20% 10%, rgba(201,162,52,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 90%, rgba(11,42,92,0.45) 0%, transparent 60%)',
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
            id="why-grid"
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
          <radialGradient id="why-fade" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0" />
            <stop offset="100%" stopColor="#0A0A0A" stopOpacity="1" />
          </radialGradient>
          <mask id="why-mask">
            <rect width="100%" height="100%" fill="url(#why-fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#why-grid)" mask="url(#why-mask)" />
      </svg>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
        <div ref={headerRef} className="max-w-[820px] mb-16 lg:mb-20">
          <p
            data-anim
            className="small-caps text-gold mb-5"
            style={{ fontSize: '11px', letterSpacing: '0.32em', opacity: 0 }}
          >
            Why Study in Malaysia
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
            Your gateway to a{' '}
            <span style={{ color: '#C9A234' }}>world-class degree</span>
          </h2>
          <p
            data-anim
            className="font-serif font-light text-cream/60 mt-6"
            style={{ fontSize: 'clamp(16px, 1.6vw, 20px)', lineHeight: 1.75, opacity: 0 }}
          >
            Malaysia is one of the fastest-growing study destinations in Asia — and one
            of the most welcoming for Bangladeshi students.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                data-anim
                className="why-card group relative rounded-2xl p-7 flex flex-col gap-4 cursor-default"
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
                  {benefit.title}
                </h3>
                <p
                  className="font-body font-light text-cream/65 text-sm"
                  style={{ lineHeight: 1.65 }}
                >
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        <div
          ref={comparisonRef}
          className="mt-20 lg:mt-24 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(201,162,52,0.2)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          <div className="px-6 lg:px-8 pt-8 pb-4">
            <p
              data-anim
              className="small-caps text-gold mb-3"
              style={{ fontSize: '11px', letterSpacing: '0.32em', opacity: 0 }}
            >
              At a Glance
            </p>
            <h3
              data-anim
              className="font-display font-bold text-cream"
              style={{
                fontSize: 'clamp(22px, 3.2vw, 32px)',
                letterSpacing: '0.04em',
                lineHeight: 1.15,
                opacity: 0,
              }}
            >
              Malaysia vs.{' '}
              <span style={{ color: '#C9A234' }}>UK / Australia / Canada</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table
              className="w-full min-w-[640px]"
              style={{ borderCollapse: 'collapse' }}
            >
              <thead>
                <tr
                  data-anim
                  className="compare-row"
                  style={{ borderBottom: '1px solid rgba(201,162,52,0.2)', opacity: 0 }}
                >
                  <th
                    className="text-left font-body font-semibold text-cream/70 px-6 lg:px-8 py-4"
                    style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' }}
                  >
                    Criteria
                  </th>
                  {countries.map((c, i) => (
                    <th
                      key={c}
                      className="text-center font-body font-semibold px-4 py-4"
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: i === 0 ? '#C9A234' : 'rgba(245,232,211,0.7)',
                      }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    key={row.label}
                    data-anim
                    className="compare-row"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.05)', opacity: 0 }}
                  >
                    <td
                      className="font-body text-cream/80 px-6 lg:px-8 py-4"
                      style={{ fontSize: '14px' }}
                    >
                      {row.label}
                    </td>
                    {row.cells.map((cell, i) => (
                      <td
                        key={i}
                        className="text-center px-4 py-4"
                        style={{ fontSize: '14px' }}
                      >
                        {renderCell(cell, i === 0)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function renderCell(cell: ComparisonCell, highlight: boolean) {
  if (cell.kind === 'check') {
    return (
      <span
        className="inline-flex items-center gap-2 font-body"
        style={{ color: highlight ? '#C9A234' : '#D4F87A' }}
      >
        <span
          className="inline-flex items-center justify-center w-5 h-5 rounded-full"
          style={{
            background: highlight
              ? 'rgba(201,162,52,0.18)'
              : 'rgba(212,248,122,0.15)',
            border: highlight
              ? '1px solid rgba(201,162,52,0.5)'
              : '1px solid rgba(212,248,122,0.35)',
          }}
        >
          <CheckGlyph />
        </span>
        {cell.value && <span className="text-cream/70 text-sm">{cell.value}</span>}
      </span>
    );
  }
  if (cell.kind === 'cross') {
    return (
      <span
        className="inline-flex items-center gap-2 font-body"
        style={{ color: 'rgba(245,232,211,0.45)' }}
      >
        <span
          className="inline-flex items-center justify-center w-5 h-5 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <CrossGlyph />
        </span>
        {cell.value && <span className="text-cream/45 text-sm">{cell.value}</span>}
      </span>
    );
  }
  return (
    <span
      className="font-body"
      style={{
        color: highlight ? '#C9A234' : 'rgba(245,232,211,0.8)',
        fontWeight: highlight ? 600 : 400,
      }}
    >
      <span
        className="mr-1"
        style={{ color: highlight ? '#C9A234' : '#D4F87A' }}
      >
        ✓
      </span>
      {cell.value}
    </span>
  );
}

function CheckGlyph() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CrossGlyph() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
