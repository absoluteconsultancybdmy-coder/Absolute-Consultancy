import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../components/MagneticButton';
import ScrambledText from '../components/ScrambledText';
import Constellation from '../components/Constellation';
import SectionLabel from '../components/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

const COOO_LINE_TWO = 'We build futures — one placement at a time.';

export default function StudentRecruitmentSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasAnimated = useRef(false);
  const [typewriterActive, setTypewriterActive] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  // Live rain animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2);

    let animationId = 0;
    let drops: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];
    let isVisible = true;
    let lastFrameTime = 0;
    const frameInterval = isMobile ? 1000 / 24 : 1000 / 30;

    const spritePad = 6;
    const spriteW = 4 + spritePad * 2;
    const spriteH = 30 + spritePad * 2;
    const sprite = document.createElement('canvas');
    sprite.width = spriteW;
    sprite.height = spriteH;
    const sctx = sprite.getContext('2d');
    if (sctx) {
      sctx.shadowColor = 'rgba(201,162,52,0.6)';
      sctx.shadowBlur = 4;
      const grad = sctx.createLinearGradient(0, spritePad, 0, spriteH - spritePad);
      grad.addColorStop(0, 'rgba(201,162,52,0)');
      grad.addColorStop(1, 'rgba(201,162,52,1)');
      sctx.strokeStyle = grad;
      sctx.lineWidth = 2;
      sctx.lineCap = 'round';
      sctx.beginPath();
      sctx.moveTo(spriteW / 2, spritePad);
      sctx.lineTo(spriteW / 2, spriteH - spritePad);
      sctx.stroke();
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initDrops = () => {
      drops = [];
      const rect = canvas.getBoundingClientRect();
      const count = isMobile
        ? Math.floor((rect.width * rect.height) / 9000)
        : Math.floor((rect.width * rect.height) / 4500);
      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          length: 25 + Math.random() * 45,
          speed: 10 + Math.random() * 14,
          opacity: 0.45 + Math.random() * 0.5,
        });
      }
    };

    const draw = (now: number) => {
      animationId = requestAnimationFrame(draw);

      if (!isVisible) return;

      const elapsed = now - lastFrameTime;
      if (elapsed < frameInterval) return;
      lastFrameTime = now - (elapsed % frameInterval);

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (const drop of drops) {
        ctx.globalAlpha = drop.opacity;
        ctx.drawImage(
          sprite,
          drop.x - spriteW / 2,
          drop.y - spritePad,
          spriteW,
          drop.speed + spritePad * 2
        );

        drop.x -= 2;
        drop.y += drop.speed;

        if (drop.y > rect.height || drop.x < 0) {
          drop.x = Math.random() * rect.width + 50;
          drop.y = -drop.length;
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    initDrops();
    animationId = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      initDrops();
    };

    window.addEventListener('resize', onResize);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting;
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, []);

  // Animated quote reveal
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;

          // Quote lines reveal
          const lines = quoteRef.current?.querySelectorAll('.quote-line');
          if (lines) {
            gsap.fromTo(
              lines,
              { opacity: 0, y: 40, filter: 'blur(8px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 1,
                stagger: 0.3,
                ease: 'power3.out',
                delay: 0.5,
                onComplete: () => setTypewriterActive(true),
              }
            );
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Typewriter for COO quote second line
  useEffect(() => {
    if (!typewriterActive) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayedText(COOO_LINE_TWO.slice(0, i));
      if (i >= COOO_LINE_TWO.length) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, [typewriterActive]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      id="recruitment"
    >
      {/* Full background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}images/StudentRecruitment.jpg`}
          alt=""
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.opacity = '0'; }}
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <Constellation
        dotCount={30}
        connectionDistance={100}
        mouseRadius={120}
        color="#C9A234"
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0, mixBlendMode: 'screen' }}
      />

      {/* Top gold hairline */}
      <div
        className="hairline-draw absolute top-0 left-0 right-0 h-px z-10"
        style={{ background: 'rgba(201,162,52,0.2)' }}
      />

      {/* Animated background glow */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(201,162,52,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Live Rain Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Floating gold particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: `rgba(201,162,52,${0.1 + Math.random() * 0.2})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${6 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-10">
        <span
          className="font-display font-bold uppercase"
          style={{
            fontSize: 'clamp(120px, 25vw, 350px)',
            letterSpacing: '-0.02em',
            WebkitTextStroke: '1px rgba(201,162,52,0.03)',
            color: 'transparent',
            lineHeight: 1,
          }}
        >
          RECRUITMENT
        </span>
      </div>

      <div className="relative z-20 max-w-[1100px] mx-auto px-6 lg:px-10 text-center py-32">
        <div className="mb-8 lg:mb-10">
          <SectionLabel name="Student Recruitment" />
        </div>
        {/* Motivational Quote — Eleanor Roosevelt */}
        <div className="mb-16">
          <p
            className="quote-line font-serif italic text-kimono leading-snug mb-6"
            style={{ fontSize: 'clamp(28px, 6vw, 64px)', opacity: 0 }}
          >
            "The future belongs to those who
          </p>
          <p
            className="quote-line font-serif italic text-gold leading-snug mb-8"
            style={{ fontSize: 'clamp(28px, 6vw, 64px)', opacity: 0 }}
          >
            believe in the beauty of their dreams."
          </p>
          <p
            className="quote-line small-caps text-kimono/50 tracking-[0.25em]"
            style={{ fontSize: '12px', opacity: 0 }}
          >
            — Eleanor Roosevelt
          </p>
        </div>

        {/* Hairline divider */}
        <div className="hairline-draw w-24 h-px bg-gold/30 mx-auto mb-16" />

        {/* Quote — animated reveal */}
        <div ref={quoteRef} className="relative">
          <p
            className="quote-line font-display font-bold uppercase tracking-[0.4em] text-gold mb-8"
            style={{ fontSize: 'clamp(13px, 1.4vw, 18px)', opacity: 0 }}
          >
            <ScrambledText text="Student Recruitment" />
          </p>
          {/* Decorative quote mark */}
          <span
            className="quote-line font-serif text-gold/20 absolute -top-12 left-1/2 -translate-x-1/2 select-none pointer-events-none"
            style={{ fontSize: 'clamp(120px, 18vw, 220px)', lineHeight: 1, opacity: 0 }}
          >
            "
          </span>
          <p
            className="quote-line font-serif italic text-kimono leading-snug mb-6"
            style={{ fontSize: 'clamp(24px, 5vw, 52px)', opacity: 0 }}
          >
            We don't just recruit students.
          </p>
          <p
            className="quote-line font-serif italic text-gold leading-snug mb-8"
            style={{ fontSize: 'clamp(24px, 5vw, 52px)', opacity: 0 }}
          >
            {displayedText}
          </p>
          <p
            className="quote-line small-caps text-kimono/40 tracking-[0.25em]"
            style={{ fontSize: '12px', opacity: 0 }}
          >
            — Kazi Mahir Muhtasib, COO
          </p>
        </div>

        {/* CTA */}
        <div className="mt-20">
          <MagneticButton href="#contact" className="text-[14px]">
            START YOUR JOURNEY
          </MagneticButton>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-5px); }
          75% { transform: translateY(-25px) translateX(8px); }
        }
      `}</style>
    </section>
  );
}
