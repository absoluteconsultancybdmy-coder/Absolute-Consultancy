import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Globe3D from '../components/Globe3D';
import { useIsMobile } from '../hooks/use-mobile';
import SectionLabel from '../components/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { label: 'Apply', sublabel: 'Submit your profile' },
  { label: 'Visa', sublabel: '99% approval rate' },
  { label: 'Arrive', sublabel: 'Begin your future' },
];

export default function ArcSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            stepsRef.current.filter(Boolean),
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.2,
              ease: 'power2.out',
            }
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative w-full py-32 lg:py-44 overflow-hidden bg-mist"
    >
      <div className="hairline-draw absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(201,162,52,0.2)' }} />
      <div className="hairline-draw absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(201,162,52,0.2)' }} />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="font-display font-bold uppercase"
          style={{
            fontSize: 'clamp(120px, 22vw, 320px)',
            letterSpacing: '-0.02em',
            WebkitTextStroke: '1px rgba(201,162,52,0.04)',
            color: 'transparent',
            lineHeight: 1,
          }}
        >
          JOURNEY
        </span>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 75% 50%, rgba(201,162,52,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="mb-8 lg:mb-10">
          <SectionLabel name="Our Arc" />
        </div>
        <div className="text-center mb-16 lg:mb-20">
          <p
            className="font-body uppercase tracking-[0.4em] text-gold/70 mb-6"
            style={{ fontSize: '11px' }}
          >
            The Journey
          </p>
          <h2
            className="font-display font-bold text-kimono leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(36px, 7vw, 72px)', letterSpacing: '-0.01em' }}
          >
            From Dhaka to <span className="text-gold">Kuala Lumpur</span>
          </h2>
          <p
            className="font-serif text-cream/60 max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.6 }}
          >
            Every student we place embarks on a journey that begins in the heart of Bangladesh and ends among the world-class campuses of Malaysia.
          </p>
        </div>

        <div className="relative w-full flex justify-center pb-20">
          <Globe3D height={isMobile ? 360 : 520} />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0 mt-20 max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.label} className="contents">
              <div
                ref={(el) => {
                  stepsRef.current[i] = el;
                }}
                className="step-item text-center md:px-10"
                style={{ opacity: 0 }}
              >
                <div className="w-3 h-3 rounded-full bg-gold mx-auto mb-3 ring-4 ring-gold/15" />
                <p
                  className="font-display uppercase tracking-[0.2em] text-gold mb-1"
                  style={{ fontSize: '14px' }}
                >
                  {step.label}
                </p>
                <p
                  className="font-body text-mouse"
                  style={{ fontSize: '11px' }}
                >
                  {step.sublabel}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="w-px h-6 md:h-px md:w-16 lg:w-24"
                  style={{
                    background:
                      'linear-gradient(to bottom, rgba(201,162,52,0.4), rgba(201,162,52,0.15))',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
