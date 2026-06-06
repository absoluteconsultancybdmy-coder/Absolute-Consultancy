import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

export default function JourneyHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current!.querySelectorAll('.journey-hero-stagger'),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const goHome = () => navigate('/');

  return (
    <section
      ref={heroRef}
      id="journey-hero"
      className="relative w-full overflow-hidden bg-mist"
      style={{ minHeight: '62vh' }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 20% 0%, rgba(11,42,92,0.55) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 100%, rgba(201,162,52,0.12) 0%, transparent 60%), linear-gradient(180deg, #0A0A0A 0%, #0B1A33 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(201,162,52,0.5) 50%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(201,162,52,0.3) 50%, transparent 100%)',
        }}
      />

      <button
        onClick={goHome}
        className="journey-hero-stagger absolute top-24 left-6 lg:left-10 z-10 flex items-center gap-2 text-gold/70 hover:text-gold transition-colors duration-200 cursor-pointer font-body uppercase bg-transparent border-0"
        style={{ fontSize: '10px', letterSpacing: '0.22em' }}
        aria-label="Back to home"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back to Home</span>
      </button>

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-10 pt-32 lg:pt-40 pb-20 lg:pb-28 text-center">
        <p
          className="journey-hero-stagger small-caps text-gold/70 mb-6"
          style={{ fontSize: '11px', letterSpacing: '0.4em' }}
        >
          ✦ Explore More ✦
        </p>
        <h1
          className="journey-hero-stagger font-display font-bold text-kimono mb-6"
          style={{
            fontSize: 'clamp(40px, 7vw, 84px)',
            letterSpacing: '0.03em',
            lineHeight: 1.05,
          }}
        >
          Your <span className="text-gold">Journey</span> Continues
        </h1>
        <p
          className="journey-hero-stagger font-serif font-light text-cream/70 mx-auto max-w-[640px]"
          style={{ fontSize: 'clamp(15px, 1.6vw, 19px)', lineHeight: 1.7 }}
        >
          Discover why Malaysia is the right choice, find the programme that
          matches your goals, and read answers to the questions we hear most
          often from Bangladeshi students and their families.
        </p>
      </div>
    </section>
  );
}
