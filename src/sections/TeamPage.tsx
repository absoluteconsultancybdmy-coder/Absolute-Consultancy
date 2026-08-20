import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
  name: string;
  role: string;
  photo: string | null;
  monogram: string;
  bio: string;
  credentials: string;
}

interface Pillar {
  label: string;
  title: string;
  body: string;
  icon: 'mission' | 'vision' | 'values';
}

interface TeamStat {
  value: number;
  suffix: string;
  label: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Kazi Mahir Muhtasib',
    role: 'Chief Operating Officer',
    photo: `${import.meta.env.BASE_URL}images/coo-profile.png`,
    monogram: 'KM',
    bio: 'Mahir founded Absolute Consultancy Firm after experiencing the Malaysian education system firsthand. A graduate of Multimedia University (MMU), he has personally guided 200+ students through their journey from Bangladesh to Malaysia. Speaks Bengali, English, and Malay.',
    credentials: 'MMU Alumnus | 6+ years in education consulting',
  },
  {
    name: 'Tasnim Ahmed',
    role: 'Senior Education Counsellor',
    photo: null,
    monogram: 'TA',
    bio: "Tasnim leads our counselling team and personally matches each student with the right university and programme. She holds a Master's in Education from the University of Malaya and has helped students gain admission to 25+ Malaysian universities.",
    credentials: 'MEd, University of Malaya | 4+ years counselling',
  },
  {
    name: 'Rifat Khan',
    role: 'Visa & Compliance Specialist',
    photo: null,
    monogram: 'RK',
    bio: 'Rifat handles every EMGS application and ensures your visa process goes smoothly. Former EMGS officer with deep knowledge of Malaysian immigration. Has processed 500+ student visas with a 99% approval rate.',
    credentials: 'Former EMGS Officer | 500+ visas processed',
  },
  {
    name: 'Nadia Sultana',
    role: 'Student Success Manager',
    photo: null,
    monogram: 'NS',
    bio: "Nadia is your point of contact once you arrive in Malaysia. From airport pickup to university registration, she ensures every student feels supported. A Taylor's University alumna, she's been in your shoes.",
    credentials: "Taylor's Alumna | On-ground KL support",
  },
];

const PILLARS: Pillar[] = [
  {
    label: 'Our Mission',
    title: 'Guide every student',
    body: 'To guide every Bangladeshi student to the right Malaysian university, with honesty, care, and personal attention — from the first call to graduation day and beyond.',
    icon: 'mission',
  },
  {
    label: 'Our Vision',
    title: 'A level playing field',
    body: 'A future where no Bangladeshi student is held back by where they started. Where talent, not background, decides who gets to study abroad.',
    icon: 'vision',
  },
  {
    label: 'Our Values',
    title: 'Students first, always',
    body: 'Honesty over hype. Students over commissions. Long-term relationships over short-term wins.',
    icon: 'values',
  },
];

const TEAM_STATS: TeamStat[] = [
  { value: 300, suffix: '+', label: 'Students Placed' },
  { value: 30, suffix: '+', label: 'Partner Universities' },
  { value: 99, suffix: '%', label: 'Visa Success Rate' },
  { value: 2, suffix: '+', label: 'Years of Experience' },
];

function PillarIcon({ kind }: { kind: Pillar['icon'] }) {
  if (kind === 'mission') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    );
  }
  if (kind === 'vision') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.39 4.84L20 8l-4 3.9.94 5.49L12 14.77 7.06 17.39 8 11.9 4 8l5.61-1.16L12 2z" />
    </svg>
  );
}

