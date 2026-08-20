import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 300, suffix: '+', label: 'Students Placed' },
  { value: 30, suffix: '+', label: 'Partner Universities' },
  { value: 99, suffix: '%', label: 'Visa Success Rate' },
  { value: 2, suffix: '+', label: 'Years of Experience' },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const vDividerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hDividerRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const scrollTrigger = {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      };

      const lastValues = new Map<HTMLElement, string>();

      stats.forEach((stat, i) => {
        const el = counterRefs.current[i];
        const blockEl = statRefs.current[i];
        if (!el || !blockEl) return;

        const obj = { val: 0 };
        gsap.fromTo(
          obj,
          { val: 0 },
          {
            val: stat.value,
            duration: 2.4,
            ease: 'power2.out',
            delay: i * 0.15,
            onUpdate() {
              const v = String(Math.round(obj.val));
              const last = lastValues.get(el) || '';
              if (v !== last) {
                el.textContent = v;
                lastValues.set(el, v);
              }
            },
            scrollTrigger,
          }
        );

        gsap.fromTo(
          blockEl,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.15,
            ease: 'power2.out',
            scrollTrigger,
          }
        );
      });

      const vDivs = vDividerRefs.current.filter(Boolean);
      if (vDivs.length) {
        gsap.fromTo(
          vDivs,
          { scaleY: 0, transformOrigin: 'center center' },
          {
            scaleY: 1,
            duration: 0.8,
            stagger: 0.1,
            delay: 0.5,
            ease: 'power2.out',
            scrollTrigger,
          }
        );
      }

      const hDivs = hDividerRefs.current.filter(Boolean);
      if (hDivs.length) {
        gsap.fromTo(
          hDivs,
          { scaleX: 0, transformOrigin: 'center center' },
          {
            scaleX: 1,
            duration: 0.8,
            stagger: 0.1,
            delay: 0.5,
            ease: 'power2.out',
            scrollTrigger,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="on-navy relative w-full py-32 lg:py-44 overflow-hidden bg-mist"
    >
      <div className="hairline-draw absolute top-0 left-0 right-0 h-px" style={{ background: 'rgb(var(--color-gold) / 0.2)' }} />
      <div className="hairline-draw absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgb(var(--color-gold) / 0.2)' }} />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
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
          NUMBERS
        </span>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgb(var(--color-gold) / 0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="mb-8 lg:mb-10">
          <SectionLabel name="Results That Speak" />
        </div>
        <div className="text-center mb-16 lg:mb-20">
          <p
            className="font-body uppercase tracking-[0.4em] text-gold/70 mb-4"
            style={{ fontSize: '11px' }}
          >
            By the Numbers
          </p>
          <h2
            className="font-display font-bold text-kimono leading-[0.95]"
            style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}
          >
            Results That <span className="text-gold">Speak</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              ref={(el) => {
                statRefs.current[i] = el;
              }}
              className="relative text-center px-4 py-12 lg:py-0"
              style={{ opacity: 0 }}
            >
              <div
                className="font-display font-bold text-gold leading-none mb-4"
                style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}
              >
                <span ref={(el) => { counterRefs.current[i] = el; }}>0</span>
                <span>{stat.suffix}</span>
              </div>
              <p
                className="text-cream/60 small-caps"
                style={{ fontSize: '11px', letterSpacing: '0.22em' }}
              >
                {stat.label}
              </p>

              {i < stats.length - 1 && i !== 1 && (
                <span
                  ref={(el) => {
                    vDividerRefs.current[i] = el;
                  }}
                  className="hidden lg:block absolute right-0 top-[15%] h-[70%] w-px bg-gold/30"
                  aria-hidden="true"
                />
              )}

              {i === 1 && (
                <span
                  ref={(el) => {
                    hDividerRefs.current[0] = el;
                  }}
                  className="lg:hidden absolute bottom-0 left-[15%] w-[70%] h-px bg-gold/30"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
