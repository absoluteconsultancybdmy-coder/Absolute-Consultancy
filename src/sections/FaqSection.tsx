import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrambledText from '../components/ScrambledText';
import SectionLabel from '../components/SectionLabel';

interface Faq {
  q: string;
  a: string;
}

const faqs: Faq[] = [
  {
    q: 'Do Bangladeshi students need a visa to study in Malaysia?',
    a: 'Yes. All Bangladeshi students must obtain a Student Pass through Education Malaysia Global Services (EMGS) before travelling. We guide you through the entire EMGS process end-to-end.',
  },
  {
    q: 'How long does the visa process take?',
    a: 'Typically 4–8 weeks for EMGS processing, with the full journey from application to arrival averaging 10–14 weeks. We recommend applying at least 3–6 months before your intended intake.',
  },
  {
    q: 'Is IELTS mandatory?',
    a: 'Most universities accept IELTS (5.5–6.5 typical), but many also accept PTE, TOEFL iBT, MUET, or Duolingo English Test. Some universities waive English tests if your previous education was in English. We will match you with universities that fit your profile.',
  },
  {
    q: 'Can I work part-time while studying?',
    a: 'Yes. International students can work up to 20 hours per week during semester and full-time during breaks, subject to Malaysian Immigration Department approval. We help you understand the rules and apply for the necessary endorsement.',
  },
  {
    q: 'What about scholarships?',
    a: 'Malaysian universities and the Malaysian government offer merit-based and need-based scholarships (e.g. Malaysian International Scholarship for Master\u2019s/PhD). Many partner universities offer partial tuition waivers. We will help you identify and apply for scholarships you qualify for.',
  },
  {
    q: 'Will my credits transfer if I continue elsewhere later?',
    a: 'Yes — Malaysian degrees from MQA-accredited institutions are recognised globally. Many of our partner universities (Monash, Heriot-Watt, UOW) offer direct credit transfer to their main campuses in Australia, UK, and elsewhere.',
  },
  {
    q: 'Is Malaysia safe for Bangladeshi students?',
    a: 'Malaysia is consistently ranked among the most peaceful countries in Asia and globally (Global Peace Index top 20). It has a large South Asian community, halal food widely available, and modern urban campuses with 24/7 security.',
  },
  {
    q: 'What is the cost of living in Malaysia?',
    a: 'Affordable compared to UK/Australia — typically USD 500–700 per month including accommodation, food, transport and utilities. We provide detailed city-by-city living cost guidance during consultation.',
  },
  {
    q: 'Can I bring my family (spouse/children)?',
    a: 'Postgraduate students (Master\u2019s and PhD) may apply for dependent passes for their spouse and children. Undergraduate students typically cannot. We help you plan the right time and pathway for family inclusion.',
  },
  {
    q: 'What happens after I graduate?',
    a: 'Many Malaysian universities have strong industry partnerships. The Graduate Pass allows graduates from selected countries to remain in Malaysia for up to 12 months to work, travel, or further study. We will advise on post-study pathways.',
  },
];

