import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = '/Absolute-Consultancy/video/WhatsApp%20Video%202026-05-28%20at%2012.31.02%20AM.mp4';

const polaroidData = [
  { videoId: 'BexESh9MWO4', caption: '30+ universities', rotation: -2 },
  { videoId: 'tdCG0MCL0V0', caption: '300+ students placed', rotation: 1.5 },
  { videoId: 'vaFIhaK0cds', caption: '99% visa approval', rotation: -1 },
  { videoId: 'xMFKnBwvuyU', caption: 'Free consultation', rotation: 2.5 },
  { videoId: 'oZiIppJrRt4', caption: 'Your dream, our mission', rotation: -1.5 },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const polaroidStripRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const polaroidRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoReadyRef = useRef(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Seed video element once on mount - optimized for smooth playback
  useEffect(() => {
    if (isMobile) return;
    const video = videoRef.current;
    if (!video || videoReadyRef.current) return;
    videoReadyRef.current = true;

    video.src = VIDEO_SRC;
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.preload = 'metadata';
    if ('disableRemotePlayback' in video) {
      (video as HTMLVideoElement & { disableRemotePlayback: boolean }).disableRemotePlayback = true;
    }

    const tryPlay = () => {
      video.play().catch(() => {
        const resume = () => { video.play().catch(() => {}); window.removeEventListener('scroll', resume); window.removeEventListener('click', resume); };
        window.addEventListener('scroll', resume, { once: false });
        window.addEventListener('click', resume, { once: false });
      });
    };

    if (video.readyState >= 3) {
      tryPlay();
    } else {
      video.addEventListener('loadeddata', tryPlay, { once: true });
    }
  }, [isMobile]);

  // Preload critical images
  useEffect(() => {
    const images = ['/Absolute-Consultancy/images/hero-bg.jpg', '/Absolute-Consultancy/images/hero-graduate.png'];
    let loaded = 0;
    images.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === images.length) setImagesLoaded(true);
      };
      img.onerror = () => {
        loaded++;
        if (loaded === images.length) setImagesLoaded(true);
      };
      img.src = src;
    });
  }, []);

  // Entrance animation + parallax - smooth performance
  useEffect(() => {
    if (!imagesLoaded || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Use smoothChildTiming for better performance
      const tl = gsap.timeline({ 
        defaults: { ease: 'power2.out' },
        smoothChildTiming: true 
      });

      // Optimized staggered entrance
      tl.fromTo(
        bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: isMobile ? 0.5 : 1.2 }
      )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: isMobile ? 0.4 : 0.8 },
          0.2
        )
        .fromTo(
          figureRef.current,
          { opacity: 0, x: 15 },
          { opacity: 1, x: 0, duration: isMobile ? 0.4 : 0.7 },
          0.4
        )
        .fromTo(
          polaroidRefs.current.filter(Boolean),
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.5, 
            stagger: 0.12, 
            ease: 'power1.out' 
          },
          0.8
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          1.2
        );

      // Reduced parallax for better performance
      gsap.to(bgRef.current, {
        yPercent: isMobile ? -8 : -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: isMobile ? 0.5 : 1.2,
        },
      });

      gsap.to(textRef.current, {
        yPercent: isMobile ? -25 : -45,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: isMobile ? 0.7 : 1.5,
        },
      });

      gsap.to(figureRef.current, {
        yPercent: isMobile ? -3 : -5,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: isMobile ? 0.5 : 1.2,
        },
      });

      gsap.to(polaroidStripRef.current, {
        xPercent: isMobile ? -15 : -35,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: isMobile ? 0.8 : 1.8,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [imagesLoaded, isMobile]);

  const scrollToContact = () => {
    const el = document.querySelector('#contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-mist"
      id="hero"
    >
      {/* Layer 1: Background — video on desktop, image on mobile */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-[1]"
        style={{ opacity: 0, willChange: 'transform' }}
      >
        {!isMobile && (
          <>
            {/* Video background for desktop */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-[120%] -top-[10%] object-cover"
              style={{ objectPosition: 'center 30%' }}
              aria-hidden="true"
            />
            {/* Poster fallback */}
            <img
              src="/Absolute-Consultancy/images/hero-bg.jpg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-[120%] -top-[10%] object-cover transition-opacity duration-1000"
              style={{ objectPosition: 'center 30%', opacity: 1 }}
              onLoad={(e) => {
                const v = videoRef.current;
                if (!v) return;
                const hidePoster = () => { (e.currentTarget as HTMLElement).style.opacity = '0'; };
                const poll = setInterval(() => {
                  if (v.readyState >= 2 && v.videoWidth > 0) { hidePoster(); clearInterval(poll); }
                }, 200);
                setTimeout(() => { clearInterval(poll); hidePoster(); }, 4000);
              }}
            />
          </>
        )}
        {isMobile && (
          <img
            src="/Absolute-Consultancy/images/hero-bg.jpg"
            alt="University campus backdrop"
            className="w-full h-[120%] object-cover"
            style={{ objectPosition: 'center 30%' }}
            loading="eager"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0) 25%, rgba(10,10,10,0.1) 55%, rgba(10,10,10,0.7) 100%)',
          }}
        />
        <div
          className="absolute inset-y-0 left-0 w-[30%]"
          style={{
            background: 'linear-gradient(to right, rgba(10,10,10,0.45) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Layer 2: Typography - always present */}
      <div
        ref={textRef}
        className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none"
        style={{ opacity: 0, willChange: 'transform' }}
      >
        <div className="relative flex flex-col items-center text-center px-4">
          <p
            className="font-body uppercase tracking-[0.45em] text-gold/70 mb-4"
            style={{ fontSize: '11px', letterSpacing: '0.45em' }}
          >
            Absolute Consultancy Firm
          </p>
          <h1
            className="font-display font-bold select-none whitespace-nowrap"
            style={{
              fontSize: 'clamp(60px, 12vw, 180px)',
              lineHeight: 0.85,
              WebkitTextStroke: '1.5px rgba(201, 162, 52, 0.55)',
              color: 'transparent',
              marginTop: 0,
              letterSpacing: '0.03em',
            }}
          >
            ABSOLUTE
          </h1>
          <p
            className="font-serif text-cream/60 mt-5 tracking-widest px-4"
            style={{ fontSize: 'clamp(13px, 2vw, 18px)', fontWeight: 300 }}
          >
            Where ambition meets the world's finest universities
          </p>
        </div>
      </div>

      {/* Layer 3: Foreground Figure - always present */}
      <div
        ref={figureRef}
        className="absolute bottom-0 right-[4%] z-[3] pointer-events-none"
        style={{ opacity: 0, willChange: 'transform' }}
      >
        <img
          src="/Absolute-Consultancy/images/hero-graduate.png"
          alt="Graduate silhouette — campus foreground"
          className="h-[78vh] w-auto object-contain"
          style={{
            filter: 'drop-shadow(-8px 0 60px rgba(201, 162, 52, 0.18))',
          }}
          loading={isMobile ? 'eager' : 'lazy'}
        />
        <div
          className="absolute top-[15%] -left-[80px] w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(201,162,52,0.12) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
      </div>

      {/* Layer 4: Polaroid Cards - bottom left on desktop, centered bottom on mobile */}
      <div
        ref={polaroidStripRef}
        className={`absolute z-[4] flex gap-3 ${isMobile ? 'bottom-[22%] left-1/2 -translate-x-1/2' : 'bottom-[9%] left-[3%]'}`}
        style={{ willChange: 'transform' }}
      >
        {polaroidData.map((item, index) => (
          <div
            key={index}
            ref={(el) => { polaroidRefs.current[index] = el; }}
            className="polaroid-item cursor-pointer flex-shrink-0"
            style={{
              transform: `rotate(${item.rotation}deg)`,
              background: 'white',
              padding: '8px 8px 32px 8px',
              borderRadius: '4px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.15)',
              transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 500ms cubic-bezier(0.22, 1, 0.36, 1)',
              willChange: 'transform',
            }}
            onClick={() => setActiveVideo(item.videoId)}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = `rotate(${item.rotation}deg) translateY(-14px) scale(1.03)`;
              el.style.boxShadow = '0 24px 48px rgba(201,162,52,0.2), 0 8px 16px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = `rotate(${item.rotation}deg) translateY(0px) scale(1)`;
              el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.15)';
            }}
          >
            <div className="w-[140px] h-[100px] overflow-hidden rounded-sm bg-gray-100">
              {isMobile ? (
                <img
                  src={`https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&mute=1&loop=1&playlist=${item.videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1`}
                  title={item.caption}
                  className="w-full h-full object-cover"
                  style={{ border: 'none', pointerEvents: 'none' }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  loading="lazy"
                />
              )}
            </div>
            <p className="mt-2 text-[9px] text-gray-500 font-body uppercase tracking-wider text-center">
              {item.caption}
            </p>
          </div>
        ))}
      </div>

      {/* Layer 5: CTA Button - centered on mobile, right side on desktop */}
      <button
        ref={ctaRef}
        onClick={scrollToContact}
        className="absolute z-[5] px-10 py-4 rounded-full font-body text-sm uppercase tracking-widest cursor-pointer"
        style={{
          background: 'rgba(245, 232, 211, 0.92)',
          backdropFilter: 'blur(10px)',
          color: '#0A0A0A',
          opacity: 0,
          transition: 'all 500ms cubic-bezier(0.22, 1, 0.36, 1)',
          border: '1px solid rgba(201, 162, 52, 0.3)',
          willChange: 'transform',
          ...(isMobile ? {
            bottom: '13%',
            left: '50%',
            transform: 'translateX(-50%)',
          } : {
            bottom: '13%',
            right: '22%',
          })
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #C9A234 0%, #E8C36A 100%)';
          e.currentTarget.style.color = '#0A0A0A';
          if (isMobile) {
            e.currentTarget.style.transform = 'translateX(-50%) translateY(-3px)';
          } else {
            e.currentTarget.style.transform = 'translateY(-3px)';
          }
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(201,162,52,0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(245, 232, 211, 0.92)';
          e.currentTarget.style.color = '#0A0A0A';
          if (isMobile) {
            e.currentTarget.style.transform = 'translateX(-50%) translateY(0)';
          } else {
            e.currentTarget.style.transform = 'translateY(0)';
          }
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        Start Your Journey
      </button>

      {/* Scroll indicator - always present */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-1 opacity-40"
        style={{ animation: 'fadeInUp 1s 2s both' }}
      >
        <span className="font-body uppercase tracking-[0.3em] text-cream" style={{ fontSize: '9px' }}>
          Scroll
        </span>
        <div
          className="w-px h-8 bg-gradient-to-b from-cream to-transparent"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        />
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-[90vw] max-w-[960px] rounded-2xl overflow-hidden"
            style={{ background: '#0A0A0A', border: '1px solid rgba(201,162,52,0.3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3" style={{ background: 'rgba(201,162,52,0.1)', borderBottom: '1px solid rgba(201,162,52,0.15)' }}>
              <span className="font-body uppercase tracking-widest text-gold text-[11px]">Watch on Website</span>
              <div className="flex items-center gap-3">
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-body text-[10px] uppercase tracking-widest"
                  style={{ background: '#FF0000', color: 'white', transition: 'opacity 200ms ease' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube
                </a>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#F5E8D3', fontSize: '16px', lineHeight: 1 }}
                >
                  ✕
                </button>
              </div>
            </div>
            <div style={{ aspectRatio: '16/9' }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                title="COO Video"
                className="w-full h-full"
                style={{ border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}