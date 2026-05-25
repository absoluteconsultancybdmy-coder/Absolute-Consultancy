import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HighlightText from '@/components/HighlightText';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' }
        }
      );
      gsap.fromTo(lineLeftRef.current,
        { scaleX: 0, transformOrigin: 'right center' },
        { scaleX: 1, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' }
        }
      );
      gsap.fromTo(lineRightRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' }
        }
      );
      gsap.fromTo(bioRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: bioRef.current, start: 'top 80%', toggleActions: 'play none none none' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-mist py-32 lg:py-40" id="about">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">

        {/* Section heading */}
        <div className="flex items-center justify-center gap-6 mb-20">
          <div ref={lineLeftRef} className="hairline flex-1" style={{ transform: 'scaleX(0)' }} />
          <h2
            ref={headingRef}
            className="font-display font-bold text-kimono text-center whitespace-nowrap"
            style={{ fontSize: 'clamp(36px, 7vw, 84px)', letterSpacing: '0.05em' }}
          >
            ABOUT THE FIRM
          </h2>
          <div ref={lineRightRef} className="hairline flex-1" style={{ transform: 'scaleX(0)' }} />
        </div>

        {/* COO Feature Card */}
        <div
          ref={bioRef}
          className="relative rounded-3xl overflow-hidden mb-24"
          style={{ background: 'linear-gradient(135deg, #0B1E42 0%, #0B2A5C 100%)', border: '1px solid rgba(201,162,52,0.2)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Left — COO Photo */}
            <div className="relative h-[400px] lg:h-[520px] overflow-hidden">
              <img
                src="/Absolute-Consultancy/images/coo-profile.png"
                alt="COO - Absolute Consultancy Firm"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to right, transparent 60%, rgba(11,30,66,0.95) 100%), linear-gradient(to top, rgba(11,30,66,0.6) 0%, transparent 50%)',
              }} />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 rounded-full text-[10px] font-body uppercase tracking-widest"
                  style={{ background: 'rgba(201,162,52,0.9)', color: '#0A0A0A', fontWeight: 600 }}>
                  ✓ Certified Education Counsellor
                </span>
              </div>
            </div>

            {/* Right — COO Bio */}
            <div className="flex flex-col justify-center p-10 lg:p-14">
              <div className="w-12 h-px mb-8" style={{ background: '#C9A234' }} />
              <p className="small-caps text-gold/70 mb-3" style={{ fontSize: '11px' }}>Chief Operating Officer</p>
              <h3
                className="font-display font-bold text-kimono mb-6"
                style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.03em', lineHeight: 1.1 }}
              >
                The Face Behind<br />
                <span style={{ color: '#C9A234' }}>Every Success Story</span>
              </h3>
              <p className="font-serif font-light text-cream/70 mb-8" style={{ fontSize: '16px', lineHeight: 1.8 }}>
                With over a decade of experience in Malaysian higher education consultancy, our COO personally
                oversees every student's journey — from university selection to visa approval. His 99% visa
                success rate speaks for itself.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-10">
                {[{ value: '99%', label: 'Visa Rate' }, { value: '300+', label: 'Students' }, { value: '10+', label: 'Years' }].map(stat => (
                  <div key={stat.label}>
                    <p className="font-display font-bold text-gold" style={{ fontSize: '28px' }}>{stat.value}</p>
                    <p className="font-body text-mouse text-xs uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <a
                href="https://wa.me/60175631621"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-body text-sm uppercase tracking-widest w-fit"
                style={{ background: '#25D366', color: 'white', transition: 'transform 300ms ease, box-shadow 300ms ease' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 24px rgba(37,211,102,0.3)'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp COO Directly
              </a>
            </div>
          </div>
        </div>

        {/* Bottom text + timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          <div>
            <p className="text-kimono/90 font-body font-light text-lg mb-8" style={{ lineHeight: 1.7 }}>
              We've spent over a decade helping students from Bangladesh and Malaysia reach the best universities
              in Malaysia. Our counsellors don't just process applications — they{' '}
              <HighlightText delay={0}>invest in your future</HighlightText>.
            </p>
            <p className="text-kimono/90 font-body font-light text-lg" style={{ lineHeight: 1.7 }}>
              No need to worry about university choices, visa paperwork, or offer letters — everything is
              handled with precision and care. We'll show you which university fits you best and{' '}
              <HighlightText delay={1}>walk with you every step of the way</HighlightText>.
            </p>
          </div>
          <div className="relative pl-8">
            <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: 'rgba(201,162,52,0.5)' }} />
            <div className="space-y-10">
              {[
                { year: 'Founded 2024', text: 'Started in Malaysia with a mission to help international students navigate Malaysian universities.' },
                { year: '500 Students', text: 'Reached our first 500 students placed milestone within 3 years of operation.' },
                { year: '300+ Placed', text: 'Over 300 students successfully admitted to top Malaysian universities with 99% visa approval.' },
                { year: 'Certified Counsellors', text: 'Our team are fully certified education counsellors recognised by Malaysian institutions.' },
              ].map((item, i) => (
                <div key={i} className="timeline-node relative">
                  <span className="small-caps text-gold block mb-2">{item.year}</span>
                  <p className="font-body font-light text-kimono/70 text-sm" style={{ lineHeight: 1.7 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
