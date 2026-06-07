import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/SectionLabel';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface BlogPost {
  slug: string;
  category: 'GUIDE' | 'NEWS' | 'STUDENT STORY';
  cover: string;
  date: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
}

const POSTS: BlogPost[] = [
  {
    slug: 'visa-guide-2026',
    category: 'GUIDE',
    cover: `${import.meta.env.BASE_URL}images/Ginting_Highland.jpg`,
    date: '18 May 2026',
    title: '2026 Malaysia Student Visa Guide for Bangladeshi Applicants',
    excerpt:
      'Step-by-step breakdown of the EMGS application process, document requirements, processing times, and how to avoid the most common rejection reasons. Updated for the 2026 intake.',
    author: 'Kazi Mahir',
    readTime: '8 min read',
  },
  {
    slug: 'malaysia-qs-2026',
    category: 'NEWS',
    cover: `${import.meta.env.BASE_URL}images/services-section.jpg`,
    date: '04 May 2026',
    title: 'Malaysia Rises to #12 in QS Best Student Cities 2026',
    excerpt:
      'Kuala Lumpur continues its climb in global rankings, with affordable living, world-class universities, and a thriving international community. Here\u2019s what the new ranking means for Bangladeshi students.',
    author: 'Kazi Mahir',
    readTime: '5 min read',
  },
  {
    slug: 'nusrat-taylors-story',
    category: 'STUDENT STORY',
    cover: `${import.meta.env.BASE_URL}images/hero-graduate.png`,
    date: '21 Apr 2026',
    title: 'From Dhaka to Taylor\u2019s: How Nusrat Built Her Dream Career',
    excerpt:
      'A first-person account of the application journey, arriving in Malaysia, finding community, and landing a marketing internship at a top KL firm within six months.',
    author: 'Kazi Mahir',
    readTime: '6 min read',
  },
];

