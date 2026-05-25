import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HighlightText from '../components/HighlightText';
import { useInView } from '../hooks/useInView';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  {
    year: 'Founded 2014',
    images: ['/images/about-1a.jpg', '/images/about-1b.jpg'],
    rotation: [-3, 3],
  },
  {
    year: '500 Students',
    images: ['/images/about-2a.jpg', '/images/about-2b.jpg'],
    rotation: [-2, 2],
  },
  {
    year: '2,000+ Placed',
    images: ['/images/about-3a.jpg', '/images/about-3b.jpg'],
    rotation: [-4, 4],
  },
  {
    year: 'Global Reach',
    images: ['/images/about-4a.jpg', '/images/about-4b.jpg'],
    rotation: [-3, 3],
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leftRuleRef = useRef<HTMLDivElement>(null);
  const rightRuleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [contentRef, contentInView] = useInView<HTMLDivElement>({ threshold: 0.15 });

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading animation with hairline rules
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Hairline rules animate from center outward
      gsap.fromTo(
        leftRuleRef.current,
        { scaleX: 0, transformOrigin: 'right center' },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        rightRuleRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Timeline nodes stagger animation
      const nodes = timelineRef.current?.querySelectorAll('.timeline-item');
      if (nodes) {
        gsap.fromTo(
          nodes,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: timelineRef.current,
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
      className="relative w-full bg-mist py-32 lg:py-40"
      id="about"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Heading with hairline rules */}
        <div className="flex items-center justify-center gap-6 mb-20">
          <div ref={leftRuleRef} className="hairline flex-1" style={{ transform: 'scaleX(0)' }} />
          <h2
            ref={headingRef}
            className="font-display font-bold text-kimono text-center whitespace-nowrap"
            style={{
              fontSize: 'clamp(36px, 7vw, 84px)',
              opacity: 0,
              letterSpacing: '0.05em',
            }}
          >
            ABOUT THE FIRM
          </h2>
          <div ref={rightRuleRef} className="hairline flex-1" style={{ transform: 'scaleX(0)' }} />
        </div>

        {/* Two-column layout */}
        <div
          ref={contentRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20"
        >
          {/* Left column - text */}
          <div
            className={`transition-all duration-700 ${
              contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <p
              className="text-kimono/90 font-body font-light text-lg leading-[1.7] mb-8"
              style={{ lineHeight: 1.7 }}
            >
              We've spent over a decade helping students from Bangladesh and
              Malaysia reach the world's greatest universities. Our counsellors
              don't just process applications — they{' '}
              <HighlightText delay={0}>invest in your future</HighlightText>.
            </p>

            <p
              className="text-kimono/90 font-body font-light text-lg"
              style={{ lineHeight: 1.7 }}
            >
              No need to worry about university choices, visa paperwork, or SOP
              writing — everything is handled with precision and care. We'll show
              you which university fits you best, secure your scholarship, and{' '}
              <HighlightText delay={1}>
                walk with you every step of the way
              </HighlightText>
              .
            </p>
          </div>

          {/* Right column - timeline */}
          <div ref={timelineRef} className="relative pl-8">
            {/* Vertical hairline */}
            <div
              className="absolute left-0 top-0 bottom-0 w-px"
              style={{ backgroundColor: 'rgba(201, 162, 52, 0.5)' }}
            />

            {/* Timeline nodes */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="timeline-item timeline-node relative"
                  style={{ opacity: 0 }}
                >
                  <span className="small-caps text-gold block mb-4">
                    {milestone.year}
                  </span>

                  {/* Photo cluster */}
                  <div className="photo-cluster">
                    <img
                      src={milestone.images[0]}
                      alt={`${milestone.year} - photo 1`}
                      loading="lazy"
                    />
                    <img
                      src={milestone.images[1]}
                      alt={`${milestone.year} - photo 2`}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
