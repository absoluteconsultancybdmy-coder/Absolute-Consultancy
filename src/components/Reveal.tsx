import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'tilt';

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  /** Position in a group; multiplies `stagger` to cascade sibling reveals. */
  index?: number;
  stagger?: number;
  delay?: number;
  duration?: number;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
}

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

/**
 * Starting transform per variant. `tilt` leans the element back in 3D so it
 * settles into the page rather than sliding across it — the perspective is
 * applied here rather than on a parent so the effect survives any layout.
 */
const FROM: Record<RevealVariant, string> = {
  up: 'translate3d(0, 28px, 0)',
  down: 'translate3d(0, -28px, 0)',
  left: 'translate3d(-32px, 0, 0)',
  right: 'translate3d(32px, 0, 0)',
  fade: 'none',
  scale: 'scale(0.94)',
  tilt: 'perspective(900px) rotateX(12deg) translate3d(0, 24px, 0)',
};

const TO: Record<RevealVariant, string> = {
  up: 'translate3d(0, 0, 0)',
  down: 'translate3d(0, 0, 0)',
  left: 'translate3d(0, 0, 0)',
  right: 'translate3d(0, 0, 0)',
  fade: 'none',
  scale: 'scale(1)',
  tilt: 'perspective(900px) rotateX(0deg) translate3d(0, 0, 0)',
};

/**
 * Reveal — animates its children in the first time they scroll into view.
 *
 * Deliberately transform/opacity only so every reveal stays on the compositor;
 * under `prefers-reduced-motion` the children render at their final state with
 * no transition at all rather than a shortened one.
 */
export default function Reveal({
  children,
  variant = 'up',
  index = 0,
  stagger = 80,
  delay = 0,
  duration = 700,
  className,
  as,
  style,
}: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  const reducedMotion = usePrefersReducedMotion();
  const Tag = (as ?? 'div') as ElementType;

  if (reducedMotion) {
    return (
      <Tag ref={ref} className={className} style={style}>
        {children}
      </Tag>
    );
  }

  const totalDelay = delay + index * stagger;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: inView ? 1 : 0,
        transform: inView ? TO[variant] : FROM[variant],
        filter: inView ? 'blur(0px)' : 'blur(6px)',
        transition: `opacity ${duration}ms ${EASE} ${totalDelay}ms, transform ${duration}ms ${EASE} ${totalDelay}ms, filter ${duration}ms ${EASE} ${totalDelay}ms`,
        willChange: inView ? undefined : 'transform, opacity, filter',
      }}
    >
      {children}
    </Tag>
  );
}
