import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MouseTrail from '../components/MouseTrail';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { label: 'Apply', sublabel: 'Submit your profile' },
  { label: 'Visa', sublabel: '99% approval rate' },
  { label: 'Arrive', sublabel: 'Begin your future' },
];

export default function ArcSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const capRef = useRef<SVGGElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const hasAnimated = useRef(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!sectionRef.current || !pathRef.current) return;

    const path = pathRef.current;
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;

          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 2.5,
            ease: 'power2.inOut',
          });

          const animateMotion = capRef.current?.querySelector('animateMotion');
          if (animateMotion) {
            try {
              (animateMotion as SVGAnimateMotionElement).beginElement();
            } catch {
              // SMIL not supported — the cap will simply stay at the start point
            }
          }

          gsap.fromTo(
            stepsRef.current.filter(Boolean),
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.2,
              delay: 2.5,
              ease: 'power2.out',
            }
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Velocity-based motion blur on the gold arc path (desktop only, respects reduced motion)
  useEffect(() => {
    if (isMobile) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!pathRef.current) return;

    const pathEl = pathRef.current;
    const clamp = gsap.utils.clamp(0, 6);
    const proxy = { blur: 0 };
    const blurSetter = gsap.quickSetter(pathEl, 'filter');
    let tween: gsap.core.Tween | null = null;

    const composeFilter = (blur: number) =>
      `blur(${blur.toFixed(2)}px) drop-shadow(0 0 6px rgba(201,162,52,0.55))`;

    blurSetter(composeFilter(0));

    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = clamp(Math.abs(self.getVelocity()) / 1500);
        if (Math.abs(v) > Math.abs(proxy.blur)) {
          proxy.blur = v;
          if (tween) tween.kill();
          tween = gsap.to(proxy, {
            blur: 0,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: true,
            onUpdate: () => blurSetter(composeFilter(proxy.blur)),
          });
        }
      },
    });

    return () => {
      trigger.kill();
      if (tween) tween.kill();
      blurSetter(composeFilter(0));
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative w-full py-32 lg:py-44 overflow-hidden bg-mist"
    >
      <div className="hairline-draw absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(201,162,52,0.2)' }} />
      <div className="hairline-draw absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(201,162,52,0.2)' }} />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="font-display font-bold uppercase"
          style={{
            fontSize: 'clamp(120px, 22vw, 320px)',
            letterSpacing: '-0.02em',
            WebkitTextStroke: '1px rgba(201,162,52,0.04)',
            color: 'transparent',
            lineHeight: 1,
          }}
        >
          JOURNEY
        </span>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 75% 50%, rgba(201,162,52,0.06) 0%, transparent 70%)',
        }}
      />

      <MouseTrail />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-16 lg:mb-20">
          <p
            className="font-body uppercase tracking-[0.4em] text-gold/70 mb-6"
            style={{ fontSize: '11px' }}
          >
            The Journey
          </p>
          <h2
            className="font-display font-bold text-kimono leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(36px, 7vw, 72px)', letterSpacing: '-0.01em' }}
          >
            From Dhaka to <span className="text-gold">Kuala Lumpur</span>
          </h2>
          <p
            className="font-serif text-cream/60 max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.6 }}
          >
            Every student we place embarks on a journey that begins in the heart of Bangladesh and ends among the world-class campuses of Malaysia.
          </p>
        </div>

        <div
          className="relative w-full max-w-[1000px] mx-auto"
          style={{ aspectRatio: '2 / 1' }}
        >
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <path id="arcPathDef" d="M 700 190 Q 680 90 790 250" fill="none" />

              <radialGradient id="originGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C9A234" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#C9A234" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="destGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C9A234" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#C9A234" stopOpacity="0" />
              </radialGradient>
            </defs>

            <g stroke="#C9A234" strokeWidth="0.4" opacity="0.08" fill="none">
              <line x1="0" y1="100" x2="1000" y2="100" strokeDasharray="2 8" />
              <line x1="0" y1="200" x2="1000" y2="200" strokeDasharray="2 8" />
              <line x1="0" y1="300" x2="1000" y2="300" strokeDasharray="2 8" />
              <line x1="0" y1="400" x2="1000" y2="400" strokeDasharray="2 8" />
              <line x1="200" y1="0" x2="200" y2="500" strokeDasharray="2 8" />
              <line x1="400" y1="0" x2="400" y2="500" strokeDasharray="2 8" />
              <line x1="600" y1="0" x2="600" y2="500" strokeDasharray="2 8" />
              <line x1="800" y1="0" x2="800" y2="500" strokeDasharray="2 8" />
            </g>

            <g
              fill="rgba(201,162,52,0.05)"
              stroke="#C9A234"
              strokeWidth="0.7"
              opacity="0.4"
            >
              <path d="M 175 95 Q 250 80 290 110 L 305 150 L 290 200 L 260 240 L 220 260 L 180 240 L 150 200 L 140 160 Z" />
              <path d="M 265 275 L 320 285 L 325 340 L 295 400 L 265 380 L 250 320 Z" />
              <path d="M 478 110 L 540 95 L 580 112 L 570 145 L 530 160 L 480 148 Z" />
              <path d="M 458 102 L 475 96 L 480 116 L 464 122 Z" />
              <path d="M 500 175 L 570 175 L 600 220 L 615 290 L 590 350 L 540 375 L 510 360 L 490 290 L 480 220 Z" />
              <path d="M 580 95 L 700 80 L 800 95 L 880 130 L 895 180 L 880 220 L 820 245 L 750 235 L 700 220 L 660 200 L 620 180 L 595 140 L 585 110 Z" />
              <path d="M 665 200 L 720 205 L 730 230 L 710 265 L 680 250 L 660 220 Z" />
              <path d="M 745 245 L 800 245 L 850 258 L 870 280 L 850 305 L 800 315 L 760 295 L 740 270 Z" />
              <path d="M 870 145 L 885 150 L 880 175 L 870 170 Z" />
              <path d="M 810 355 L 880 350 L 900 380 L 880 405 L 830 410 L 810 390 Z" />
            </g>

            <circle cx="700" cy="190" r="22" fill="url(#originGlow)">
              <animate
                attributeName="r"
                values="14;22;14"
                dur="2.5s"
                begin="indefinite"
                fill="freeze"
              />
            </circle>
            <circle cx="700" cy="190" r="4" fill="#C9A234" />
            <circle
              cx="700"
              cy="190"
              r="8"
              fill="none"
              stroke="#C9A234"
              strokeWidth="1"
              opacity="0.6"
            >
              <animate
                attributeName="r"
                values="6;14;6"
                dur="2.5s"
                begin="indefinite"
                fill="freeze"
              />
              <animate
                attributeName="opacity"
                values="0.7;0;0.7"
                dur="2.5s"
                begin="indefinite"
                fill="freeze"
              />
            </circle>
            <text
              x="700"
              y="168"
              textAnchor="middle"
              fill="#F5E8D3"
              fontFamily="Lato, sans-serif"
              fontSize="11"
              letterSpacing="2.5"
              fontWeight="400"
              opacity="0.85"
            >
              DHAKA
            </text>

            <circle cx="790" cy="250" r="22" fill="url(#destGlow)" />
            <circle cx="790" cy="250" r="4" fill="#C9A234" />
            <text
              x="790"
              y="278"
              textAnchor="middle"
              fill="#F5E8D3"
              fontFamily="Lato, sans-serif"
              fontSize="11"
              letterSpacing="2.5"
              fontWeight="400"
              opacity="0.85"
            >
              KUALA LUMPUR
            </text>

            <path
              ref={pathRef}
              d="M 700 190 Q 680 90 790 250"
              fill="none"
              stroke="#C9A234"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 6px rgba(201,162,52,0.55))' }}
            />

            <g ref={capRef} style={{ opacity: 0 }}>
              <animate
                attributeName="opacity"
                to="1"
                dur="0.3s"
                begin="indefinite"
                fill="freeze"
              />
              <animateMotion
                dur="2.5s"
                begin="indefinite"
                fill="freeze"
                rotate="auto"
              >
                <mpath href="#arcPathDef" />
              </animateMotion>
              <g>
                <polygon points="0,-11 17,0 0,11 -17,0" fill="#C9A234" />
                <path
                  d="M -9 3 Q -9 12 0 12 Q 9 12 9 3"
                  fill="none"
                  stroke="#C9A234"
                  strokeWidth="1.6"
                />
                <circle cx="0" cy="0" r="2" fill="#0A0A0A" />
                <line x1="14" y1="0" x2="20" y2="5" stroke="#C9A234" strokeWidth="1.2" />
                <circle cx="20" cy="5" r="1.8" fill="#C9A234" />
                <circle cx="0" cy="0" r="14" fill="rgba(201,162,52,0.18)" />
              </g>
            </g>
          </svg>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0 mt-20 max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.label} className="contents">
              <div
                ref={(el) => {
                  stepsRef.current[i] = el;
                }}
                className="step-item text-center md:px-10"
                style={{ opacity: 0 }}
              >
                <div className="w-3 h-3 rounded-full bg-gold mx-auto mb-3 ring-4 ring-gold/15" />
                <p
                  className="font-display uppercase tracking-[0.2em] text-gold mb-1"
                  style={{ fontSize: '14px' }}
                >
                  {step.label}
                </p>
                <p
                  className="font-body text-mouse"
                  style={{ fontSize: '11px' }}
                >
                  {step.sublabel}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="w-px h-6 md:h-px md:w-16 lg:w-24"
                  style={{
                    background:
                      'linear-gradient(to bottom, rgba(201,162,52,0.4), rgba(201,162,52,0.15))',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
