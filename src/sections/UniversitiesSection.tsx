import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const universities = [
  {
    name: 'Universiti Teknologi MARA (UiTM)',
    location: 'Shah Alam, Selangor',
    type: 'Public',
    programmes: ['Business', 'Engineering', 'Law', 'Medicine', 'IT'],
    accent: '#1A3A6B',
    tag: 'Top Public',
  },
  {
    name: 'Multimedia University (MMU)',
    location: 'Cyberjaya, Selangor',
    type: 'Private',
    programmes: ['Computer Science', 'Engineering', 'Creative Arts', 'Business'],
    accent: '#7B0000',
    tag: 'Tech Leader',
  },
  {
    name: 'UCSI University',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Medicine', 'Pharmacy', 'Architecture', 'Music', 'Business'],
    accent: '#1B5E20',
    tag: 'QS Ranked',
  },
  {
    name: 'Asia Pacific University (APU)',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['IT', 'Engineering', 'Business', 'Computing', 'Design'],
    accent: '#1A3A6B',
    tag: '5-Star SETARA',
  },
  {
    name: 'Sunway University',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Business', 'Sciences', 'Arts', 'Computing', 'Law'],
    accent: '#7B0000',
    tag: 'Premier Private',
  },
  {
    name: "Taylor's University",
    location: 'Subang Jaya, Selangor',
    type: 'Private',
    programmes: ['Hospitality', 'Law', 'Architecture', 'Business', 'Medicine'],
    accent: '#1B5E20',
    tag: 'Award Winning',
  },
  {
    name: 'HELP University',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Psychology', 'Business', 'Law', 'IT', 'Economics'],
    accent: '#1A3A6B',
    tag: 'Established 1986',
  },
  {
    name: 'INTI International University',
    location: 'Nilai, Negeri Sembilan',
    type: 'Private',
    programmes: ['Business', 'Engineering', 'Computing', 'Hospitality'],
    accent: '#7B0000',
    tag: 'Laureate Network',
  },
  {
    name: 'University of Cyberjaya (UoC)',
    location: 'Cyberjaya, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Pharmacy', 'IT', 'Business', 'Health Sciences'],
    accent: '#1B5E20',
    tag: 'Health Focus',
  },
  {
    name: 'SEGi University',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Dentistry', 'Business', 'Engineering', 'IT'],
    accent: '#1A3A6B',
    tag: 'Affordable',
  },
  {
    name: 'Limkokwing University',
    location: 'Cyberjaya, Selangor',
    type: 'Private',
    programmes: ['Design', 'Architecture', 'Communication', 'Business'],
    accent: '#7B0000',
    tag: 'Creative Hub',
  },
  {
    name: 'KDU University College',
    location: 'Utama, Selangor',
    type: 'Private',
    programmes: ['Culinary Arts', 'Business', 'Engineering', 'Computing'],
    accent: '#1B5E20',
    tag: 'Swiss Partner',
  },
];

function UniCard({ uni, index }: { uni: typeof universities[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: (index % 3) * 0.15,
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="rounded-xl p-6 flex flex-col gap-4 cursor-default"
      style={{
        opacity: 0,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'border-color 300ms ease, transform 300ms ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${uni.accent}50`;
        el.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(255,255,255,0.07)';
        el.style.transform = 'translateY(0)';
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <span
          className="px-2 py-1 rounded-full text-[9px] font-body uppercase tracking-wider flex-shrink-0"
          style={{ background: `${uni.accent}30`, color: '#C9A234', border: `1px solid ${uni.accent}40` }}
        >
          {uni.tag}
        </span>
        <span
          className="text-[10px] font-body uppercase tracking-wider"
          style={{ color: uni.type === 'Public' ? '#D4F87A' : '#C9A234' }}
        >
          {uni.type}
        </span>
      </div>

      {/* University name */}
      <h3
        className="font-body font-semibold text-kimono leading-snug"
        style={{ fontSize: 'clamp(14px, 1.5vw, 16px)' }}
      >
        {uni.name}
      </h3>

      {/* Location */}
      <p className="font-body text-mouse text-xs flex items-center gap-1">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        {uni.location}
      </p>

      {/* Programmes */}
      <div className="flex flex-wrap gap-1 mt-auto">
        {uni.programmes.map((p) => (
          <span
            key={p}
            className="text-[9px] px-2 py-0.5 rounded font-body text-mouse/70"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function UniversitiesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 80%', toggleActions: 'play none none none' },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 lg:py-44"
      id="destinations"
      style={{
        backgroundColor: '#0B1A33',
        backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(11,42,92,0.6) 0%, transparent 60%)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div ref={headingRef} className="mb-16" style={{ opacity: 0 }}>
          <div className="w-16 h-px mb-8" style={{ background: 'rgba(201,162,52,0.5)' }} />
          <h2
            className="font-display font-bold text-kimono uppercase"
            style={{ fontSize: 'clamp(36px, 6.5vw, 80px)', letterSpacing: '0.05em', lineHeight: 1.05 }}
          >
            OUR PARTNER
            <br />
            <span style={{ WebkitTextStroke: '1px rgba(201,162,52,0.5)', color: 'transparent' }}>
              UNIVERSITIES
            </span>
          </h2>
          <p
            className="font-serif font-light text-cream/55 mt-6 max-w-[560px]"
            style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.75 }}
          >
            We are officially partnered with Malaysia's leading universities.
            We handle your entire application — offer letter to visa — at no extra charge.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 mt-8">
            {['Free Offer Letter', '99.9% Visa Rate', 'Certified Counsellors', 'End-to-End Support'].map((badge) => (
              <span
                key={badge}
                className="px-4 py-2 rounded-full text-[11px] font-body uppercase tracking-wider"
                style={{ border: '1px solid rgba(201,162,52,0.4)', color: '#C9A234' }}
              >
                ✓ {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Universities grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {universities.map((uni, index) => (
            <UniCard key={uni.name} uni={uni} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="font-serif font-light text-cream/40 mb-8" style={{ fontSize: '16px' }}>
            Don't see your preferred university? We work with 30+ institutions.
          </p>
          <button
            className="px-12 py-4 rounded-full font-body text-sm uppercase tracking-widest cursor-pointer"
            style={{
              border: '1px solid rgba(201,162,52,0.5)',
              color: '#C9A234',
              background: 'transparent',
              transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = '#C9A234';
              el.style.color = '#0A0A0A';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'transparent';
              el.style.color = '#C9A234';
            }}
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ask About Your University
          </button>
        </div>
      </div>
    </section>
  );
}
