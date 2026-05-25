export default function TrustBar() {
  const badges = [
    { icon: '✓', text: 'Certified Education Counsellors' },
    { icon: '🇲🇾', text: 'Malaysia Registered' },
    { icon: '★', text: '99.9% Visa Success Rate' },
    { icon: '🎓', text: '300+ Students Placed' },
    { icon: '🏛️', text: '30+ Partner Universities' },
    { icon: '✓', text: 'Free Offer Letter Service' },
  ];

  const renderBadges = (keyPrefix: string) =>
    badges.map((badge, i) => (
      <span
        key={`${keyPrefix}-${i}`}
        className="inline-flex items-center gap-2 px-8 font-body uppercase"
        style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(201,162,52,0.85)' }}
      >
        <span>{badge.icon}</span>
        <span>{badge.text}</span>
        <span style={{ color: 'rgba(201,162,52,0.3)', marginLeft: '16px' }}>·</span>
      </span>
    ));

  return (
    <div
      className="fixed top-20 left-0 right-0 z-40 overflow-hidden"
      style={{
        background: 'linear-gradient(90deg, #0B1E42 0%, #0B2A5C 50%, #0B1E42 100%)',
        borderBottom: '1px solid rgba(201,162,52,0.25)',
        height: '36px',
      }}
    >
      <div className="flex items-center h-full w-full overflow-hidden">
        <div className="flex items-center whitespace-nowrap animate-ticker">
          {renderBadges('a')}
          {renderBadges('b')}
        </div>
      </div>

      <style>{`
        .animate-ticker {
          display: flex;
          flex-shrink: 0;
          animation: ticker 30s linear infinite;
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
