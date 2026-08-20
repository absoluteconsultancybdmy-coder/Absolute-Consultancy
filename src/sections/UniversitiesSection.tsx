import { memo, useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '../hooks/useLenis';
import ScrambledText from '../components/ScrambledText';
import SectionLabel from '../components/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

interface University {
  name: string;
  shortName: string;
  location: string;
  type: string;
  programmes: string[];
  studyLevels: string[];
  accent: string;
  tag: string;
  founded: string;
  students: string;
  ranking: string;
  description: string;
  highlights: string[];
  campusImage: string;
  logoColor: string;
  campusTourVideo: string;
  website: string;
}

const universities: University[] = [
  {
    name: "Taylor's University",
    shortName: "Taylor's",
    location: 'Subang Jaya, Selangor',
    type: 'Private',
    programmes: ['Hospitality', 'Law', 'Architecture', 'Business', 'Medicine', 'Engineering'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#4A0080',
    tag: 'Award Winning',
    founded: '1969',
    students: '12,000+',
    ranking: 'QS World #253 (2026)',
    description: "One of Malaysia's oldest and most reputable private institutions. Taylor's is globally recognised for its Hospitality, Law, and Architecture programmes, and offers award-winning degrees in a beautiful Subang Jaya campus.",
    highlights: ['Established 1969', 'Award-Winning Hospitality School', 'MyQUEST 2022 Competitive', 'QS World #253', 'Beautiful Campus', 'Strong Industry Partnerships'],
    campusImage: '/images/TaylorUniversity.jpeg',
    logoColor: '#4A0080',
    campusTourVideo: 'https://www.youtube.com/embed/NSuKhrtt9zo',
    website: 'https://university.taylors.edu.my',
  },
  {
    name: 'Sunway University',
    shortName: 'Sunway',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Business', 'Sciences', 'Arts', 'Computing', 'Law', 'Medical Sciences'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#B8860B',
    tag: 'Premier Private',
    founded: '1987',
    students: '9,000+',
    ranking: 'QS World #253 (2026)',
    description: 'Ranked #253 globally in QS 2026, Sunway University is one of Malaysia\'s most prestigious private universities. Located within the integrated Sunway City, students enjoy world-class facilities including a FIFA-certified football field.',
    highlights: ['QS World #253 (2026)', 'FIFA-Certified Football Field', 'Canopy Walk', 'Integrated Smart City Campus', 'Strong Medical Sciences', 'Top Business School'],
    campusImage: '/images/SunWayUniversity.jpeg',
    logoColor: '#B8860B',
    campusTourVideo: 'https://www.youtube.com/embed/g5RhGYuzu-s',
    website: 'https://sunwayuniversity.edu.my',
  },
  {
    name: 'Monash University Malaysia',
    shortName: 'Monash',
    location: 'Bandar Sunway, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Engineering', 'Business', 'Pharmacy', 'Computer Science', 'Arts & Sciences'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#005A8B',
    tag: 'Group of Eight',
    founded: '1998',
    students: '9,000+',
    ranking: 'QS World #57 (2026)',
    description: 'Monash University Malaysia is the first foreign university campus in Malaysia and a branch of Australia\'s prestigious Group of Eight. Students earn the same degree as the main campus in Melbourne, with globally recognised programmes in medicine, engineering, business, and pharmacy on a state-of-the-art campus in Bandar Sunway.',
    highlights: ['QS World #57 (2026)', 'Australian Group of Eight', 'Same Degree as Melbourne Campus', 'Top Medicine & Engineering', 'Global Exchange Opportunities', 'Research-Intensive University'],
    campusImage: '/images/MonashUniversity.jpeg',
    logoColor: '#005A8B',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.monash.edu.my',
  },
  {
    name: 'Asia Pacific University of Technology & Innovation (APU)',
    shortName: 'APU',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['IT', 'Engineering', 'Business', 'Computing', 'Design', 'Actuarial Science'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#1A3A6B',
    tag: '5-Star SETARA',
    founded: '1993',
    students: '12,000+',
    ranking: 'QS World Top 401+ | 5-Star SETARA',
    description: 'One of Malaysia\'s highest-rated universities with a 5-Star SETARA rating. APU is especially strong in technology and computing, with students from over 130 countries making it one of the most diverse campuses in Malaysia.',
    highlights: ['5-Star SETARA Rating', '130+ Nationalities on Campus', 'QS Top 401+', 'Strong IT & Computing', 'Excellent Graduate Employability', 'Modern KL Campus'],
    campusImage: '/images/AsiaPacificUniversity.jpeg',
    logoColor: '#1A3A6B',
    campusTourVideo: 'https://www.youtube.com/embed/OhmGgJV9qNI',
    website: 'https://www.apu.edu.my',
  },
  {
    name: 'INTI International University',
    shortName: 'INTI',
    location: 'Nilai, Negeri Sembilan',
    type: 'Private',
    programmes: ['Business', 'Engineering', 'Computing', 'Hospitality', 'Health Sciences'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#CC4400',
    tag: 'International Network',
    founded: '1986',
    students: '8,000+',
    ranking: 'Top 5 Private Universities in Malaysia',
    description: 'With campuses in Nilai and Subang Jaya, INTI offers globally recognised qualifications through its international university partnerships. Students can transfer credits or complete degrees at partner universities worldwide.',
    highlights: ['International Transfer Programmes', 'Partner Universities Worldwide', 'Nilai & Subang Campuses', 'Top 5 Private Universities', 'Strong Hospitality School', 'Hope Education Group'],
    campusImage: '/images/INTIUniversity.jpeg',
    logoColor: '#CC4400',
    campusTourVideo: 'https://www.youtube.com/embed/W1himgzsyLQ',
    website: 'https://newinti.edu.my',
  },
  {
    name: 'SEGi University',
    shortName: 'SEGi',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Dentistry', 'Business', 'Engineering', 'IT', 'Pharmacy'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#006400',
    tag: 'Affordable',
    founded: '1977',
    students: '9,000+',
    ranking: 'SETARA Tier 5',
    description: 'One of Malaysia\'s oldest private institutions, SEGi offers affordable education across medicine, dentistry, engineering and business. Multiple campuses across Malaysia make it accessible to students nationwide.',
    highlights: ['Established 1977', 'Affordable Fees', 'Top Dentistry School', 'Multiple Campuses', 'Medicine & Pharmacy', 'Strong Industry Links'],
    campusImage: '/images/SEGiUniversity.jpeg',
    logoColor: '#006400',
    campusTourVideo: 'https://www.youtube.com/embed/6mnJu2Oy7OI',
    website: 'https://www.segi.edu.my',
  },
  {
    name: 'University of Cyberjaya (UOC)',
    shortName: 'UoC',
    location: 'Cyberjaya, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Pharmacy', 'IT', 'Business', 'Health Sciences', 'Nursing', 'Biomedical Engineering'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#005A8B',
    tag: 'Health Focus',
    founded: '2005',
    students: '4,000+',
    ranking: 'QS Top 601+ | 5-Star SETARA',
    description: "Located in Malaysia's smart city Cyberjaya, UoC is a premier health sciences university with a 5-Star SETARA rating. It excels in Medicine, Pharmacy, and Nursing with a state-of-the-art eco-friendly campus.",
    highlights: ['5-Star SETARA Rating', 'Top Medicine & Health Sciences', 'Eco-Friendly Smart Campus', 'QS Top 601+', 'Top 200 Global Health SDG Ranking', 'Located in Cyberjaya'],
    campusImage: '/images/UniversityOfCyberjaya.jpeg',
    logoColor: '#005A8B',
    campusTourVideo: 'https://www.youtube.com/embed/irmFggZ7DN4',
    website: 'https://cyberjaya.edu.my',
  },
  {
    name: 'UCSI University',
    shortName: 'UCSI',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Medicine', 'Pharmacy', 'Architecture', 'Music', 'Business', 'Engineering', 'Computer Science'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#1B5E20',
    tag: 'QS Ranked',
    founded: '1986',
    students: '10,000+',
    ranking: 'QS World Top 601+',
    description: 'A leading private university in KL offering over 100 programmes. UCSI is especially renowned for its Medicine, Pharmacy, and Architecture programmes, and boasts a rooftop bar and vibrant student life.',
    highlights: ['QS World Ranked', 'Top Medicine & Pharmacy', 'Award-Winning Architecture', 'Rooftop Campus Facilities', 'Strong Alumni Network', 'Located in KL'],
    campusImage: '/images/UCSIUniversity.jpeg',
    logoColor: '#1B5E20',
    campusTourVideo: 'https://www.youtube.com/embed/07RlVINKWU4',
    website: 'https://www.ucsiuniversity.edu.my',
  },
  ];

const UniversityModal = memo(function UniversityModal({ uni, onClose }: { uni: University; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[900px] max-h-[85dvh] overflow-y-auto rounded-3xl"
        style={{ background: 'linear-gradient(135deg, #031D4C 0%, #052458 100%)', border: '1px solid rgb(var(--color-gold) / 0.3)', WebkitOverflowScrolling: 'touch' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close university details"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-cream/70 hover:text-cream transition-colors"
          style={{ background: 'rgb(var(--color-gold) / 0.1)' }}
        >
          ✕
        </button>

        {/* Hero image */}
        <div className="relative h-[220px] overflow-hidden rounded-t-3xl">
          <img src={uni.campusImage} alt={uni.name} width={900} height={220} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-600 ease-out hover:scale-[1.08]" onError={(e) => { e.currentTarget.style.opacity = '0.15'; }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,30,66,1) 0%, transparent 60%)' }} />
          <div className="absolute bottom-4 left-6 right-16">
            <span className="px-3 py-1 rounded-full text-[10px] font-body uppercase tracking-widest mb-2 inline-block"
              style={{ background: uni.type === 'Public' ? 'rgba(212,248,122,0.2)' : 'rgb(var(--color-gold) / 0.2)', color: uni.type === 'Public' ? '#D4F87A' : 'rgb(var(--color-gold))', border: `1px solid ${uni.type === 'Public' ? 'rgba(212,248,122,0.4)' : 'rgb(var(--color-gold) / 0.4)'}` }}>
              {uni.type} University
            </span>
            <h2 className="font-display font-bold text-kimono" style={{ fontSize: 'clamp(20px, 3vw, 32px)', letterSpacing: '0.02em' }}>{uni.name}</h2>
            <p className="font-body text-mouse text-sm mt-1">📍 {uni.location}</p>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-2xl" style={{ background: 'rgb(var(--color-gold) / 0.08)', border: '1px solid rgb(var(--color-gold) / 0.15)' }}>
            {[
              { label: 'Founded', value: uni.founded },
              { label: 'Students', value: uni.students },
              { label: 'Ranking', value: uni.ranking },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-display font-bold text-gold text-lg">{stat.value}</p>
                <p className="font-body text-mouse text-xs uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left */}
            <div>
              <h3 className="font-body font-semibold text-gold mb-3 uppercase tracking-widest text-xs">About</h3>
              <p className="font-serif font-light text-cream/75 text-sm leading-relaxed mb-6">{uni.description}</p>

              <h3 className="font-body font-semibold text-gold mb-3 uppercase tracking-widest text-xs">Programmes</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {uni.programmes.map(p => (
                  <span key={p} className="text-[11px] px-3 py-1 rounded-full font-body text-cream/70" style={{ background: 'rgb(var(--color-gold) / 0.07)', border: '1px solid rgb(var(--color-gold) / 0.1)' }}>{p}</span>
                ))}
              </div>

              <h3 className="font-body font-semibold text-gold mb-3 uppercase tracking-widest text-xs">Study Levels</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {uni.studyLevels.map(s => (
                  <span key={s} className="text-[11px] px-3 py-1 rounded-full font-body text-cream/70" style={{ background: 'rgb(var(--color-gold) / 0.07)', border: '1px solid rgb(var(--color-gold) / 0.1)' }}>{s}</span>
                ))}
              </div>

              <h3 className="font-body font-semibold text-gold mb-3 uppercase tracking-widest text-xs">Highlights</h3>
              <ul className="space-y-2">
                {uni.highlights.map(h => (
                  <li key={h} className="flex items-center gap-2 text-cream/70 text-sm font-body">
                    <span style={{ color: 'rgb(var(--color-gold))' }}>✓</span> {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - Video */}
            <div>

              <a
                href={`https://wa.me/60175631621?text=Hi, I'm interested in studying at ${uni.name}. Please help me with the application.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-body text-sm uppercase tracking-widest text-kimono transition-all duration-300 hover:scale-[1.02] mb-3"
                style={{ background: '#25D366' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Apply via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const UniversityCard = memo(function UniversityCard({ uni, index, onClick }: { uni: University; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: (index % 4) * 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  }, [index]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className="rounded-xl p-6 flex flex-col gap-4 cursor-pointer group"
      style={{
        opacity: 0,
        background: 'rgb(var(--color-gold) / 0.03)',
        border: '1px solid rgb(var(--color-gold) / 0.07)',
        transition: 'border-color 300ms ease, transform 300ms ease, background 300ms ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.borderColor = `${uni.accent}60`;
        el.style.transform = 'translateY(-6px)';
        el.style.background = 'rgb(var(--color-gold) / 0.06)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.borderColor = 'rgb(var(--color-gold) / 0.07)';
        el.style.transform = 'translateY(0)';
        el.style.background = 'rgb(var(--color-gold) / 0.03)';
      }}
    >

      <div className="flex items-start justify-between gap-2">
        <span className="px-2 py-1 rounded-full text-[9px] font-body uppercase tracking-wider flex-shrink-0"
          style={{ background: `${uni.accent}30`, color: 'rgb(var(--color-gold))', border: `1px solid ${uni.accent}40` }}>
          {uni.tag}
        </span>
        <span className="text-[10px] font-body uppercase tracking-wider"
          style={{ color: uni.type === 'Public' ? '#D4F87A' : 'rgb(var(--color-gold))' }}>
          {uni.type}
        </span>
      </div>

      <div>
        <h3 className="font-body font-semibold text-kimono leading-snug" style={{ fontSize: 'clamp(14px, 1.5vw, 16px)' }}>{uni.name}</h3>
        <p className="font-body text-mouse text-xs mt-1 flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          {uni.location}
        </p>
      </div>

      <div className="flex flex-wrap gap-1">
        {uni.programmes.slice(0, 4).map(p => (
          <span key={p} className="text-[9px] px-2 py-0.5 rounded font-body text-mouse" style={{ background: 'rgb(var(--color-gold) / 0.05)' }}>{p}</span>
        ))}
        {uni.programmes.length > 4 && (
          <span className="text-[9px] px-2 py-0.5 rounded font-body text-gold/60" style={{ background: 'rgb(var(--color-gold) / 0.08)' }}>+{uni.programmes.length - 4} more</span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-[10px] font-body text-mouse">{uni.ranking}</span>
        <span className="text-[11px] font-body text-gold/70 group-hover:text-gold transition-colors flex items-center gap-1">
          View Details
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </span>
      </div>
    </div>
  );
});

export default function UniversitiesSection() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }, []);

  const closeModal = useCallback(() => setSelectedUni(null), []);
  const handleCardClick = useCallback((uni: University) => () => setSelectedUni(uni), []);
  const goExplore = useCallback(() => { window.scrollTo({ top: 0 }); navigate('/explore'); }, [navigate]);

  return (
    <>
      {selectedUni && <UniversityModal uni={selectedUni} onClose={closeModal} />}

      <section className="relative w-full py-32 lg:py-44" id="destinations"
        style={{ backgroundColor: 'rgb(var(--color-mist))', backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(11,42,92,0.6) 0%, transparent 60%)' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">

          <div className="mb-8 lg:mb-10">
            <SectionLabel name="OUR PARTNER UNIVERSITIES" />
          </div>

          {/* Header */}
          <div ref={headerRef} className="mb-16" style={{ opacity: 0 }}>
            <div className="hairline-draw w-16 h-px mb-8" style={{ background: 'rgb(var(--color-gold) / 0.5)' }} />
            <h2 className="font-display font-bold text-kimono uppercase"
              style={{ fontSize: 'clamp(36px, 6.5vw, 80px)', letterSpacing: '0.05em', lineHeight: 1.05 }}>
              <ScrambledText text="OUR PARTNER" /><br />
              <ScrambledText text="UNIVERSITIES" style={{ WebkitTextStroke: '1px rgb(var(--color-gold) / 0.5)', color: 'transparent' }} />
            </h2>
            <p className="font-serif font-light text-cream/60 mt-6 max-w-[560px]" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.75 }}>
              We are officially partnered with Malaysia's leading universities. Click any university to explore campus photos, programmes, and watch the campus tour video.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              {['Free Offer Letter', '99% Visa Rate', 'Certified Counsellors', 'End-to-End Support'].map(badge => (
                <span key={badge} className="px-4 py-2 rounded-full text-[11px] font-body uppercase tracking-wider"
                  style={{ border: '1px solid rgb(var(--color-gold) / 0.4)', color: 'rgb(var(--color-gold))' }}>
                  ✓ {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {universities.map((uni, i) => (
              <UniversityCard key={uni.name} uni={uni} index={i} onClick={handleCardClick(uni)} />
            ))}
          </div>

          {/* Explore More Universities */}
          <div className="mt-16 text-center">
            <button
              onClick={goExplore}
              className="pill-button pill-button-outline"
            >
              Explore More Universities ▼
            </button>
            <p className="font-body text-cream/70 text-xs mt-3">30+ Universities available</p>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <p className="font-serif font-light text-cream/70 mb-8" style={{ fontSize: '16px' }}>
              Don't see your preferred university? We work with 30+ partner universities in Malaysia.
            </p>
            <button
              className="pill-button pill-button-outline"
              onClick={() => {
                const el = document.querySelector('#contact') as HTMLElement | null;
                if (el) {
                  const lenis = getLenis();
                  if (lenis) lenis.scrollTo(el, { offset: -80 });
                  else el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Ask About Your University
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
