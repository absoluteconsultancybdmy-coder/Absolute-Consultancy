import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrambledText from '../components/ScrambledText';
import { getLenis } from '../hooks/useLenis';
import SectionLabel from '../components/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

const WA_NUMBER = '60175631621';

type Level = 'Foundation' | 'Diploma' | 'Bachelor' | 'Master' | 'PhD';
type FieldKey = 'Business' | 'IT & Engineering' | 'Health Sciences' | 'Arts & Design' | 'Other';
type CityKey = 'Kuala Lumpur' | 'Selangor' | 'Negeri Sembilan' | 'Perak' | 'Any';

interface MatcherUni {
  name: string;
  shortName: string;
  city: Exclude<CityKey, 'Any'>;
  programmes: string[];
  studyLevels: string[];
  ranking: string;
  campusImage: string;
}

const LEVELS: Level[] = ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'];
const FIELDS: FieldKey[] = ['Business', 'IT & Engineering', 'Health Sciences', 'Arts & Design', 'Other'];
const CITIES: CityKey[] = ['Kuala Lumpur', 'Selangor', 'Negeri Sembilan', 'Perak', 'Any'];

const FIELD_KEYWORDS: Record<FieldKey, string[]> = {
  'Business': ['Business', 'Accounting', 'Finance', 'Marketing', 'MBA', 'Management', 'Actuarial', 'Banking'],
  'IT & Engineering': [
    'IT', 'Computing', 'Computer Science', 'Engineering', 'Cybersecurity', 'Artificial Intelligence',
    'Robotics', 'Multimedia', 'Animation & VFX', 'Information Technology', 'Software', 'Data Analytics',
  ],
  'Health Sciences': [
    'Medicine', 'Pharmacy', 'Nursing', 'Health Sciences', 'Biomedical', 'Dentistry',
    'Physiotherapy', 'Dietetics', 'Medical', 'Optometry', 'Cosmetics', 'Environmental Health',
  ],
  'Arts & Design': [
    'Design', 'Fine Arts', 'Graphic Design', 'Architecture', 'Music', 'Fashion', 'Creative Arts',
    'Animation', 'Film', 'Advertising', 'Broadcasting', 'Visual Communication', 'Illustration',
    'Digital Art', 'Public Relations', 'Mass Communication', 'Communication', 'Cinematic', 'Hospitality',
  ],
  'Other': [],
};

