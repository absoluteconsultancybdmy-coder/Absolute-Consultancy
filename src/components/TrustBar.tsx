import { useEffect, useRef } from 'react';

export default function TrustBar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);

  const badges = [
    { icon: '✓', text: 'Certified Education Counsellors' },
    { icon: '🇧🇩', text: 'Bangladesh Registered' },
    { icon: '★', text: '99% Visa Success Rate' },
    { icon: '🎓', text: '300+ Students Placed' },
    { icon: '🏛️', text: '30+ Partner Universities' },
    { icon: '✓', text: 'Free Offer Letter Service' },
  ];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const startAnimation = () => {
      if (!track) return;
      const singleWidth = track.scrollWidth / 2;
      if (singleWidth === 0) {
        requestAnimationFrame(startAnimation);
        return;
      }

      // Start off-screen LEFT, move RIGHT
      posRef.current = -singleWidth;
      const speed = 60;
      let lastTime = performance.now();

      const animate = (now: number) => {
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        posRef.current += speed * delta;

        if (posRef.current >= 0) {
          posRef.current = -singleWidth;
        }

        track.style.transform = `translateX(${posRef.current}px)`;
        rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);
    };

    const timer = setTimeout(startAnimation, 100);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const renderBadges = (keyPrefix: string) =>
    badges.map((badge, i) => (
      <span
        key={`${keyPrefix}-${i}`}
        className="inline-flex items-center gap-2 px-8 font-body uppercase flex-shrink-0"
        style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgb(var(--color-gold) / 0.85)' }}
      >
        <span>{badge.icon}</span>
        <span>{badge.text}</span>
        <span style={{ color: 'rgb(var(--color-gold) / 0.3)', marginLeft: '16px' }}>·</span>
      </span>
    ));

  return (
    <div
      className="on-navy fixed top-20 left-0 right-0 z-40 overflow-hidden"
      style={{
        background: 'linear-gradient(90deg, #031D4C 0%, #052458 50%, #031D4C 100%)',
        borderBottom: '1px solid rgb(var(--color-gold) / 0.25)',
        height: '36px',
      }}
    >
      <div
        ref={trackRef}
        className="flex items-center h-full whitespace-nowrap will-change-transform"
        style={{ width: 'max-content' }}
      >
        {renderBadges('a')}
        {renderBadges('b')}
      </div>
    </div>
  );
}
