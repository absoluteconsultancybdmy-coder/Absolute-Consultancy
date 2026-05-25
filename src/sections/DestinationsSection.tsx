import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Global Academic Pathways Data ──────────────────────────────────────
const pathways = [
  {
    region: 'United Kingdom',
    flag: '🇬🇧',
    tag: 'Oldest Prestige',
    tagColor: '#1A3A6B',
    accentColor: '#C9A234',
    description:
      'Oxford, Cambridge, Imperial, LSE, UCL — centuries of academic tradition forged into world-leading research environments. The UK offers 1–2 year Masters and globally recognised undergraduate degrees that open every door.',
    highlights: ['Russell Group Universities', 'Post-Study Work Visa', 'Chevening Scholarships'],
    universities: ['University of Oxford', 'Imperial College London', 'London School of Economics', 'University College London', 'University of Edinburgh'],
    image: '/images/dest-singapore.jpg',
  },
  {
    region: 'Australia & New Zealand',
    flag: '🇦🇺',
    tag: 'Pacific Excellence',
    tagColor: '#1B5E20',
    accentColor: '#D4F87A',
    description:
      'A top-8 global destination for international students. World-class research universities, an extraordinary quality of life, and post-study work rights of up to four years make ANZ a strategically exceptional choice.',
    highlights: ['Go8 Universities', '2–4 Year Post-Study Visa', 'Australia Awards'],
    universities: ['Australian National University', 'University of Melbourne', 'University of Sydney', 'University of Auckland', 'Monash University'],
    image: '/images/dest-bali.jpg',
  },
  {
    region: 'North America',
    flag: '🇺🇸',
    tag: 'Ivy League Tier',
    tagColor: '#7B0000',
    accentColor: '#FF6B6B',
    description:
      'Harvard, MIT, Stanford, UBC, Toronto — the names that define global excellence. A North American degree is the ultimate signal of intellectual achievement, opening doors to Silicon Valley, Wall Street, and beyond.',
    highlights: ['Ivy League Access', 'OPT / STEM Extension', 'Merit Scholarships'],
    universities: ['Massachusetts Institute of Technology', 'Harvard University', 'Stanford University', 'University of Toronto', 'University of British Columbia'],
    image: '/images/dest-bangkok.jpg',
  },
];

// Individual pathway cluster card
function PathwayCard({
  pathway,
  index,
}: {
  pathway: typeof pathways[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: index * 0.2, // 200ms stagger between regions
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="pathway-cluster group"
      style={{ opacity: 0, willChange: 'transform, opacity' }}
    >
      {/* Card shell */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.035)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          transition: 'border-color 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1), box-shadow 500ms cubic-bezier(0.16,1,0.3,1)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = `${pathway.accentColor}40`;
          el.style.transform = 'translateY(-6px)';
          el.style.boxShadow = `0 24px 60px rgba(0,0,0,0.35)`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'rgba(255,255,255,0.08)';
          el.style.transform = 'translateY(0)';
          el.style.boxShadow = 'none';
        }}
      >
        {/* Top image strip */}
        <div className="relative h-[180px] overflow-hidden">
          <img
            src={pathway.image}
            alt={pathway.region}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.6) 100%)`,
            }}
          />
          {/* Flag + tag */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-2xl">{pathway.flag}</span>
            <span
              className="px-3 py-1 rounded-full text-[10px] font-body uppercase tracking-wider"
              style={{
                backgroundColor: pathway.accentColor,
                color: pathway.tagColor === '#7B0000' ? '#fff' : '#0A0A0A',
              }}
            >
              {pathway.tag}
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-8">
          {/* Region heading */}
          <h3
            className="font-display font-bold text-kimono mb-4 uppercase"
            style={{ fontSize: 'clamp(22px, 3vw, 30px)', letterSpacing: '0.05em' }}
          >
            {pathway.region}
          </h3>

          {/* Description */}
          <p
            className="font-body font-light text-mouse mb-6"
            style={{ fontSize: '15px', lineHeight: 1.7 }}
          >
            {pathway.description}
          </p>

          {/* Key highlights */}
          <div className="flex flex-wrap gap-2 mb-6">
            {pathway.highlights.map((h) => (
              <span
                key={h}
                className="px-3 py-1 rounded-full text-[11px] font-body uppercase tracking-wider"
                style={{
                  border: `1px solid ${pathway.accentColor}50`,
                  color: pathway.accentColor,
                  background: `${pathway.accentColor}10`,
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Hairline */}
          <div
            className="w-full h-px mb-6"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          />

          {/* University list */}
          <ul className="space-y-2">
            {pathway.universities.map((uni, i) => (
              <li
                key={uni}
                className="flex items-center gap-3 font-body text-mouse/80 text-sm"
              >
                <span
                  className="text-[10px] font-bold tabular-nums"
                  style={{ color: pathway.accentColor, minWidth: '18px' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {uni}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────
export default function DestinationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;

    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
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
        backgroundImage:
          'radial-gradient(ellipse at 20% 50%, rgba(11,42,92,0.6) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(201,162,52,0.04) 0%, transparent 50%)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">

        {/* ── Section Heading ── */}
        <div ref={headingRef} className="mb-20" style={{ opacity: 0 }}>
          <div
            className="w-16 h-px mb-8"
            style={{ background: 'rgba(201,162,52,0.5)' }}
          />
          <h2
            className="font-display font-bold text-kimono"
            style={{
              fontSize: 'clamp(36px, 6.5vw, 80px)',
              letterSpacing: '0.05em',
              lineHeight: 1.05,
            }}
          >
            GLOBAL ACADEMIC
            <br />
            <span style={{ WebkitTextStroke: '1px rgba(201,162,52,0.5)', color: 'transparent' }}>
              PATHWAYS
            </span>
          </h2>
          <p
            className="font-serif font-light text-cream/55 mt-6 max-w-[560px]"
            style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.75 }}
          >
            Every elite student deserves a destination curated to their ambition.
            We navigate the world's most competitive admissions ecosystems so you
            arrive at your dream institution — ready.
          </p>
          <div
            className="w-16 h-px mt-8"
            style={{ background: 'rgba(201,162,52,0.5)' }}
          />
        </div>

        {/* ── Pathway Clusters Grid — Sequential stagger reveal ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pathways.map((pathway, index) => (
            <PathwayCard key={pathway.region} pathway={pathway} index={index} />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-20 text-center">
          <p
            className="font-serif font-light text-cream/40 mb-8"
            style={{ fontSize: '16px', letterSpacing: '0.05em' }}
          >
            Not sure which pathway is right for you?
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
              el.style.borderColor = '#C9A234';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'transparent';
              el.style.color = '#C9A234';
              el.style.borderColor = 'rgba(201,162,52,0.5)';
            }}
            onClick={() => {
              const el = document.querySelector('#contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Book a Free Consultation
          </button>
        </div>
      </div>
    </section>
  );
}
