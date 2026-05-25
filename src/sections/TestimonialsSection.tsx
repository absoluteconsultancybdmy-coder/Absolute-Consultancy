import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Arisha Rahim',
    origin: 'Kuala Lumpur, Malaysia',
    university: 'University of Manchester',
    programme: 'MSc Data Science',
    year: '2024',
    country: '🇬🇧',
    quote:
      'I had no idea where to start. Within three weeks of joining Absolute, I had a shortlist, a polished SOP, and a scholarship application submitted. They made the impossible feel routine.',
    initials: 'AR',
    color: '#1A3A6B',
  },
  {
    name: 'Tanvir Hossain',
    origin: 'Dhaka, Bangladesh',
    university: 'University of Melbourne',
    programme: 'BEng Civil Engineering',
    year: '2023',
    country: '🇦🇺',
    quote:
      'From visa struggles to landing in Melbourne — Absolute handled every single step. My counsellor personally called the university to resolve my offer letter delay. That level of care is rare.',
    initials: 'TH',
    color: '#1B5E20',
  },
  {
    name: 'Priya Subramaniam',
    origin: 'Petaling Jaya, Malaysia',
    university: 'University of Toronto',
    programme: 'BSc Computer Science',
    year: '2024',
    country: '🇨🇦',
    quote:
      'I applied to 8 universities, got 6 offers. Absolute helped me negotiate a merit scholarship at UofT that cut my fees by 35%. Worth every single ringgit.',
    initials: 'PS',
    color: '#7B0000',
  },
  {
    name: 'Farhan Azmi',
    origin: 'Shah Alam, Malaysia',
    university: 'University of Edinburgh',
    programme: 'LLB Law',
    year: '2023',
    country: '🇬🇧',
    quote:
      'My personal statement was good. After Absolute refined it, it was extraordinary. The admissions officer literally mentioned it in my acceptance email. That is the difference they make.',
    initials: 'FA',
    color: '#1A3A6B',
  },
  {
    name: 'Nusrat Jahan',
    origin: 'Chittagong, Bangladesh',
    university: 'Monash University',
    programme: 'MPH Public Health',
    year: '2024',
    country: '🇦🇺',
    quote:
      'As an international student with no family abroad, I was terrified. Absolute arranged my accommodation, pre-departure briefing, and even connected me with a Malaysian student community in Melbourne.',
    initials: 'NJ',
    color: '#1B5E20',
  },
  {
    name: 'Reuben Lim',
    origin: 'Penang, Malaysia',
    university: 'Imperial College London',
    programme: 'MEng Electrical Engineering',
    year: '2022',
    country: '🇬🇧',
    quote:
      'Imperial was a reach. Everyone told me to aim lower. Absolute built my entire application around my specific strengths and I got in. Two years on and I am working at a London tech firm.',
    initials: 'RL',
    color: '#1A3A6B',
  },
];

function StarRating() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#C9A234">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(0);
  const scrollStart = useRef(0);

  useEffect(() => {
    if (!headingRef.current) return;

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
            trigger: headingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Stagger cards in
      const cards = sectionRef.current?.querySelectorAll('.testimonial-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: trackRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Drag-to-scroll on mobile
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = e.clientX;
    scrollStart.current = trackRef.current?.scrollLeft ?? 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    const dx = e.clientX - dragStart.current;
    trackRef.current.scrollLeft = scrollStart.current - dx;
  };

  const onMouseUp = () => setIsDragging(false);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 lg:py-44 overflow-hidden"
      id="testimonials"
      style={{ backgroundColor: '#080808' }}
    >
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,162,52,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
          transform: 'translate(30%, -30%)',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div ref={headingRef} className="mb-16" style={{ opacity: 0 }}>
          <div className="w-12 h-px mb-8" style={{ background: 'rgba(201,162,52,0.5)' }} />
          <h2
            className="font-display font-bold text-kimono uppercase"
            style={{
              fontSize: 'clamp(36px, 6vw, 76px)',
              letterSpacing: '0.05em',
              lineHeight: 1.05,
            }}
          >
            STUDENT{' '}
            <span style={{ WebkitTextStroke: '1px rgba(201,162,52,0.5)', color: 'transparent' }}>
              STORIES
            </span>
          </h2>
          <p
            className="font-serif font-light text-cream/50 mt-5 max-w-[480px]"
            style={{ fontSize: 'clamp(15px, 1.6vw, 19px)', lineHeight: 1.75 }}
          >
            Real students. Real outcomes. From Dhaka to Manchester,
            from Penang to Imperial — these are the people we exist for.
          </p>
        </div>
      </div>

      {/* Horizontal scroll track — bleeds edge-to-edge */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto pb-4 select-none"
        style={{
          paddingLeft: 'max(24px, calc((100vw - 1280px) / 2 + 24px))',
          paddingRight: 'max(24px, calc((100vw - 1280px) / 2 + 24px))',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {testimonials.map((t, i) => (
          <div
            key={t.name}
            className="testimonial-card flex-shrink-0 rounded-2xl p-8 flex flex-col justify-between"
            style={{
              width: 'clamp(300px, 38vw, 420px)',
              minHeight: '340px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              opacity: 0,
              transition: 'border-color 300ms ease, transform 300ms ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'rgba(201,162,52,0.25)';
              el.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'rgba(255,255,255,0.07)';
              el.style.transform = 'translateY(0)';
            }}
          >
            {/* Top: Stars + country flag */}
            <div className="flex items-center justify-between mb-6">
              <StarRating />
              <span className="text-xl">{t.country}</span>
            </div>

            {/* Quote */}
            <blockquote
              className="font-serif font-light text-kimono/85 flex-1 mb-8"
              style={{ fontSize: 'clamp(15px, 1.4vw, 17px)', lineHeight: 1.75 }}
            >
              "{t.quote}"
            </blockquote>

            {/* Bottom: identity */}
            <div className="flex items-center gap-4">
              {/* Avatar initials */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: t.color, border: '1px solid rgba(201,162,52,0.3)' }}
              >
                <span className="font-body text-[11px] font-bold text-kimono tracking-wider">
                  {t.initials}
                </span>
              </div>
              <div>
                <p className="font-body text-kimono text-sm font-medium">{t.name}</p>
                <p className="font-body text-mouse text-xs mt-0.5">{t.programme}</p>
                <p className="font-body text-gold/70 text-xs">{t.university} · {t.year}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 mt-8">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!trackRef.current) return;
                  const cardWidth = 420 + 24;
                  trackRef.current.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
                  setActiveIndex(i);
                }}
                className="h-px transition-all duration-300"
                style={{
                  width: activeIndex === i ? '24px' : '12px',
                  background: activeIndex === i ? '#C9A234' : 'rgba(201,162,52,0.25)',
                }}
              />
            ))}
          </div>
          <span className="small-caps text-mouse/40" style={{ fontSize: '10px' }}>
            Drag to explore
          </span>
        </div>
      </div>
    </section>
  );
}
