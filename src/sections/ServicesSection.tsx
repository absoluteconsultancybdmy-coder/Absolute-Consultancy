import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  GraduationCap,
  ShieldCheck,
  PenTool,
  Banknote,
  Home,
  Plane,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: GraduationCap,
    title: 'University Admissions',
    description:
      'Personalised shortlisting and end-to-end application support for 200+ partner universities worldwide.',
  },
  {
    icon: ShieldCheck,
    title: 'Visa Assistance',
    description:
      '98% approval rate. We handle every document, interview prep, and submission — stress-free.',
  },
  {
    icon: PenTool,
    title: 'SOP & Essay Writing',
    description:
      'Compelling personal statements crafted by expert writers that make your application unforgettable.',
  },
  {
    icon: Banknote,
    title: 'Scholarship Guidance',
    description:
      'Identify and secure grants, bursaries, and full scholarships to make your dream affordable.',
  },
  {
    icon: Home,
    title: 'Accommodation Support',
    description:
      'Safe, vetted student housing arranged before you land so you arrive confident and ready.',
  },
  {
    icon: Plane,
    title: 'Pre-Departure Briefing',
    description:
      'Culture, finances, health insurance, and everything you need to thrive from day one abroad.',
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.service-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
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
      className="relative w-full py-32 lg:py-40 overflow-hidden"
      id="services"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/Absolute-Consultancy/images/services-section.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Heading with hairline rule */}
        <div className="flex items-center gap-6 mb-16">
          <h2
            className="font-display font-bold text-kimono whitespace-nowrap"
            style={{
              fontSize: 'clamp(36px, 7vw, 84px)',
              letterSpacing: '0.05em',
            }}
          >
            OUR SERVICES
          </h2>
          <div className="hairline flex-1" />
        </div>

        {/* Bento Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="service-card glass-card p-10 cursor-default group"
                style={{ opacity: 0 }}
              >
                <Icon
                  className="w-8 h-8 text-lime mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  strokeWidth={1.5}
                />
                <h3 className="small-caps text-kimono mb-4 tracking-[0.18em]">
                  {service.title}
                </h3>
                <p
                  className="text-mouse font-body font-light text-base"
                  style={{ lineHeight: 1.6 }}
                >
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
