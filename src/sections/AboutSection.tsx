import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HighlightText from '@/components/HighlightText';
import SectionLabel from '../components/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    if (showVideoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showVideoModal]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showVideoModal) setShowVideoModal(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showVideoModal]);

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
    <section ref={sectionRef} className="on-navy relative w-full py-32 lg:py-44" id="about">
      <div className="absolute inset-0 z-0">
        <img src={`${import.meta.env.BASE_URL}images/Firm.avif`} alt="" width={1920} height={1080} loading="lazy" decoding="async" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.opacity = '0'; }} />
        <div className="absolute inset-0 bg-mist/70" />
      </div>


      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">

        <div className="mb-8 lg:mb-10">
          <SectionLabel name="COO" />
        </div>

        {/* Section heading */}
        <div className="flex items-center justify-center gap-6 mb-20">
          <div ref={lineLeftRef} className="hairline flex-1" style={{ transform: 'scaleX(0)' }} />
          <h2
            ref={headingRef}
            className="font-display font-bold text-kimono text-center"
            style={{ fontSize: 'clamp(36px, 7vw, 84px)', letterSpacing: '0.05em' }}
          >
            ABOUT THE FIRM
          </h2>
          <div ref={lineRightRef} className="hairline flex-1" style={{ transform: 'scaleX(0)' }} />
        </div>

        {/* COO Feature Card */}
        <div
          ref={bioRef}
          className="on-navy relative rounded-3xl overflow-hidden mb-24"
          style={{ background: 'linear-gradient(135deg, #031D4C 0%, #052458 100%)', border: '1px solid rgb(var(--color-gold) / 0.2)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Left — COO Photo */}
            <div className="relative h-[400px] lg:h-[520px] overflow-hidden">
              <img
                src={`${import.meta.env.BASE_URL}images/coo-profile.png`}
                alt="COO - Absolute Consultancy Firm"
                width={520}
                height={520}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top"
                onError={(e) => { e.currentTarget.style.opacity = '0.2'; }}
              />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to right, transparent 60%, rgba(2, 22, 53,0.85) 100%), linear-gradient(to top, rgba(2, 22, 53,0.5) 0%, transparent 50%)',
              }} />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 rounded-full text-[10px] font-body uppercase tracking-widest"
                  style={{ background: 'rgb(var(--color-gold) / 0.9)', color: 'rgb(var(--color-mist))', fontWeight: 600 }}>
                  ✓ Certified Education Counsellor
                </span>
              </div>
            </div>

            {/* Right — COO Bio */}
            <div className="flex flex-col justify-center p-10 lg:p-14">
              <div className="hairline-draw w-12 h-px mb-8" style={{ background: 'rgb(var(--color-gold))' }} />
              <p className="small-caps text-gold/70 mb-3" style={{ fontSize: '11px' }}>Chief Operating Officer</p>
              <h3
                className="font-display font-bold text-cream mb-6"
                style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.03em', lineHeight: 1.1 }}
              >
                The Face Behind<br />
                <span style={{ color: 'rgb(var(--color-gold))' }}>Every Success Story</span>
              </h3>
              <p className="font-serif font-light text-cream/70 mb-8" style={{ fontSize: '16px', lineHeight: 1.8 }}>
                With over a year's experience in Malaysian higher education consultancy, our COO personally
                oversees every student's journey — from university selection to visa approval. His 99% visa
                success rate speaks for itself.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-10">
                {[{ value: '99%', label: 'Visa Rate' }, { value: '300+', label: 'Students' }, { value: '2+', label: 'Years' }].map(stat => (
                  <div key={stat.label}>
                    <p className="font-display font-bold text-gold" style={{ fontSize: '28px' }}>{stat.value}</p>
                    <p className="font-body text-mouse text-xs uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/60175631621"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-body text-sm uppercase tracking-widest"
                  style={{ background: '#25D366', color: 'white', transition: 'transform 300ms ease, box-shadow 300ms ease' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 24px rgba(37,211,102,0.3)'; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp COO
                </a>
                <a
                  href="https://www.youtube.com/@TheMahirofc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-body text-sm uppercase tracking-widest"
                  style={{ background: '#FF0000', color: 'white', transition: 'transform 300ms ease, box-shadow 300ms ease' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 24px rgba(255,0,0,0.3)'; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube
                </a>
                <a
                  href="mailto:coo@absoluteconsultancyfirm.com"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-body text-sm uppercase tracking-widest"
                  style={{ background: 'rgb(var(--color-gold) / 0.15)', color: 'rgb(var(--color-gold))', border: '1px solid rgb(var(--color-gold) / 0.3)', transition: 'transform 300ms ease, box-shadow 300ms ease' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 24px rgb(var(--color-gold) / 0.2)'; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Email COO
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom text + video */}
        <div className="on-navy relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #031D4C 0%, #052458 100%)', border: '1px solid rgb(var(--color-gold) / 0.2)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 p-10 lg:p-14">
            <div>
              <p className="font-serif font-light text-cream/70 mb-8" style={{ fontSize: '17px', lineHeight: 1.8 }}>
                We've spent over a year helping students from Bangladesh and Malaysia reach the best universities
                in Malaysia. Our counsellors don't just process applications — they{' '}
                <HighlightText delay={0}>invest in your future</HighlightText>.
              </p>
              <p className="font-serif font-light text-cream/70 mb-8" style={{ fontSize: '17px', lineHeight: 1.8 }}>
                No need to worry about university choices, visa paperwork, or offer letters — everything is
                handled with precision and care. We'll show you which university fits you best and{' '}
                <HighlightText delay={1}>walk with you every step of the way</HighlightText>.
              </p>

              {/* YouTube Video */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-body uppercase tracking-widest text-gold text-[11px] font-semibold">
                    Latest Video From COO
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', maxWidth: '560px', border: '1px solid rgb(var(--color-gold) / 0.2)' }}>
                  <iframe
                    src="https://www.youtube.com/embed/tdCG0MCL0V0?autoplay=0&mute=0&rel=0&modestbranding=1"
                    title="COO - Latest Video"
                    className="w-full h-full"
                    style={{ border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: 'rgb(var(--color-gold) / 0.5)' }} />
              <div className="space-y-10">
                {[
                  { year: 'Founded 2024', text: 'Started in Kuala Lumpur with a mission to help international students navigate Malaysian universities.' },
                  { year: '100+ Students', text: 'Reached our first 100+ in 11 Months.' },
                  { year: '300+ Placed', text: 'Over 300 students successfully admitted to top Malaysian universities with 99% visa approval.' },
                  { year: 'Certified Counsellors', text: 'Our team is fully certified education counsellors', cta: 'CLICK THE YELLOW BOX TO GET 100% SCHOLARSHIP WITHOUT PASSPORT' },
                ].map((item, i) => (
                  <div key={i} className="timeline-node relative">
                    <span className="small-caps text-gold block mb-2">{item.year}</span>
                    <p className="font-body font-light text-cream/60 text-sm" style={{ lineHeight: 1.7 }}>{item.text}</p>
                    {'cta' in item && item.cta && (
                      <button
                        onClick={() => setShowVideoModal(true)}
                        className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full font-body text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgb(var(--color-gold) / 0.4)]"
                        style={{ background: 'var(--color-cream)', color: 'var(--color-mist)', fontWeight: 700, animation: 'pulse-gold 2s ease-in-out infinite' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        {item.cta}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Video Popup Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="relative w-full max-w-[1000px] rounded-3xl overflow-hidden"
            style={{ background: 'rgb(var(--color-mist))', border: '1px solid rgb(var(--color-gold) / 0.3)', boxShadow: '0 0 60px rgb(var(--color-gold) / 0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ background: 'linear-gradient(135deg, rgb(var(--color-gold) / 0.15) 0%, rgb(var(--color-gold) / 0.05) 100%)', borderBottom: '1px solid rgb(var(--color-gold) / 0.2)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--color-gold)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#031D4C">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-body uppercase tracking-widest text-gold text-[11px] font-semibold">100% SCHOLARSHIP WITHOUT ACADEMIC CERTIFICATE</p>
                  <p className="font-body text-cream/70 text-[10px] uppercase tracking-wider">From Our Certified Counsellors</p>
                </div>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                aria-label="Close video"
                className="group w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-red-500/20 hover:scale-110"
                style={{ background: 'rgb(var(--color-gold) / 0.08)', border: '1px solid rgb(var(--color-gold) / 0.15)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--color-cream))" strokeWidth="2" strokeLinecap="round" className="group-hover:stroke-red-400 transition-colors">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Video Player */}
            <div style={{ aspectRatio: '16/9', background: '#000' }}>
              <iframe
                src="https://www.youtube.com/embed/dHER3Vc9GBI?autoplay=1&mute=0&rel=0&modestbranding=1"
                title="Scholarship Video"
                className="w-full h-full"
                style={{ border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4" style={{ background: 'linear-gradient(135deg, rgb(var(--color-gold) / 0.08) 0%, rgba(0,0,0,0.5) 100%)', borderTop: '1px solid rgb(var(--color-gold) / 0.15)' }}>
              <p className="font-body text-cream/70 text-[10px] uppercase tracking-wider">Press ESC or click outside to close</p>
              <button
                onClick={() => setShowVideoModal(false)}
                aria-label="Close video"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-body text-[11px] uppercase tracking-widest cursor-pointer transition-all duration-300 hover:bg-cream/10"
                style={{ background: 'rgb(var(--color-gold) / 0.06)', border: '1px solid rgb(var(--color-gold) / 0.12)', color: 'rgb(var(--color-cream))' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
