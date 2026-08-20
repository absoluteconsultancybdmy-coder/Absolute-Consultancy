import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrambledText from '../components/ScrambledText';
import SectionLabel from '../components/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

const gentingBgUrl = `${import.meta.env.BASE_URL}images/Ginting_Highland.jpg`;

const testimonials = [
  {
    name: 'Arisha Rahman',
    origin: 'Dhaka, Bangladesh',
    university: 'Multimedia University (MMU)',
    programme: 'BSc Computer Science',
    year: '2024',
    quote: 'I had no idea where to start. Within two weeks of joining Absolute, I had my offer letter from MMU and my visa was approved within 3 weeks. Incredible service.',
    initials: 'AR',
    color: '#1A3A6B',
  },
  {
    name: 'Tanvir Hossain',
    origin: 'Chittagong, Bangladesh',
    university: 'UCSI University',
    programme: 'BEng Civil Engineering',
    year: '2023',
    quote: 'From application to landing in KL — Absolute handled every single step. My visa was approved on the first try. That 99% success rate is real.',
    initials: 'TH',
    color: '#1B5E20',
  },
  {
    name: 'Priya Subramaniam',
    origin: 'Petaling Jaya, Malaysia',
    university: "Taylor's University",
    programme: 'BSc Hospitality Management',
    year: '2024',
    quote: 'I applied to 3 universities, got offers from all 3. Absolute helped me choose the right one and handled everything for free. Worth every moment.',
    initials: 'PS',
    color: '#7B0000',
  },
  {
    name: 'Farhan Azmi',
    origin: 'Shah Alam, Malaysia',
    university: 'Asia Pacific University (APU)',
    programme: 'BSc Software Engineering',
    year: '2023',
    quote: 'The COO personally called me to explain my options. That kind of care is rare in any consultancy. My visa was done in under a month.',
    initials: 'FA',
    color: '#1A3A6B',
  },
  {
    name: 'Nusrat Jahan',
    origin: 'Sylhet, Bangladesh',
    university: 'Sunway University',
    programme: 'BBA Business Administration',
    year: '2024',
    quote: 'As an international student I was terrified of the process. Absolute arranged everything — offer letter, visa, even pre-departure guidance. I felt so supported.',
    initials: 'NJ',
    color: '#1B5E20',
  },
  {
    name: 'Reuben Lim',
    origin: 'Penang, Malaysia',
    university: 'HELP University',
    programme: 'LLB Law',
    year: '2022',
    quote: 'Everyone told me HELP was hard to get into for law. Absolute guided my entire application and I got in. Two years on and I am in my final year.',
    initials: 'RL',
    color: '#7B0000',
  },
];

function StarRating() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#FFFFFF">
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
  const [cursorStyle, setCursorStyle] = useState<'grab' | 'grabbing'>('grab');
  const dragStart = useRef(0);
  const scrollStart = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%', toggleActions: 'play none none none' } }
      );
      const cards = sectionRef.current?.querySelectorAll('.testimonial-card');
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: trackRef.current, start: 'top 80%', toggleActions: 'play none none none' } }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    setCursorStyle('grabbing');
    dragStart.current = e.clientX;
    scrollStart.current = trackRef.current?.scrollLeft ?? 0;
    e.preventDefault();
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !trackRef.current) return;
    trackRef.current.scrollLeft = scrollStart.current - (e.clientX - dragStart.current);
  };
  const onMouseUp = () => {
    dragging.current = false;
    setCursorStyle('grab');
  };
  const onMouseLeave = () => {
    dragging.current = false;
    setCursorStyle('grab');
  };

  return (
    <section ref={sectionRef} className="relative w-full py-32 lg:py-44 overflow-hidden" id="testimonials"
      style={{
        backgroundImage: `url(${gentingBgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(2, 22, 53,0.65) 0%, rgba(2, 22, 53,0.55) 50%, rgba(2, 22, 53,0.7) 100%)' }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="mb-8 lg:mb-10">
          <SectionLabel name="STUDENT STORIES" />
        </div>
        <div ref={headingRef} className="mb-16" style={{ opacity: 0 }}>
          <div className="hairline-draw w-12 h-px mb-8" style={{ background: 'rgba(255, 255, 255,0.5)' }} />
          <h2 className="font-display font-bold text-kimono uppercase"
            style={{ fontSize: 'clamp(36px, 6vw, 76px)', letterSpacing: '0.05em', lineHeight: 1.05 }}>
            <ScrambledText text="STUDENT" />{' '}
            <ScrambledText text="STORIES" style={{ WebkitTextStroke: '1px rgba(255, 255, 255,0.5)', color: 'transparent' }} />
          </h2>
          <p className="font-serif font-light text-cream/60 mt-5 max-w-[480px]"
            style={{ fontSize: 'clamp(15px, 1.6vw, 19px)', lineHeight: 1.75 }}>
            Real students. Real outcomes. From Dhaka to KL, from Chittagong to Cyberjaya —
            these are the people we exist for.
          </p>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="relative z-10 flex gap-6 overflow-x-auto pb-4 select-none"
        style={{
          paddingLeft: 'max(24px, calc((100vw - 1280px) / 2 + 24px))',
          paddingRight: 'max(24px, calc((100vw - 1280px) / 2 + 24px))',
          scrollbarWidth: 'none',
          cursor: cursorStyle,
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="testimonial-card flex-shrink-0 rounded-2xl p-8 flex flex-col justify-between"
            style={{
              width: 'clamp(300px, 38vw, 420px)',
              minHeight: '340px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.07)',
              opacity: 0,
              transition: 'border-color 300ms ease, transform 300ms ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'rgba(255, 255, 255,0.25)';
              el.style.transform = 'translateY(-4px)';
              el.style.boxShadow = '0 8px 32px rgba(255, 255, 255,0.15)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'rgba(255,255,255,0.07)';
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = 'none';
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <StarRating />
              <span className="text-[10px] font-body text-gold/60 uppercase tracking-wider">🇲🇾 Malaysia</span>
            </div>
            <blockquote className="font-serif font-light text-kimono/85 flex-1 mb-8"
              style={{ fontSize: 'clamp(15px, 1.4vw, 17px)', lineHeight: 1.75 }}>
              "{t.quote}"
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: t.color, border: '1px solid rgba(255, 255, 255,0.3)' }}>
                <span className="font-body text-[11px] font-bold text-kimono tracking-wider">{t.initials}</span>
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

      {/* Dots */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 mt-8">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button key={i}
                onClick={() => {
                  if (!trackRef.current) return;
                  const cardWidth = (trackRef.current.children[0] as HTMLElement)?.offsetWidth || 420;
                  trackRef.current.scrollTo({ left: i * (cardWidth + 24), behavior: 'smooth' });
                  setActiveIndex(i);
                }}
                className="h-px transition-all duration-300"
                style={{ width: activeIndex === i ? '24px' : '12px', background: activeIndex === i ? '#FFFFFF' : 'rgba(255, 255, 255,0.25)' }}
              />
            ))}
          </div>
          <span className="small-caps text-mouse" style={{ fontSize: '10px' }}>Drag to explore</span>
        </div>
      </div>
    </section>
  );
}
