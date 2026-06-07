import { memo, useCallback } from 'react';

interface SectionLabelProps {
  name: string;
  className?: string;
}

function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function SectionLabel({ name, className = '' }: SectionLabelProps) {
  const id = `label-${toKebabCase(name)}`;

  const handleClick = useCallback(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [id]);

  return (
    <div
      id={id}
      data-section-label
      className={`flex items-center justify-center gap-3 sm:gap-5 select-none ${className}`}
    >
      <span
        className="h-px w-8 sm:w-14 md:w-20"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(201,162,52,0.55) 100%)',
        }}
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={handleClick}
        className="small-caps text-gold/80 hover:text-gold transition-colors duration-300 cursor-pointer bg-transparent border-0 p-0"
        style={{ fontSize: '10px', letterSpacing: '0.32em' }}
        aria-label={`Jump to ${name}`}
      >
        {name}
      </button>
      <span
        className="h-px w-8 sm:w-14 md:w-20"
        style={{
          background:
            'linear-gradient(270deg, transparent 0%, rgba(201,162,52,0.55) 100%)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}

export default memo(SectionLabel);