const MATCHER_DATA: MatcherUni[] = [
  {
    name: 'Asia Pacific University of Technology & Innovation (APU)',
    shortName: 'APU',
    city: 'Kuala Lumpur',
    programmes: ['IT & Computing', 'Engineering', 'Business', 'Design & Media', 'Actuarial Science', 'Accounting & Finance', 'Psychology', 'Architecture', 'Animation & VFX', 'Petroleum Engineering'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'QS World Top 401+ | 5-Star SETARA',
    campusImage: '/images/AsiaPacificUniversity.jpeg',
  },
  {
    name: "Taylor's University",
    shortName: "Taylor's",
    city: 'Selangor',
    programmes: ['Hospitality & Tourism', 'Law', 'Architecture', 'Business & Finance', 'Medicine', 'Engineering', 'Education', 'Pharmacy', 'Computer Science', 'Biosciences', 'Media & Communication', 'Psychology', 'Design', 'Actuarial Studies', 'Biotechnology'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'QS World #253 (2026)',
    campusImage: '/images/TaylorUniversity.jpeg',
  },
  {
    name: 'Sunway University',
    shortName: 'Sunway',
    city: 'Selangor',
    programmes: ['Business', 'Sciences', 'Arts', 'Computing', 'Law', 'Medical Sciences', 'Hospitality'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'QS World #253 (2026)',
    campusImage: '/images/SunWayUniversity.jpeg',
  },
  {
    name: 'Monash University Malaysia',
    shortName: 'Monash',
    city: 'Selangor',
    programmes: ['Medicine', 'Engineering', 'Business', 'IT', 'Pharmacy', 'Arts', 'Computer Science'],
    studyLevels: ['Foundation', 'Bachelor', 'Master', 'PhD'],
    ranking: 'QS World #42 (2026)',
    campusImage: '/images/MonashUniversity.jpeg',
  },
  {
    name: 'UCSI University',
    shortName: 'UCSI',
    city: 'Kuala Lumpur',
    programmes: ['Medicine', 'Pharmacy', 'Architecture', 'Music', 'Business', 'Engineering', 'Computer Science'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'QS World Top 601+',
    campusImage: '/images/UCSIUniversity.jpeg',
  },
  {
    name: 'SEGi University',
    shortName: 'SEGi',
    city: 'Selangor',
    programmes: ['Medicine', 'Dentistry', 'Business & Accounting', 'Engineering', 'IT', 'Pharmacy', 'Education', 'Psychology', 'Optometry', 'Physiotherapy', 'Nursing', 'Law', 'Creative Arts', 'Communication Studies', 'Biomedical Science', 'Hospitality & Culinary Arts'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'SETARA Tier 5',
    campusImage: '/images/SEGiUniversity.jpeg',
  },
  {
    name: 'University of Cyberjaya (UoC)',
    shortName: 'UoC',
    city: 'Selangor',
    programmes: ['Medicine', 'Pharmacy', 'Nursing', 'IT', 'Business', 'Health Sciences', 'Biomedical Engineering', 'Psychology', 'Education', 'Mass Communication', 'Multimedia & Animation', 'Dietetics', 'Occupational Safety & Health', 'Physiotherapy', 'Cosmetics'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'QS Top 601+ | 5-Star SETARA',
    campusImage: '/images/UniversityOfCyberjaya.jpeg',
  },
  {
    name: 'INTI International University',
    shortName: 'INTI',
    city: 'Negeri Sembilan',
    programmes: ['Business', 'Engineering', 'Computing & IT', 'Hospitality & Culinary', 'Health Sciences', 'Arts & Design', 'Mass Communication', 'Pre-University', 'Biotechnology', 'Accounting', 'American Degree Transfer'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'Top 5 Private Universities in Malaysia',
    campusImage: '/images/INTIUniversity.jpeg',
  },
  {
    name: 'MAHSA University',
    shortName: 'MAHSA',
    city: 'Selangor',
    programmes: ['Medicine', 'Nursing', 'Pharmacy', 'Engineering', 'Dentistry', 'Business', 'IT', 'Physiotherapy', 'Biomedical Sciences', 'Accounting', 'Architecture', 'Hospitality', 'Education', 'Biotechnology', 'Medical Imaging', 'Environmental Health', 'Quantity Surveying'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'MQA Accredited | 5-Star SETARA',
    campusImage: '/images/Mahsa.jpeg',
  },
  {
    name: 'Heriot-Watt University Malaysia',
    shortName: 'HW',
    city: 'Selangor',
    programmes: ['Engineering', 'Business', 'Computer Science', 'Actuarial Science', 'Psychology', 'Architecture', 'Data Analytics'],
    studyLevels: ['Foundation', 'Bachelor', 'Master', 'PhD'],
    ranking: 'QS World #256 (2026)',
    campusImage: '/images/HeriotWatt.jpeg',
  },
  {
    name: 'Multimedia University (MMU)',
    shortName: 'MMU',
    city: 'Selangor',
    programmes: ['Computer Science', 'Engineering', 'Creative Multimedia', 'Business & Management', 'Law', 'Cinematic Arts', 'Animation & VFX', 'Accounting', 'Marketing', 'Robotics', 'Artificial Intelligence', 'Cybersecurity'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'QS Asia #207 (2025)',
    campusImage: '/images/MMU.jpeg',
  },
  {
    name: 'International Islamic University Malaysia (IIUM)',
    shortName: 'IIUM',
    city: 'Selangor',
    programmes: ['Islamic Studies', 'Law', 'Engineering', 'Medicine', 'Economics', 'IT', 'Architecture', 'Education', 'Accounting'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'QS World Top 601+',
    campusImage: '/images/IIUM.jpeg',
  },
  {
    name: 'Universiti Kuala Lumpur (UniKL)',
    shortName: 'UniKL',
    city: 'Kuala Lumpur',
    programmes: ['Engineering', 'IT', 'Business', 'Aviation', 'Medical Sciences', 'Design', 'Architecture'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'MQA Accredited',
    campusImage: '/images/UniversityKualaLumpur.jpeg',
  },
  {
    name: 'City University Malaysia',
    shortName: 'City',
    city: 'Selangor',
    programmes: ['Business', 'IT', 'Engineering', 'Design', 'Hospitality', 'Mass Communication'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'MQA Accredited | SETARA Tier 5',
    campusImage: '/images/CityUniversity.jpeg',
  },
  {
    name: 'Nilai University',
    shortName: 'Nilai',
    city: 'Negeri Sembilan',
    programmes: ['Business & Management', 'Accounting & Finance', 'Engineering', 'Hospitality & Culinary', 'Nursing', 'IT & Computer Science', 'Education', 'Biotechnology', 'Aircraft Maintenance', 'Digital Marketing'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'MQA Accredited | SETARA Tier 5',
    campusImage: '/images/NilaiUniversity.jpeg',
  },
  {
    name: 'UNITAR International University',
    shortName: 'UNITAR',
    city: 'Perak',
    programmes: ['Business', 'IT', 'Engineering', 'Education', 'Communication', 'Chinese Studies', 'Design'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'MQA Accredited',
    campusImage: '/images/UNITAR.jpeg',
  },
  {
    name: 'Lincoln University College',
    shortName: 'Lincoln',
    city: 'Selangor',
    programmes: ['Medicine', 'Pharmacy', 'Dentistry', 'Business', 'IT', 'Engineering', 'Nursing'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'QS World Top 501+ (2026)',
    campusImage: '/images/LincolnUniversityCollage.jpeg',
  },
  {
    name: 'ALFA University College',
    shortName: 'Alfa',
    city: 'Selangor',
    programmes: ['Business', 'Education', 'Design', 'Health Sciences', 'Pre-University', 'Information Technology'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    ranking: 'MQA Accredited',
    campusImage: '/images/AlfaUniversity.jpeg',
  },
];

function fieldMatchesProgrammes(uni: MatcherUni, field: FieldKey): boolean {
  if (field === 'Other') return true;
  const keywords = FIELD_KEYWORDS[field];
  return uni.programmes.some((p) =>
    keywords.some((k) => p.toLowerCase().includes(k.toLowerCase()))
  );
}

interface Scored {
  uni: MatcherUni;
  score: number;
  levelOk: boolean;
  fieldOk: boolean;
  cityOk: boolean;
}

function scoreUnis(level: Level, field: FieldKey, city: CityKey, data: MatcherUni[]): Scored[] {
  const scored: Scored[] = data.map((uni) => {
    const levelOk = uni.studyLevels.includes(level);
    const fieldOk = fieldMatchesProgrammes(uni, field);
    const cityOk = city === 'Any' || uni.city === city;
    const score = (levelOk ? 2 : 0) + (fieldOk ? 3 : 0) + (cityOk ? 1 : 0);
    return { uni, score, levelOk, fieldOk, cityOk };
  });
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.uni.name.localeCompare(b.uni.name);
  });
  return scored;
}

function PillButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-5 py-2.5 rounded-full font-body text-[13px] tracking-wide transition-all duration-300 focus:outline-none"
      style={{
        background: active ? 'rgb(var(--color-gold))' : 'rgb(var(--color-gold) / 0.04)',
        color: active ? '#031D4C' : disabled ? 'rgb(var(--color-gold) / 0.25)' : 'var(--color-kimono)',
        border: active ? '1px solid rgb(var(--color-gold))' : '1px solid rgb(var(--color-gold) / 0.12)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: active ? 600 : 400,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

function ResultCard({ uni, onView }: { uni: MatcherUni; onView: () => void }) {
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hi, I'm interested in studying at ${uni.name}. Please help me with the application.`
  )}`;

  return (
    <div
      className="on-navy rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: 'rgb(var(--color-gold) / 0.04)',
        border: '1px solid rgb(var(--color-gold) / 0.25)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
          style={{ border: '1px solid rgb(var(--color-gold) / 0.3)' }}
        >
          <img
            src={uni.campusImage}
            alt={uni.name}
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.opacity = '0.15';
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-body font-semibold text-kimono leading-snug" style={{ fontSize: 14 }}>
            {uni.name}
          </h4>
          <p className="font-body text-mouse text-xs mt-1">📍 {uni.city}</p>
          <p className="font-body text-gold/80 text-[11px] mt-1">{uni.ranking}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {uni.programmes.slice(0, 3).map((p) => (
          <span
            key={p}
            className="text-[10px] px-2 py-0.5 rounded-full font-body text-cream/70"
            style={{ background: 'rgb(var(--color-gold) / 0.06)', border: '1px solid rgb(var(--color-gold) / 0.08)' }}
          >
            {p}
          </span>
        ))}
        {uni.programmes.length > 3 && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-body text-gold/60"
            style={{ background: 'rgb(var(--color-gold) / 0.08)' }}
          >
            +{uni.programmes.length - 3} more
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-1">
        <button
          type="button"
          onClick={onView}
          className="flex-1 py-2.5 rounded-full font-body text-[11px] uppercase tracking-widest transition-all duration-200 focus:outline-none"
          style={{
            background: 'transparent',
            color: 'var(--color-gold)',
            border: '1px solid rgb(var(--color-gold) / 0.4)',
          }}
        >
          View Details
        </button>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-body text-[11px] uppercase tracking-widest text-kimono transition-transform duration-200 hover:scale-[1.02] focus:outline-none"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Apply via WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function MatcherSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepperRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [level, setLevel] = useState<Level | null>(null);
  const [field, setField] = useState<FieldKey | null>(null);
  const [city, setCity] = useState<CityKey | null>(null);
  const [showResults, setShowResults] = useState(false);

  const step = level === null ? 0 : field === null ? 1 : city === null ? 2 : 3;
  const totalSteps = 3;

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
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
      }
      if (stepperRef.current) {
        gsap.fromTo(
          stepperRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const results = useMemo(() => {
    if (!showResults || !level || !field || !city) return [];
    const scored = scoreUnis(level, field, city, MATCHER_DATA);
    return scored.filter((s) => s.score > 0).slice(0, 5);
  }, [level, field, city, showResults]);

  const fallbackResults = useMemo(() => {
    if (!showResults || !level || !field || !city) return [];
    const scored = scoreUnis(level, field, city, MATCHER_DATA);
    return scored.slice(0, 5);
  }, [level, field, city, showResults]);

  useEffect(() => {
    if (!showResults || !resultsRef.current) return;
    const cards = resultsRef.current.querySelectorAll('.matcher-card');
    if (cards.length === 0) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out' }
    );
  }, [showResults, results.length]);

  const handleReset = () => {
    setLevel(null);
    setField(null);
    setCity(null);
    setShowResults(false);
  };

  const handleView = () => {
    window.scrollTo({ top: 0 });
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    navigate('/explore');
  };

  const stepLabels: Array<{ title: string; subtitle: string }> = [
    { title: 'What level of study?', subtitle: 'Foundation · Diploma · Bachelor · Master · PhD' },
    { title: 'What field interests you?', subtitle: 'Pick the area closest to your goal' },
    { title: 'Preferred city?', subtitle: 'Where would you like to study?' },
  ];

  const progressPct = showResults ? 100 : Math.min(100, (step / totalSteps) * 100);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 lg:py-44 overflow-hidden"
      id="matcher"
    >
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(11,42,92,0.55) 0%, transparent 60%), linear-gradient(180deg, #021029 0%, #031D4C 100%)',
          }}
        />
      </div>



      <div className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-10">
        <div className="mb-8 lg:mb-10">
          <SectionLabel name="Match Me" />
        </div>
        <div ref={headerRef} className="mb-14" style={{ opacity: 0 }}>
          <div className="hairline-draw w-16 h-px mb-8" style={{ background: 'rgb(var(--color-gold) / 0.5)' }} />
          <p
            className="font-body uppercase tracking-[0.25em] text-gold/80 mb-4"
            style={{ fontSize: 12 }}
          >
            FIND YOUR FIT
          </p>
          <h2
            className="font-display font-bold text-kimono uppercase"
            style={{
              fontSize: 'clamp(32px, 5.5vw, 64px)',
              letterSpacing: '0.04em',
              lineHeight: 1.05,
            }}
          >
            <ScrambledText text="Which Malaysian university" />
            <br />
            <ScrambledText
              text="is right for you?"
              style={{ WebkitTextStroke: '1px rgb(var(--color-gold) / 0.5)', color: 'transparent' }}
            />
          </h2>
          <p
            className="font-serif font-light text-cream/60 mt-6 max-w-[560px]"
            style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', lineHeight: 1.7 }}
          >
            Answer three quick questions and we'll match you with universities that fit your goals.
          </p>
        </div>

        <div ref={stepperRef} style={{ opacity: 0 }}>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p
                className="small-caps text-mouse tracking-[0.2em]"
                style={{ fontSize: 11 }}
              >
                {showResults
                  ? 'Your Matches'
                  : `Step ${Math.min(step + 1, totalSteps)} of ${totalSteps}`}
              </p>
              {showResults && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="small-caps text-gold/70 hover:text-gold tracking-[0.2em] transition-colors duration-200"
                  style={{ fontSize: 11 }}
                >
                  Reset
                </button>
              )}
            </div>
            <div
              className="w-full h-[2px] rounded-full overflow-hidden"
              style={{ background: 'rgb(var(--color-gold) / 0.08)' }}
            >
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, rgb(var(--color-gold)) 0%, #D4AF37 100%)',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
          </div>

          {!showResults && step < 3 && (
            <div
              className="rounded-3xl p-8 lg:p-10"
              style={{
                background: 'rgb(var(--color-gold) / 0.03)',
                border: '1px solid rgb(var(--color-gold) / 0.2)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              <h3
                className="font-display font-semibold text-kimono mb-2"
                style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', letterSpacing: '0.02em' }}
              >
                {stepLabels[step].title}
              </h3>
              <p
                className="font-body text-mouse text-sm mb-8"
                style={{ letterSpacing: '0.04em' }}
              >
                {stepLabels[step].subtitle}
              </p>

              <div className="flex flex-wrap gap-3">
                {(step === 0
                  ? LEVELS
                  : step === 1
                  ? FIELDS
                  : CITIES
                ).map((option) => {
                  const current =
                    step === 0
                      ? level === option
                      : step === 1
                      ? field === option
                      : city === option;
                  return (
                    <PillButton
                      key={option}
                      active={!!current}
                      onClick={() => {
                        if (step === 0) setLevel(option as Level);
                        else if (step === 1) setField(option as FieldKey);
                        else {
                          setCity(option as CityKey);
                          setShowResults(true);
                        }
                      }}
                    >
                      {option}
                    </PillButton>
                  );
                })}
              </div>
            </div>
          )}

          {showResults && (
            <div ref={resultsRef}>
              {results.length === 0 ? (
                <div
                  className="rounded-3xl p-10 text-center"
                  style={{
                    background: 'rgb(var(--color-gold) / 0.03)',
                    border: '1px solid rgb(var(--color-gold) / 0.08)',
                  }}
                >
                  <p className="font-serif text-cream/70 text-lg mb-2">
                    No exact matches for these filters.
                  </p>
                  <p className="font-body text-mouse text-sm mb-6">
                    Here are some strong alternatives that come close.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                    {fallbackResults.map(({ uni }) => (
                      <div key={uni.name} className="matcher-card">
                        <ResultCard uni={uni} onView={handleView} />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="pill-button pill-button-outline mt-10"
                  >
                    Try Different Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map(({ uni }) => (
                      <div key={uni.name} className="matcher-card">
                        <ResultCard uni={uni} onView={handleView} />
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-10">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="pill-button pill-button-outline"
                    >
                      Find Another Match
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
