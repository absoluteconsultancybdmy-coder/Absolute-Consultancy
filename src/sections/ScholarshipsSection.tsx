import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Landmark,
  GraduationCap,
  Globe2,
  Trophy,
  ClipboardCheck,
  Target,
  PenLine,
  MessageCircle,
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
    Icon: Landmark,
    title: 'Malaysian Government Scholarships',
    description:
      "The Malaysian International Scholarship (MIS) covers Master's and PhD students from selected countries, including Bangladesh. Includes tuition, living allowance, and airfare.",
    value: 'Tuition + stipend + airfare',
    eligible: 'Depends',
  },
  {
    Icon: GraduationCap,
    title: 'University Merit Scholarships',
    description:
      'Most partner universities offer partial tuition waivers (10%–50%) for students with strong academic records (GPA 3.5+, IELTS 6.5+). Awarded at admission time — no separate application.',
    value: '10%–50% tuition waiver',
    eligible: 'Depends',
  },
  {
    Icon: Globe2,
    title: 'Country-Specific Awards',
    description:
      'Some universities (e.g. Monash, Heriot-Watt, UOW) maintain dedicated South Asian scholarship funds. Limited seats, application deadlines vary — we track these for you.',
    value: 'Varies by university',
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

interface Step {
  num: string;
  title: string;
  description: string;
  Icon: LucideIcon;
}

const steps: Step[] = [
  {
    num: '01',
    title: 'Profile Review',
    description: 'We assess your GPA, IELTS score, extracurriculars, and financial situation to gauge your scholarship fit.',
    Icon: ClipboardCheck,
  },
  {
    num: '02',
    title: 'Matching',
    description: 'We shortlist universities and scholarships that align with your profile, ambitions, and eligibility.',
    Icon: Target,
  },
  {
    num: '03',
    title: 'Application Support',
    description: 'We help you craft a compelling scholarship essay and prepare a strong application package.',
    Icon: PenLine,
  },
  {
    num: '04',
    title: 'Interview Prep',
    description: 'We coach you for university scholarship interviews, including mock sessions and personalised feedback.',
    Icon: MessageCircle,
  },
];

export default function ScholarshipsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepperRef = useRef<HTMLDivElement>(null);
  const connectorRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
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
      if (connectorRef.current) {
        connectorRef.current.style.transform = isMobile ? 'scaleY(1)' : 'scaleX(1)';
      }
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

      if (timelineRef.current) {
        const tEls = timelineRef.current.querySelectorAll<HTMLElement>('[data-anim]');
        if (tEls.length) {
          gsap.fromTo(
            tEls,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: timelineRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      }

      if (connectorRef.current) {
        gsap.fromTo(
          connectorRef.current,
          isMobile ? { scaleY: 0 } : { scaleX: 0 },
          {
            scaleX: 1,
            scaleY: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stepperRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      const stepEls = stepRefs.current.filter((el): el is HTMLDivElement => el !== null);
      stepEls.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: isMobile ? 20 : 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.15 * i,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stepperRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

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
      stepRefs.current.forEach((el) => {
        if (el && (el.style.opacity === '' || el.style.opacity === '0')) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
      if (connectorRef.current) {
        connectorRef.current.style.transform = isMobile ? 'scaleY(1)' : 'scaleX(1)';
      }
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
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
          ref={timelineRef}
          className="mt-20 lg:mt-24 rounded-2xl p-8 lg:p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(11,42,92,0.65) 0%, rgba(10,10,10,0.85) 100%)',
            border: '1px solid rgba(201,162,52,0.4)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 16px 48px rgba(11,42,92,0.25)',
          }}
        >
          <div className="text-center mb-12 lg:mb-16 max-w-[680px] mx-auto">
            <p
              data-anim
              className="small-caps text-gold mb-4"
              style={{ fontSize: '11px', letterSpacing: '0.32em' }}
            >
              How to win a scholarship
            </p>
            <h3
              data-anim
              className="font-display font-bold text-cream"
              style={{
                fontSize: 'clamp(24px, 3.4vw, 38px)',
                letterSpacing: '0.04em',
                lineHeight: 1.15,
              }}
            >
              Our 4-step approach
            </h3>
          </div>

          <div ref={stepperRef} className="relative">
            <div
              ref={connectorRef}
              aria-hidden="true"
              className="absolute bg-gold/50"
              style={
                isMobile
                  ? {
                      left: '16px',
                      top: 0,
                      bottom: 0,
                      width: 1,
                      transformOrigin: 'top center',
                    }
                  : {
                      left: 0,
                      right: 0,
                      top: '20px',
                      height: 1,
                      transformOrigin: 'left center',
                    }
              }
            />
            <div
              className={
                isMobile
                  ? 'flex flex-col gap-10'
                  : 'grid grid-cols-4 gap-6 lg:gap-8'
              }
            >
              {steps.map((step, i) => {
                const Icon = step.Icon;
                return (
                  <div
                    key={step.num}
                    ref={(el) => {
                      stepRefs.current[i] = el;
                    }}
                    className={
                      isMobile
                        ? 'relative flex gap-4 pl-14'
                        : 'relative flex flex-col items-center text-center'
                    }
                  >
                    <div
                      className={
                        isMobile
                          ? 'absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full z-10'
                          : 'flex items-center justify-center w-10 h-10 rounded-full z-10 mb-5'
                      }
                      style={{
                        background: '#0A0A0A',
                        border: '2px solid #C9A234',
                        boxShadow: '0 0 12px rgba(201,162,52,0.4)',
                      }}
                    >
                      <Icon size={16} strokeWidth={1.6} className="text-gold" />
                    </div>
                    <div className={isMobile ? 'flex-1 pt-0.5' : ''}>
                      <span
                        className="font-display font-bold leading-none block mb-2"
                        style={{
                          fontSize: 'clamp(20px, 1.8vw, 24px)',
                          color: 'rgba(201,162,52,0.85)',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {step.num}
                      </span>
                      <h4
                        className="font-display font-bold text-cream mb-2 uppercase"
                        style={{ fontSize: 'clamp(14px, 1.4vw, 16px)', letterSpacing: '0.04em' }}
                      >
                        {step.title}
                      </h4>
                      <p
                        className="font-body font-light text-cream/70"
                        style={{ fontSize: '13px', lineHeight: 1.6 }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
