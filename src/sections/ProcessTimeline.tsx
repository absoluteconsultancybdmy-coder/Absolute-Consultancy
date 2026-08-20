import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/SectionLabel';
import {
  MessageCircle,
  ListChecks,
  FileCheck2,
  Stamp,
  Plane,
  MapPin,
  Rocket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ScrambledText from '../components/ScrambledText';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

interface Step {
  num: string;
  title: string;
  description: string;
  duration: string;
  Icon: LucideIcon;
}

const steps: Step[] = [
  {
    num: '01',
    title: 'Free Consultation',
    description:
      'We assess your academic background, budget, and career goals to recommend Malaysian universities that best match your profile.',
    duration: '1–2 days',
    Icon: MessageCircle,
  },
  {
    num: '02',
    title: 'University Shortlist',
    description:
      'We shortlist 3–5 partner universities from our accredited network based on your profile, ambitions, and budget range.',
    duration: '1 week',
    Icon: ListChecks,
  },
  {
    num: '03',
    title: 'Application & Offer Letter',
    description:
      'We prepare and submit your application to your chosen universities, then follow up to secure your Letter of Offer.',
    duration: '2–4 weeks',
    Icon: FileCheck2,
  },
  {
    num: '04',
    title: 'EMGS Student Pass',
    description:
      'The university applies for your Visa Approval Letter through Education Malaysia Global Services (EMGS) on your behalf.',
    duration: '4–8 weeks',
    Icon: Stamp,
  },
  {
    num: '05',
    title: 'Visa & Pre-Departure',
    description:
      'We guide you through your Single Entry Visa stamping, medical check-up, and final travel and accommodation preparations.',
    duration: '1–2 weeks',
    Icon: Plane,
  },
  {
    num: '06',
    title: 'Arrival in Malaysia',
    description:
      'On arrival, we arrange airport pickup, drive you to campus, and assist with student pass endorsement and registration.',
    duration: '1–2 weeks',
    Icon: MapPin,
  },
];

export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const rocketGlowRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(stepsRef.current.filter(Boolean), { opacity: 1, y: 0, x: 0 });
      if (lineRef.current) gsap.set(lineRef.current, { scaleY: 1 });
      if (rocketRef.current) gsap.set(rocketRef.current, { y: '70%' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 0.6,
          },
        }
      );

      gsap.to(lineRef.current, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      const rocketAnim = gsap.fromTo(
        rocketRef.current,
        { y: 0 },
        {
          y: () => {
            if (!lineRef.current || !sectionRef.current) return 0;
            return lineRef.current.offsetHeight - 36;
          },
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 0.6,
          },
        }
      );

      gsap.to(rocketGlowRef.current, {
        scale: 1.6,
        opacity: 0.25,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      const flameTl = gsap.timeline({ repeat: -1 });
      flameTl
        .to(flameRef.current, { scaleY: 1.1, scaleX: 0.85, duration: 0.12, ease: 'power1.out' })
        .to(flameRef.current, { scaleY: 0.85, scaleX: 1.05, duration: 0.18, ease: 'power1.in' })
        .to(flameRef.current, { scaleY: 1, scaleX: 1, duration: 0.15, ease: 'power1.inOut' });

      const items = stepsRef.current.filter((el): el is HTMLDivElement => el !== null);
      items.forEach((el, i) => {
        const isLeft = i % 2 === 0;
        const xOffset = isMobile ? 0 : isLeft ? -40 : 40;
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, x: xOffset },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      return () => {
        rocketAnim.kill();
        flameTl.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative w-full py-32 lg:py-44 overflow-hidden"
      style={{ background: 'rgb(var(--color-mist))' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/YourJourney.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.25,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 30%, rgb(var(--color-gold) / 0.08) 0%, transparent 60%), linear-gradient(180deg, rgba(2, 22, 53,0.85) 0%, rgba(2, 22, 53,0.7) 100%)',
        }}
      />

      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-display font-bold uppercase"
          style={{
            fontSize: 'clamp(120px, 22vw, 320px)',
            letterSpacing: '-0.02em',
            WebkitTextStroke: '1px rgb(var(--color-gold) / 0.04)',
            color: 'transparent',
            lineHeight: 1,
          }}
        >
          PROCESS
        </span>
      </div>

      <div className="hairline-draw absolute top-0 left-0 right-0 h-px" style={{ background: 'rgb(var(--color-gold) / 0.2)' }} />
      <div className="hairline-draw absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgb(var(--color-gold) / 0.2)' }} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="mb-8 lg:mb-10">
          <SectionLabel name="YOUR JOURNEY" />
        </div>
        <div ref={headingRef} className="text-center mb-16 lg:mb-24" style={{ opacity: 0 }}>
          <p
            className="font-body uppercase tracking-[0.4em] text-gold/70 mb-6"
            style={{ fontSize: '11px' }}
          >
            How It Works
          </p>
          <h2
            className="font-display font-bold text-kimono leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(36px, 7vw, 72px)', letterSpacing: '0.05em' }}
          >
            <ScrambledText text="YOUR" />{' '}
            <ScrambledText
              text="JOURNEY"
              style={{ WebkitTextStroke: '1px rgb(var(--color-gold) / 0.5)', color: 'transparent' }}
            />
          </h2>
          <p
            className="font-serif font-light text-cream/60 max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', lineHeight: 1.7 }}
          >
            From your first call to your first day on a Malaysian campus — six clear steps, 8–12 weeks total.
          </p>
        </div>

        <div className="relative">
          <div
            ref={lineRef}
            className="absolute left-[19px] lg:left-1/2 top-0 bottom-0 w-px lg:-translate-x-1/2 origin-top"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, rgb(var(--color-gold) / 0.6) 8%, rgb(var(--color-gold) / 0.6) 92%, transparent 100%)',
              transform: isMobile ? 'scaleY(0)' : 'translateX(-50%) scaleY(0)',
            }}
            aria-hidden="true"
          />

          <div
            ref={rocketRef}
            className="absolute left-[19px] lg:left-1/2 -translate-x-1/2 z-20"
            style={{ top: 0, width: '36px', height: '36px' }}
            aria-hidden="true"
          >
            <div
              ref={rocketGlowRef}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgb(var(--color-gold) / 0.55) 0%, rgb(var(--color-gold) / 0) 70%)',
                transform: 'scale(1)',
                opacity: 0.45,
                filter: 'blur(4px)',
              }}
            />
            <div
              ref={flameRef}
              className="absolute"
              style={{
                top: 'calc(100% - 4px)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '8px',
                height: '14px',
                background: 'linear-gradient(to bottom, rgba(255,180,60,0.95) 0%, rgba(255,120,30,0.7) 50%, rgba(255,80,20,0) 100%)',
                borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
                filter: 'blur(1.5px)',
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(11,30,66,0.95) 0%, rgba(11,30,66,0.85) 100%)',
                border: '1.5px solid rgb(var(--color-gold))',
                boxShadow: '0 0 16px rgb(var(--color-gold) / 0.45), inset 0 0 8px rgb(var(--color-gold) / 0.25)',
              }}
            >
              <Rocket size={16} strokeWidth={1.8} className="text-gold" style={{ transform: 'rotate(45deg)' }} />
            </div>
          </div>

          {steps.map((step, i) => {
            const Icon = step.Icon;
            const isLeft = i % 2 === 0;
            return (
              <div
                key={step.num}
                ref={(el) => {
                  stepsRef.current[i] = el;
                }}
                className="relative flex items-start mb-12 lg:mb-20 last:mb-0"
                style={{ opacity: 0 }}
              >
                <div
                  className="absolute left-[19px] lg:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center"
                  style={{ top: '28px' }}
                  aria-hidden="true"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: 'rgb(var(--color-mist))',
                      border: '2px solid rgb(var(--color-gold))',
                      boxShadow: '0 0 12px rgb(var(--color-gold) / 0.4)',
                    }}
                  />
                </div>

                <div
                  className={`pl-14 lg:pl-0 w-full ${
                    isLeft
                      ? 'lg:pr-[calc(50%+48px)] lg:pl-0'
                      : 'lg:pl-[calc(50%+48px)]'
                  }`}
                >
                  <article
                    className="group relative rounded-2xl p-6 lg:p-8 h-full"
                    style={{
                      background: 'rgb(var(--color-gold) / 0.04)',
                      border: '1px solid rgb(var(--color-gold) / 0.18)',
                      backdropFilter: 'blur(6px)',
                      WebkitBackdropFilter: 'blur(6px)',
                      transition: 'border-color 300ms ease, transform 300ms ease, box-shadow 300ms ease',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'rgb(var(--color-gold) / 0.45)';
                      el.style.transform = 'translateY(-3px)';
                      el.style.boxShadow = '0 12px 36px rgb(var(--color-gold) / 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'rgb(var(--color-gold) / 0.18)';
                      el.style.transform = 'translateY(0)';
                      el.style.boxShadow = 'none';
                    }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <span
                        className="font-display font-bold leading-none"
                        style={{
                          fontSize: 'clamp(48px, 6vw, 72px)',
                          WebkitTextStroke: '1.5px rgb(var(--color-gold) / 0.7)',
                          color: 'transparent',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {step.num}
                      </span>
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
                        style={{
                          background: 'rgb(var(--color-gold) / 0.12)',
                          border: '1px solid rgb(var(--color-gold) / 0.3)',
                        }}
                        aria-hidden="true"
                      >
                        <Icon size={18} strokeWidth={1.5} className="text-gold" />
                      </div>
                    </div>

                    <h3
                      className="font-display font-bold text-kimono mb-3 uppercase"
                      style={{ fontSize: 'clamp(18px, 1.8vw, 22px)', letterSpacing: '0.04em' }}
                    >
                      {step.title}
                    </h3>

                    <p
                      className="font-serif font-light text-cream/70 mb-5"
                      style={{ fontSize: '15px', lineHeight: 1.7 }}
                    >
                      {step.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ background: 'rgb(var(--color-gold))' }}
                        aria-hidden="true"
                      />
                      <span
                        className="small-caps text-gold/80"
                        style={{ fontSize: '10px' }}
                      >
                        {step.duration}
                      </span>
                    </div>
                  </article>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 lg:mt-20 text-center">
          <p
            className="font-serif italic text-cream/60"
            style={{ fontSize: 'clamp(14px, 1.4vw, 16px)' }}
          >
            Total estimated time:{' '}
            <span className="text-gold not-italic font-body" style={{ letterSpacing: '0.05em' }}>
              8–12 weeks
            </span>{' '}
            from first consultation to arrival in Malaysia.
          </p>
        </div>
      </div>
    </section>
  );
}