export default function TeamPage() {
  const navigate = useNavigate();
  const pillarsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  const pillars = useMemo(() => PILLARS, []);
  const members = useMemo(() => TEAM_MEMBERS, []);
  const stats = useMemo(() => TEAM_STATS, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll('.hero-stagger'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
        );
      }

      const pillarCards = pillarsRef.current?.querySelectorAll('.pillar-card');
      if (pillarCards && pillarCards.length) {
        gsap.fromTo(
          pillarCards,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: { trigger: pillarsRef.current, start: 'top 80%', toggleActions: 'play none none none' },
          }
        );
      }

      const teamCards = gridRef.current?.querySelectorAll('.team-card');
      if (teamCards && teamCards.length) {
        gsap.fromTo(
          teamCards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 78%', toggleActions: 'play none none none' },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!statsRef.current) return;
    const ctx = gsap.context(() => {
      stats.forEach((stat, i) => {
        const el = counterRefs.current[i];
        if (!el) return;
        if (prefersReducedMotion) {
          el.textContent = String(stat.value);
          return;
        }
        const obj = { val: 0 };
        gsap.fromTo(
          obj,
          { val: 0 },
          {
            val: stat.value,
            duration: 2,
            ease: 'power2.out',
            delay: i * 0.12,
            onUpdate() {
              el.textContent = String(Math.round(obj.val));
            },
            scrollTrigger: { trigger: statsRef.current, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );
      });
    }, statsRef);
    return () => ctx.revert();
  }, [stats, prefersReducedMotion]);

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    el.style.transition = 'transform 80ms ease-out, border-color 200ms ease, background 200ms ease, box-shadow 250ms ease';
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    el.style.borderColor = 'rgb(var(--color-gold) / 0.55)';
    el.style.background = 'rgb(var(--color-gold) / 0.06)';
    el.style.boxShadow = '0 25px 50px rgba(0,0,0,0.45), 0 0 0 1px rgb(var(--color-gold) / 0.35), inset 0 1px 0 rgb(var(--color-gold) / 0.15)';
    const dot = el.querySelector('.tilt-dot') as HTMLElement | null;
    if (dot) {
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      dot.style.opacity = '1';
    }
  };

  const handleTiltEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!prefersReducedMotion) return;
    e.currentTarget.style.transform = 'translateY(-6px)';
    e.currentTarget.style.borderColor = 'rgb(var(--color-gold) / 0.4)';
    e.currentTarget.style.background = 'rgb(var(--color-gold) / 0.06)';
  };

  const handleTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transition = 'transform 500ms ease, border-color 400ms ease, background 400ms ease, box-shadow 400ms ease';
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    el.style.borderColor = 'rgb(var(--color-gold) / 0.07)';
    el.style.background = 'rgb(var(--color-gold) / 0.03)';
    el.style.boxShadow = 'none';
    const dot = el.querySelector('.tilt-dot') as HTMLElement | null;
    if (dot) dot.style.opacity = '0';
  };

  const goToContact = () => {
    sessionStorage.setItem('scrollToSection', 'contact');
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'rgb(var(--color-mist))' }}>
      <div
        className="sticky top-0 z-50"
        style={{ background: 'rgba(11,26,51,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgb(var(--color-gold) / 0.15)' }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 overflow-x-auto flex-nowrap scrollbar-none flex-shrink-0 max-w-full">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-gold/70 hover:text-gold transition-colors cursor-pointer font-body text-xs uppercase tracking-wider px-2 py-1.5 rounded-lg hover:bg-cream/5 flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Back
            </button>
            <div className="w-px h-4 mx-1 flex-shrink-0" style={{ background: 'rgb(var(--color-gold) / 0.2)' }} />
            {([
              { label: 'About', id: 'about', active: false },
              { label: 'Services', id: 'services', active: false },
              { label: 'Pathways', id: 'destinations', active: false },
              { label: 'Stories', id: 'testimonials', active: false },
              { label: 'Team', id: 'team', active: true },
              { label: 'Contact', id: 'contact', active: false },
            ] as const).map(({ label, id, active }) => (
              <button
                key={label}
                onClick={() => {
                  if (active) return;
                  sessionStorage.setItem('scrollToSection', id);
                  navigate('/');
                }}
                className={`transition-colors cursor-pointer font-body text-xs uppercase tracking-wider px-2 py-1.5 rounded-lg hover:bg-cream/5 whitespace-nowrap flex-shrink-0 ${
                  active ? 'text-gold' : 'text-cream/60 hover:text-gold'
                }`}
                style={active ? { background: 'rgb(var(--color-gold) / 0.1)', border: '1px solid rgb(var(--color-gold) / 0.3)' } : undefined}
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section
        ref={heroRef}
        className="relative w-full"
        style={{ minHeight: '25vh', padding: 'clamp(56px, 8vw, 96px) 0 clamp(32px, 4vw, 56px)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(var(--color-gold) / 0.10) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
          <p
            className="hero-stagger font-body uppercase tracking-[0.4em] text-gold/70 mb-4"
            style={{ fontSize: '11px', opacity: 0 }}
          >
            Meet The Team
          </p>
          <h1
            className="hero-stagger font-display font-bold text-kimono leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(36px, 6vw, 72px)', letterSpacing: '0.02em', opacity: 0 }}
          >
            The people behind <span className="text-gold">your journey</span>
          </h1>
          <p
            className="hero-stagger font-serif font-light text-cream/65 max-w-[640px]"
            style={{ fontSize: 'clamp(15px, 1.6vw, 19px)', lineHeight: 1.7, opacity: 0 }}
          >
            A small team with a big mission — to make world-class Malaysian education accessible to every Bangladeshi student who dreams of it.
          </p>
        </div>
      </section>

      <section ref={pillarsRef} className="relative w-full pb-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map((pillar) => (
              <article
                key={pillar.label}
                className="pillar-card rounded-2xl p-7 lg:p-8 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(11,30,66,0.7) 0%, rgba(11,42,92,0.55) 100%)',
                  border: '1px solid rgb(var(--color-gold) / 0.2)',
                  opacity: 0,
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                  style={{ background: 'rgb(var(--color-gold) / 0.12)', color: 'rgb(var(--color-gold))', border: '1px solid rgb(var(--color-gold) / 0.3)' }}
                >
                  <PillarIcon kind={pillar.icon} />
                </div>
                <p className="font-body uppercase tracking-[0.28em] text-gold/70 mb-3" style={{ fontSize: '10px' }}>
                  {pillar.label}
                </p>
                <h3
                  className="font-display font-bold text-kimono mb-4"
                  style={{ fontSize: 'clamp(20px, 2vw, 26px)', letterSpacing: '0.02em', lineHeight: 1.15 }}
                >
                  {pillar.title}
                </h3>
                <p className="font-serif font-light text-cream/70" style={{ fontSize: '15px', lineHeight: 1.75 }}>
                  {pillar.body}
                </p>
                <div
                  className="absolute -bottom-px left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent 0%, rgb(var(--color-gold) / 0.5) 50%, transparent 100%)' }}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative w-full pb-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
            <div>
              <p className="font-body uppercase tracking-[0.32em] text-gold/70 mb-3" style={{ fontSize: '10px' }}>
                The Team
              </p>
              <h2
                className="font-display font-bold text-kimono leading-[1] uppercase"
                style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', letterSpacing: '0.04em' }}
              >
                Real people, <span style={{ WebkitTextStroke: '1px rgb(var(--color-gold) / 0.5)', color: 'transparent' }}>real care</span>
              </h2>
            </div>
            <div className="w-20 h-px" style={{ background: 'rgb(var(--color-gold) / 0.4)' }} />
          </div>

          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {members.map((member) => (
              <article
                key={member.name}
                className="team-card rounded-2xl overflow-hidden relative flex flex-col p-7 lg:p-8"
                style={{
                  background: 'rgb(var(--color-gold) / 0.03)',
                  border: '1px solid rgb(var(--color-gold) / 0.07)',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                  transition: 'transform 180ms ease-out, border-color 300ms ease, background 300ms ease, box-shadow 300ms ease',
                  opacity: 0,
                }}
                onMouseMove={handleTilt}
                onMouseEnter={handleTiltEnter}
                onMouseLeave={handleTiltLeave}
              >
                <span
                  className="tilt-dot absolute w-2.5 h-2.5 rounded-full pointer-events-none"
                  style={{
                    background: 'rgb(var(--color-gold))',
                    boxShadow: '0 0 14px rgb(var(--color-gold) / 0.9), 0 0 4px rgba(255,215,0,0.6)',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0,
                    transition: 'opacity 250ms ease',
                    zIndex: 5,
                  }}
                  aria-hidden="true"
                />

                <div className="flex items-start gap-5 mb-6">
                  <div className="relative flex-shrink-0">
                    {member.photo ? (
                      <div
                        className="w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden"
                        style={{ border: '2px solid rgb(var(--color-gold) / 0.4)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                      >
                        <img
                          src={member.photo}
                          alt={member.name}
                          width={112}
                          height={112}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-top"
                          onError={(e) => { e.currentTarget.style.opacity = '0.2'; }}
                        />
                      </div>
                    ) : (
                      <div
                        className="w-24 h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center bg-gradient-to-br from-navy to-mist"
                        style={{ border: '2px solid rgb(var(--color-gold) / 0.4)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                        aria-hidden="true"
                      >
                        <span
                          className="font-display font-bold text-gold"
                          style={{ fontSize: 'clamp(28px, 3vw, 36px)', letterSpacing: '0.04em' }}
                        >
                          {member.monogram}
                        </span>
                      </div>
                    )}
                    <span
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: 'rgb(var(--color-gold))', color: '#021635', boxShadow: '0 4px 12px rgb(var(--color-gold) / 0.4)' }}
                      aria-hidden="true"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p
                      className="font-body uppercase tracking-[0.22em] text-gold mb-2"
                      style={{ fontSize: '10px', fontWeight: 600 }}
                    >
                      {member.role}
                    </p>
                    <h3
                      className="font-display font-bold text-kimono leading-tight"
                      style={{ fontSize: 'clamp(22px, 2.4vw, 30px)', letterSpacing: '0.02em' }}
                    >
                      {member.name}
                    </h3>
                  </div>
                </div>

                <p
                  className="font-serif font-light text-cream/70 mb-6"
                  style={{ fontSize: '15px', lineHeight: 1.75 }}
                >
                  {member.bio}
                </p>

                <div className="mt-auto pt-4" style={{ borderTop: '1px solid rgb(var(--color-gold) / 0.25)' }}>
                  <p
                    className="font-body text-cream/60 uppercase tracking-wider"
                    style={{ fontSize: '10.5px', letterSpacing: '0.12em', lineHeight: 1.5 }}
                  >
                    {member.credentials}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section ref={statsRef} className="relative w-full py-20 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgb(var(--color-gold) / 0.06) 0%, transparent 70%)' }}
        />
        <div className="hairline-draw absolute top-0 left-0 right-0 h-px" style={{ background: 'rgb(var(--color-gold) / 0.2)' }} />
        <div className="hairline-draw absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgb(var(--color-gold) / 0.2)' }} />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="font-body uppercase tracking-[0.4em] text-gold/70" style={{ fontSize: '11px' }}>
              Together, We've Delivered
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className="relative text-center px-4 py-8 lg:py-0">
                <div
                  className="font-display font-bold text-gold leading-none mb-3"
                  style={{ fontSize: 'clamp(36px, 5.5vw, 64px)' }}
                >
                  <span ref={(el) => { counterRefs.current[i] = el; }}>0</span>
                  <span>{stat.suffix}</span>
                </div>
                <p className="text-cream/60 small-caps" style={{ fontSize: '10px', letterSpacing: '0.22em' }}>
                  {stat.label}
                </p>
                {i < stats.length - 1 && i !== 1 && (
                  <span
                    className="hidden lg:block absolute right-0 top-[20%] h-[60%] w-px bg-gold/25"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative w-full pb-24 lg:pb-32 pt-8">
        <div className="max-w-[900px] mx-auto px-6 lg:px-10 text-center">
          <div
            className="rounded-3xl p-10 lg:p-14 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(11,30,66,0.85) 0%, rgba(11,42,92,0.7) 100%)',
              border: '1px solid rgb(var(--color-gold) / 0.25)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 0%, rgb(var(--color-gold) / 0.18) 0%, transparent 60%)' }}
            />
            <p
              className="relative font-body uppercase tracking-[0.32em] text-gold/70 mb-4"
              style={{ fontSize: '10px' }}
            >
              Let's talk
            </p>
            <h2
              className="relative font-display font-bold text-kimono mb-5"
              style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', lineHeight: 1.1 }}
            >
              Ready to start <span className="text-gold">your journey?</span>
            </h2>
            <p
              className="relative font-serif font-light text-cream/65 mb-8 mx-auto max-w-[520px]"
              style={{ fontSize: '16px', lineHeight: 1.7 }}
            >
              Speak directly with our counsellors. No pressure, no hard sell — just honest advice about your future.
            </p>
            <button
              onClick={goToContact}
              className="relative inline-flex items-center gap-3 px-9 py-4 rounded-full font-body text-xs uppercase tracking-[0.2em] cursor-pointer transition-all duration-300 hover:scale-[1.03]"
              style={{ background: 'rgb(var(--color-gold))', color: '#021635', fontWeight: 700, boxShadow: '0 8px 28px rgb(var(--color-gold) / 0.3)' }}
            >
              Book a Free Consultation
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