export default function BlogSection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const showAll = () => {
      sectionRef.current
        ?.querySelectorAll<HTMLElement>('[data-anim], .blog-card')
        .forEach((el) => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
    };

    if (prefersReducedMotion) {
      showAll();
      return;
    }

    const safetyTimer = window.setTimeout(showAll, 2500);

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        const headerEls = headerRef.current.querySelectorAll<HTMLElement>('[data-anim]');
        if (headerEls.length) {
          gsap.fromTo(
            headerEls,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: headerRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll<HTMLElement>('.blog-card');
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.05,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      }
    }, sectionRef);

    return () => {
      window.clearTimeout(safetyTimer);
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 6;
    const rotateX = ((y / rect.height) - 0.5) * -6;
    el.style.transition = 'transform 80ms ease-out, border-color 200ms ease, background 200ms ease, box-shadow 250ms ease';
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    el.style.borderColor = 'rgba(201,162,52,0.55)';
    el.style.boxShadow = '0 25px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(201,162,52,0.35), inset 0 1px 0 rgba(201,162,52,0.15)';
  };

  const handleTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transition = 'transform 500ms ease, border-color 400ms ease, background 400ms ease, box-shadow 400ms ease';
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    el.style.borderColor = 'rgba(255,255,255,0.07)';
    el.style.boxShadow = 'none';
  };

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="relative w-full py-32 lg:py-44 overflow-hidden bg-mist"
    >
      <style>{`@keyframes blogKenBurns { from { transform: scale(1) translate(0, 0); } to { transform: scale(1.15) translate(-2%, -1.5%); } } .blog-cover-img { transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1); } .blog-card:hover .blog-cover-img { animation: blogKenBurns 4.5s ease-in-out infinite alternate; } @media (prefers-reduced-motion: reduce) { .blog-cover-img { transition: none !important; animation: none !important; } .blog-card:hover .blog-cover-img { transform: none !important; animation: none !important; } }`}</style>

      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 85% 10%, rgba(201,162,52,0.10) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 15% 90%, rgba(11,42,92,0.40) 0%, transparent 60%)',
        }}
      />

      <div className="hairline-draw absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(201,162,52,0.2)' }} />
      <div className="hairline-draw absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(201,162,52,0.2)' }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="mb-8 lg:mb-10">
          <SectionLabel name="Blog" />
        </div>
        <div ref={headerRef} className="flex flex-col items-center text-center mb-14 lg:mb-20">
          <p
            data-anim
            className="font-body uppercase text-gold mb-5"
            style={{ fontSize: '11px', letterSpacing: '0.4em', opacity: 0 }}
          >
            ✦ Insights &amp; Updates
          </p>
          <h2
            data-anim
            className="font-display font-bold text-kimono uppercase"
            style={{
              fontSize: 'clamp(36px, 6.5vw, 72px)',
              letterSpacing: '0.04em',
              lineHeight: 1.05,
              opacity: 0,
            }}
          >
            From our <span style={{ color: '#C9A234' }}>blog</span>
          </h2>
          <p
            data-anim
            className="font-serif font-light text-cream/55 mt-6 max-w-[640px]"
            style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', lineHeight: 1.7, opacity: 0 }}
          >
            Practical advice, university insights, and the latest news for Bangladeshi students heading to Malaysia.
          </p>
          <div
            data-anim
            className="mt-8 flex items-center justify-center gap-2"
            style={{ opacity: 0 }}
          >
            <div className="w-12 h-px" style={{ background: 'rgba(201,162,52,0.4)' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: '#C9A234' }} />
            <div className="w-12 h-px" style={{ background: 'rgba(201,162,52,0.4)' }} />
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {POSTS.map((post) => (
            <article
              key={post.title}
              role="button"
              tabIndex={0}
              aria-label={`Read article: ${post.title}`}
              className="blog-card group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                opacity: 0,
                transition: 'transform 180ms ease-out, border-color 300ms ease, box-shadow 300ms ease, background 300ms ease',
              }}
              onMouseMove={handleTilt}
              onMouseLeave={handleTiltLeave}
              onClick={() => navigate(`/blog/${post.slug}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/blog/${post.slug}`);
                }
              }}
            >
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
                <img
                  src={post.cover}
                  alt=""
                  width={800}
                  height={500}
                  loading="lazy"
                  decoding="async"
                  className="blog-cover-img w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.opacity = '0.15';
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0) 35%, rgba(10,10,10,0.55) 100%)',
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span
                    className="px-2.5 py-1 rounded-full text-[9px] font-body uppercase"
                    style={{
                      background: '#C9A234',
                      color: '#0A0A0A',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                    }}
                  >
                    {post.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className="font-body text-cream/70"
                    style={{ fontSize: '10px', letterSpacing: '0.1em' }}
                  >
                    {post.date}
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-6">
                <h3
                  className="font-display font-bold text-kimono mb-3"
                  style={{
                    fontSize: 'clamp(17px, 1.6vw, 20px)',
                    letterSpacing: '0.01em',
                    lineHeight: 1.25,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.title}
                </h3>
                <p
                  className="font-serif font-light text-cream/60 mb-6"
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.65,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.excerpt}
                </p>

                <div
                  className="mt-auto pt-4 flex items-center justify-between gap-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'rgba(201,162,52,0.15)',
                        border: '1px solid rgba(201,162,52,0.35)',
                      }}
                    >
                      <span
                        className="font-body text-gold"
                        style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em' }}
                      >
                        KM
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0 font-body text-cream/55" style={{ fontSize: '11px' }}>
                      <span className="truncate">By {post.author}</span>
                      <span className="text-cream/30">·</span>
                      <span className="flex items-center gap-1 flex-shrink-0">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 2" />
                        </svg>
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <span
                    className="inline-flex items-center gap-1.5 font-body text-gold transition-all duration-300 group-hover:gap-2.5"
                    style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}
                  >
                    Read article
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 lg:mt-16 text-center">
          <button
            onClick={() => navigate('/resources')}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-body text-xs uppercase transition-all duration-300 hover:scale-[1.03] cursor-pointer"
            style={{
              border: '1px solid rgba(201,162,52,0.5)',
              color: '#C9A234',
              letterSpacing: '0.18em',
              fontWeight: 600,
              background: 'rgba(201,162,52,0.04)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(201,162,52,0.10)';
              e.currentTarget.style.borderColor = 'rgba(201,162,52,0.8)';
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(201,162,52,0.22)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(201,162,52,0.04)';
              e.currentTarget.style.borderColor = 'rgba(201,162,52,0.5)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            View all articles
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
