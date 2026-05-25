import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 99, suffix: "%", label: "Visa Approval Rate", sublabel: 'highest in Malaysia', isDecimal: false },
  { value: 300, suffix: "+", label: "Students Placed", sublabel: 'at top Malaysian universities' },
  { value: 30, suffix: '+', label: 'Partner Universities', sublabel: 'across Malaysia' },
  { value: 2, suffix: '+', label: 'Years of Excellence', sublabel: 'established in Malaysia' },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      stats.forEach((stat, i) => {
        const el = counterRefs.current[i];
        if (!el) return;

        const obj = { val: 0 };
        gsap.fromTo(
          obj,
          { val: 0 },
          {
            val: stat.value,
            duration: 1.8,
            ease: 'power2.out',
            delay: i * 0.15,
            onUpdate() {
              el.textContent = stat.isDecimal ? obj.val.toFixed(1) : Math.round(obj.val).toString();
            },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );

        gsap.fromTo(
          el.closest('.stat-block'),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 overflow-hidden"
      id="stats"
      style={{
        background: 'linear-gradient(135deg, #0B1E42 0%, #0B2A5C 50%, #0A1630 100%)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(201,162,52,0.25)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(201,162,52,0.25)' }} />

      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
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
          RESULTS
        </span>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-6 mb-16">
          <div ref={lineRef} className="hairline flex-1" style={{ transform: 'scaleX(0)' }} />
          <p className="small-caps text-gold/70 whitespace-nowrap" style={{ fontSize: '11px' }}>
            YEARS OF OUTCOMES
          </p>
          <div className="hairline flex-1" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <div key={stat.label} className="stat-block text-center lg:text-left" style={{ opacity: 0 }}>
              <div
                className="font-display font-bold text-gold leading-none mb-3"
                style={{ fontSize: 'clamp(52px, 8vw, 88px)' }}
              >
                <span ref={(el) => { counterRefs.current[i] = el; }}>0</span>
                <span>{stat.suffix}</span>
              </div>
              <p className="font-body text-kimono uppercase tracking-widest mb-1" style={{ fontSize: '12px' }}>
                {stat.label}
              </p>
              <p className="font-body font-light text-mouse" style={{ fontSize: '13px' }}>
                {stat.sublabel}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="font-serif font-light text-cream/45 italic" style={{ fontSize: 'clamp(16px, 2vw, 22px)', lineHeight: 1.7 }}>
            "Every number represents a student who dared to dream bigger than their postcode."
          </p>
          <p className="small-caps text-gold/50 mt-3" style={{ fontSize: '10px' }}>
            — Absolute Consultancy Firm, KL
          </p>
        </div>
      </div>
    </section>
  );
}
