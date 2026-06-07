import { memo } from 'react';
import { Flag, Award, Building2, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TrustItem {
  icon: LucideIcon;
  label: string;
}

const items: TrustItem[] = [
  { icon: Flag, label: 'Bangladeshi-Owned' },
  { icon: Award, label: '99% Visa Success' },
  { icon: Building2, label: '30+ Universities' },
  { icon: Users, label: '300+ Students Placed' },
];

function TrustStrip() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(90deg, #0B1E42 0%, #0B2A5C 50%, #0B1E42 100%)',
        height: '60px',
        borderTop: '1px solid rgba(201,162,52,0.2)',
        borderBottom: '1px solid rgba(201,162,52,0.2)',
      }}
      role="complementary"
      aria-label="Trust signals"
    >
      <div className="h-full max-w-[1400px] mx-auto px-4 flex items-center justify-center">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center">
              <div className="flex items-center gap-2 px-3 sm:px-5 lg:px-7">
                <Icon
                  size={24}
                  strokeWidth={1.5}
                  className="text-gold flex-shrink-0"
                />
                <span
                  className="font-body uppercase text-kimono whitespace-nowrap"
                  style={{ fontSize: 'clamp(9px, 1.1vw, 11px)', letterSpacing: '0.18em' }}
                >
                  {item.label}
                </span>
              </div>
              {i < items.length - 1 && (
                <span
                  className="block w-px h-5 bg-gold/30 flex-shrink-0"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(TrustStrip);
