import { forwardRef, useCallback, useRef, type CSSProperties, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  as?: 'a' | 'button';
}

const DEFAULT_CLASS =
  'inline-block bg-gold text-navy font-display font-bold tracking-widest uppercase px-12 py-4 rounded-full hover:bg-gold/90 transition-colors duration-300';
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const MagneticButton = forwardRef<HTMLElement, MagneticButtonProps>(function MagneticButton(
  { children, href, onClick, className, strength = 0.4, as },
  forwardedRef
) {
  const innerRef = useRef<HTMLElement | null>(null);

  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    [forwardedRef]
  );

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLElement>) => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const el = innerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${(x * strength).toFixed(2)}px, ${(y * strength).toFixed(2)}px)`;
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.transform = 'translate(0px, 0px)';
  }, []);

  const baseStyle: CSSProperties = {
    transition: `transform 400ms ${EASE}`,
    willChange: 'transform',
    touchAction: 'manipulation',
  };

  const Tag: 'a' | 'button' = as ?? (href ? 'a' : 'button');
  const combinedClass = [DEFAULT_CLASS, className].filter(Boolean).join(' ');

  if (Tag === 'a') {
    return (
      <a
        ref={setRefs as unknown as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        onMouseLeave={handleMouseLeave as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        className={combinedClass}
        style={baseStyle}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={setRefs as unknown as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove as unknown as React.MouseEventHandler<HTMLButtonElement>}
      onMouseLeave={handleMouseLeave as unknown as React.MouseEventHandler<HTMLButtonElement>}
      className={combinedClass}
      style={baseStyle}
    >
      {children}
    </button>
  );
});

export default MagneticButton;