interface FaqItemProps {
  faq: Faq;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FaqItem({ faq, isOpen, onToggle, index }: FaqItemProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const plusRef = useRef<HTMLDivElement>(null);
  const initialOpenRef = useRef(isOpen);

  useEffect(() => {
    const body = bodyRef.current;
    const plus = plusRef.current;
    if (!body || !plus) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(body, { height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 });
      gsap.set(plus, { rotate: isOpen ? 45 : 0 });
      return;
    }

    if (initialOpenRef.current) {
      initialOpenRef.current = false;
      gsap.set(body, { height: 'auto', opacity: 1 });
      gsap.set(plus, { rotate: 45 });
      return;
    }

    if (isOpen) {
      gsap.killTweensOf([body, plus]);
      gsap.fromTo(
        body,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
      gsap.to(plus, { rotate: 45, duration: 0.3, ease: 'power2.out' });
    } else {
      gsap.killTweensOf([body, plus]);
      gsap.to(body, { height: 0, opacity: 0, duration: 0.25, ease: 'power2.in' });
      gsap.to(plus, { rotate: 0, duration: 0.3, ease: 'power2.out' });
    }
  }, [isOpen]);

  return (
    <div
      className="border-b transition-colors duration-300"
      style={{ borderColor: isOpen ? 'rgba(201,162,52,0.35)' : 'rgba(201,162,52,0.12)' }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        id={`faq-trigger-${index}`}
        className="w-full flex items-center justify-between gap-6 py-6 lg:py-7 text-left cursor-pointer group"
      >
        <span className="flex items-center gap-4 flex-1 min-w-0">
          <span
            className="font-body text-gold/60 flex-shrink-0 hidden sm:inline-block"
            style={{ fontSize: '11px', letterSpacing: '0.2em' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3
            className="font-display font-medium text-kimono"
            style={{
              fontSize: 'clamp(15px, 1.6vw, 19px)',
              letterSpacing: '0.02em',
              lineHeight: 1.35,
            }}
          >
            {faq.q}
          </h3>
        </span>
        <div
          ref={plusRef}
          className="flex-shrink-0 flex items-center justify-center rounded-full"
          style={{
            width: '36px',
            height: '36px',
            background: isOpen ? 'rgba(201,162,52,0.15)' : 'rgba(201,162,52,0.06)',
            border: '1px solid rgba(201,162,52,0.35)',
            transition: 'background 300ms ease',
            willChange: 'transform',
          }}
          aria-hidden="true"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C9A234"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      </button>
      <div
        ref={bodyRef}
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-trigger-${index}`}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <p
          className="font-body font-light text-cream/70 pb-6 lg:pb-7 pl-0 sm:pl-12 pr-12"
          style={{ fontSize: '15px', lineHeight: 1.75 }}
        >
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = 'faq-schema-jsonld';
    const existing = document.getElementById(scriptId);
    if (existing && existing.parentElement) {
      existing.parentElement.removeChild(existing);
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    });
    document.head.appendChild(script);

    return () => {
      const node = document.getElementById(scriptId);
      if (node && node.parentElement) {
        node.parentElement.removeChild(node);
      }
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !headingRef.current) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(headingRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll('.faq-item');
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative w-full py-32 lg:py-44 overflow-hidden bg-mist"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(201,162,52,0.04) 0%, transparent 60%)',
        }}
      />

      <div className="hairline-draw absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(201,162,52,0.2)' }} />

      <div className="relative z-10 max-w-[920px] mx-auto px-6 lg:px-10">
        <div className="mb-8 lg:mb-10">
          <SectionLabel name="FAQ" />
        </div>
        <div ref={headingRef} className="text-center mb-14 lg:mb-20" style={{ opacity: 0 }}>
          <p
            className="font-body uppercase tracking-[0.4em] text-gold/70 mb-6"
            style={{ fontSize: '11px' }}
          >
            Common Questions
          </p>
          <h2
            className="font-display font-bold text-kimono leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(36px, 7vw, 72px)', letterSpacing: '0.05em' }}
          >
            <ScrambledText text="FREQUENTLY" />{' '}
            <ScrambledText
              text="ASKED"
              style={{ WebkitTextStroke: '1px rgba(201,162,52,0.5)', color: 'transparent' }}
            />
          </h2>
          <p
            className="font-serif font-light text-cream/60 max-w-xl mx-auto"
            style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', lineHeight: 1.7 }}
          >
            Everything Bangladeshi students ask us before applying to study in Malaysia.
          </p>
        </div>

        <div
          className="rounded-2xl p-2 sm:p-4 lg:p-6"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(201,162,52,0.15)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          {faqs.map((faq, i) => (
            <div key={faq.q} className="faq-item">
              <FaqItem
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
                index={i}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p
            className="font-serif font-light text-cream/50"
            style={{ fontSize: 'clamp(14px, 1.4vw, 16px)', lineHeight: 1.6 }}
          >
            Still have questions?{' '}
            <a
              href="#contact"
              className="text-gold underline-offset-4 hover:underline"
              style={{ textDecorationColor: 'rgba(201,162,52,0.5)' }}
            >
              Speak to our counsellors
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
