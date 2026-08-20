import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import SectionLabel from '../components/SectionLabel';

interface ParentTestimonial {
  rating: number;
  quote: string;
  name: string;
  relation: string;
  university: string;
}

const testimonials: ParentTestimonial[] = [
  {
    rating: 5,
    quote: "My son was lost in the application process until we found Absolute. They handled everything from offer letter to EMGS. Truly professional.",
    name: "Mrs. Rahima Begum",
    relation: "Mother of Tanvir",
    university: "Asia Pacific University",
  },
  {
    rating: 5,
    quote: "I was worried about my daughter going abroad at 18. Absolute made the whole journey safe and smooth. 100% recommend to any parent.",
    name: "Mr. Kamal Hossain",
    relation: "Father of Arisha",
    university: "Sunway University",
  },
  {
    rating: 5,
    quote: "Their honesty stood out. No hidden fees, no false promises. They told us exactly which universities fit my son's profile.",
    name: "Mrs. Fatema Akter",
    relation: "Mother of Farhan",
    university: "Multimedia University",
  },
  {
    rating: 5,
    quote: "From the WhatsApp first contact to my son's first day at Taylor's, the team was responsive and caring. Best decision we made.",
    name: "Mr. Anisur Rahman",
    relation: "Father of Reuben",
    university: "Taylor's University",
  },
  {
    rating: 5,
    quote: "I have referred 3 of my relatives to Absolute. All are now studying in Malaysia. That's the trust they earned.",
    name: "Mrs. Sufia Khatun",
    relation: "Mother of Mehedi",
    university: "SEGi University",
  },
  {
    rating: 5,
    quote: "My daughter's visa was rejected by another agent. Absolute reviewed her case, fixed the issues, and got her approved in 6 weeks.",
    name: "Mr. Nazrul Islam",
    relation: "Father of Priya",
    university: "HELP University",
  },
  {
    rating: 5,
    quote: "Even after my son arrived in KL, Nadia from their team helped him with bank account and SIM card. They don't disappear.",
    name: "Mrs. Jahanara Begum",
    relation: "Mother of Imran",
    university: "UCSI University",
  },
  {
    rating: 5,
    quote: "As a parent living in a small town, I had no idea how to apply abroad. Absolute made it possible. My daughter is now a dentist in Malaysia.",
    name: "Mr. Abul Kalam",
    relation: "Father of Sumaiya",
    university: "Lincoln University College",
  },
];

interface RowConfig {
  items: ParentTestimonial[];
  direction: 'rtl' | 'ltr';
  speed: number;
}

const rows: RowConfig[] = [
  { items: [testimonials[0], testimonials[3], testimonials[6]], direction: 'rtl', speed: 50 },
  { items: [testimonials[1], testimonials[4], testimonials[7]], direction: 'ltr', speed: 60 },
  { items: [testimonials[2], testimonials[5]], direction: 'rtl', speed: 40 },
];

const REPEAT_COUNT = 3;
const FRAME_INTERVAL_MS = 1000 / 30;

function TestimonialCard({ t }: { t: ParentTestimonial }) {
  return (
    <div
      className="on-navy flex-shrink-0 rounded-xl p-5 mx-3 whitespace-normal break-words overflow-wrap-anywhere"
      style={{
        width: '360px',
        maxWidth: '100%',
        background: 'rgb(var(--color-gold) / 0.04)',
        border: '1px solid rgb(var(--color-gold) / 0.15)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        transition: 'border-color 300ms ease, transform 300ms ease, box-shadow 300ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgb(var(--color-gold) / 0.45)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 24px rgb(var(--color-gold) / 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgb(var(--color-gold) / 0.15)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="text-gold mb-3 tracking-widest" style={{ fontSize: '14px' }}>
        {'★'.repeat(t.rating)}
      </div>
      <p
        className="font-serif font-light text-kimono/85 mb-4 break-words"
        style={{ fontSize: '15px', lineHeight: 1.6 }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="border-t border-gold/20 pt-3">
        <p className="font-body text-kimono text-sm font-medium break-words">{t.name}</p>
        <p className="font-body text-gold/70 text-xs mt-0.5 break-words">
          {t.relation}, {t.university}
        </p>
      </div>
    </div>
  );
}

interface MarqueeRowProps {
  items: ParentTestimonial[];
  direction: 'rtl' | 'ltr';
  speed: number;
  delayMs: number;
  inView: boolean;
  paused: boolean;
}

function MarqueeRow({ items, direction, speed, delayMs, inView, paused }: MarqueeRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef(0);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let cancelled = false;
    let singleWidth = 0;
    let initialized = false;
    let lastTime = performance.now();

    const animate = (now: number) => {
      if (cancelled) return;
      if (pausedRef.current) {
        lastTime = now;
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      if (!initialized) {
        singleWidth = track.scrollWidth / 2;
        if (singleWidth === 0) {
          rafRef.current = requestAnimationFrame(animate);
          return;
        }
        posRef.current = direction === 'rtl' ? 0 : -singleWidth;
        initialized = true;
        lastTime = now;
      }
      const delta = now - lastTime;
      if (delta < FRAME_INTERVAL_MS) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      const seconds = delta / 1000;
      lastTime = now;
      if (direction === 'rtl') {
        posRef.current -= speed * seconds;
        if (posRef.current <= -singleWidth) {
          posRef.current = 0;
        }
      } else {
        posRef.current += speed * seconds;
        if (posRef.current >= 0) {
          posRef.current = -singleWidth;
        }
      }
      track.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [direction, speed]);

  const renderCards = (keyPrefix: string) => {
    const cards: React.ReactNode[] = [];
    for (let copy = 0; copy < REPEAT_COUNT; copy++) {
      items.forEach((t, i) => {
        cards.push(<TestimonialCard key={`${keyPrefix}-${copy}-${i}`} t={t} />);
      });
    }
    return cards;
  };

  return (
    <div
      className="overflow-hidden"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 400ms ease ${delayMs}ms, transform 400ms ease ${delayMs}ms`,
      }}
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform"
        style={{ width: 'max-content' }}
      >
        {renderCards('a')}
        {renderCards('b')}
      </div>
    </div>
  );
}

export default function ParentVoicesSection() {
  const [sectionRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.15, once: true });
  const [paused, setPaused] = useState(false);

  return (
    <section
      ref={sectionRef}
      id="parent-voices"
      className="relative w-full py-24 lg:py-32 overflow-hidden bg-mist"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 mb-12 lg:mb-16">
        <div className="mb-8 lg:mb-10">
          <SectionLabel name="What parents say about us" />
        </div>
        <p
          className="font-body uppercase tracking-[0.4em] text-gold/70 mb-4"
          style={{ fontSize: '11px' }}
        >
          Parent Voices
        </p>
        <h2
          className="font-display font-bold text-kimono leading-[0.95]"
          style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}
        >
          What parents say about us
        </h2>
        <p
          className="font-serif font-light text-cream/60 mt-5 max-w-[480px]"
          style={{ fontSize: 'clamp(15px, 1.6vw, 19px)', lineHeight: 1.75 }}
        >
          Real feedback from Bangladeshi parents who trusted us with their children&apos;s future.
        </p>
      </div>

      <div
        className="space-y-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {rows.map((row, i) => (
          <MarqueeRow
            key={i}
            items={row.items}
            direction={row.direction}
            speed={row.speed}
            delayMs={i * 100}
            inView={isInView}
            paused={paused}
          />
        ))}
      </div>
    </section>
  );
}
