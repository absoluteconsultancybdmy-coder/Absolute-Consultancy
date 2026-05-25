import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
  const isDragging = useRef(false);
  const dragStart = useRef(0);
  const scrollStart = useRef(0);

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
    isDragging.current = true;
    dragStart.current = e.clientX;
    scrollStart.current = trackRef.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    trackRef.current.scrollLeft = scrollStart.current - (e.clientX - dragStart.current);
  };
  const onMouseUp = () => { isDragging.current = false; };

  return (
    <section ref={sectionRef} className="relative w-full py-32 lg:py-44 overflow-hidden" id="testimonials"
      style={{ backgroundImage: 'url(/images/Ginting_Highland.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div ref={headingRef} className="mb-16" style={{ opacity: 0 }}>
          <div className="w-12 h-px mb-8" style={{ background: 'rgba(201,162,52,0.5)' }} />
          <h2 className="font-display font-bold text-kimono uppercase"
            style={{ fontSize: 'clamp(36px, 6vw, 76px)', letterSpacing: '0.05em', lineHeight: 1.05 }}>
            STUDENT{' '}
            <span style={{ WebkitTextStroke: '1px rgba(201,162,52,0.5)', color: 'transparent' }}>STORIES</span>
          </h2>
          <p className="font-serif font-light text-cream/50 mt-5 max-w-[480px]"
            style={{ fontSize: 'clamp(15px, 1.6vw, 19px)', lineHeight: 1.75 }}>
            Real students. Real outcomes. From Dhaka to KL, from Chittagong to Cyberjaya —
            these are the people we exist for.
          </p>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto pb-4 select-none"
        style={{
          paddingLeft: 'max(24px, calc((100vw - 1280px) / 2 + 24px))',
          paddingRight: 'max(24px, calc((100vw - 1280px) / 2 + 24px))',
          scrollbarWidth: 'none',
          cursor: isDragging.current ? 'grabbing' : 'grab',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {testimonials.map((t) => (
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
                style={{ backgroundColor: t.color, border: '1px solid rgba(201,162,52,0.3)' }}>
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
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 mt-8">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button key={i}
                onClick={() => {
                  if (!trackRef.current) return;
                  trackRef.current.scrollTo({ left: i * (420 + 24), behavior: 'smooth' });
                  setActiveIndex(i);
                }}
                className="h-px transition-all duration-300"
                style={{ width: activeIndex === i ? '24px' : '12px', background: activeIndex === i ? '#C9A234' : 'rgba(201,162,52,0.25)' }}
              />
            ))}
          </div>
          <span className="small-caps text-mouse/40" style={{ fontSize: '10px' }}>Drag to explore</span>
        </div>
      </div>
    </section>
  );
}
