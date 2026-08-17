interface UniversityLogoProps {
  shortName: string;
  accent: string;
  logoFile?: string;
  size?: number;
  className?: string;
}

const LOGO_FILES: Record<string, string> = {
  "Taylor's": 'tayloruniversitylogo.jpg',
  'UCSI': 'UCSIlogo.jpg',
};

const NAME_OVERRIDES: Record<string, string> = {
  'APU': 'APU',
  'INTI': 'INTI',
  'IIUM': 'IIUM',
  'IUKL': 'IUKL',
  'MAHSA': 'MAHSA',
  'MMU': 'MMU',
  'UCSI': 'UCSI',
  'UOW': 'UOW',
  'SEGi': 'SEGi',
  'UniKL': 'UniKL',
  'UNITAR': 'UNITAR',
  'UNIRAZAK': 'UniRazak',
  'IIMAT': 'IIMAT',
  'LSBF': 'LSBF',
  'UniCam': 'UCAM',
  'UCMI': 'UCMI',
  'UniMY': 'UniMY',
};

function getInitials(name: string): string {
  const cleaned = name.replace(/[''`]/g, '').trim();
  const words = cleaned.split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return name.slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function isLight(hex: string): boolean {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return true;
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

export default function UniversityLogo({
  shortName,
  accent,
  logoFile,
  size = 72,
  className = '',
}: UniversityLogoProps) {
  const file = logoFile ?? LOGO_FILES[shortName];
  const display = NAME_OVERRIDES[shortName] ?? shortName;
  const initials = getInitials(shortName);
  const light = isLight(accent);
  const textColor = light ? '#1a1a1a' : '#ffffff';
  const bgColor = light ? 'rgba(255,255,255,0.96)' : accent;

  if (file) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden bg-white ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '14px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(201,162,52,0.18)',
          padding: '8px',
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}images/${file}`}
          alt={`${shortName} logo`}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '14px',
        background: bgColor,
        boxShadow: '0 4px 14px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(201,162,52,0.18)',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -size * 0.4,
          right: -size * 0.4,
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: -size * 0.3,
          left: -size * 0.3,
          width: size * 0.5,
          height: size * 0.5,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.06)',
        }}
      />
      <span
        style={{
          position: 'relative',
          color: textColor,
          fontFamily: '"Oswald", "Arial Narrow", sans-serif',
          fontWeight: 700,
          fontSize: size * 0.22,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          lineHeight: 1,
          textAlign: 'center',
          padding: '0 6px',
        }}
      >
        {display}
      </span>
      <span
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 4,
          right: 6,
          fontFamily: '"Oswald", "Arial Narrow", sans-serif',
          fontSize: size * 0.11,
          fontWeight: 500,
          letterSpacing: '0.1em',
          color: light ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.55)',
        }}
      >
        {initials}
      </span>
    </div>
  );
}
