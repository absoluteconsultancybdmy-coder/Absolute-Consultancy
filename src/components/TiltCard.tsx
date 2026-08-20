import {
  useCallback,
  useRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface TiltCardProps extends Omit<ComponentPropsWithoutRef<'div'>, 'style'> {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Maximum rotation in degrees at the card's corners. */
  max?: number;
  /** How far the card lifts toward the viewer on hover, in px. */
  lift?: number;
  /** Sheen that tracks the pointer. Off for cards that already carry imagery. */
  glare?: boolean;
}

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

/**
 * TiltCard — pointer-driven 3D tilt.
 *
 * Writes transforms straight to the node instead of through state: a pointermove
 * handler that re-rendered would drop frames on a grid of these. Coalesced into
 * one rAF per frame for the same reason.
 *
 * Pointer type is checked rather than viewport width — a touch device fires
 * pointermove once on tap, which would leave the card stuck mid-tilt.
 */
export default function TiltCard({
  children,
  className,
  style,
  max = 9,
  lift = 14,
  glare = true,
  ...rest
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion || e.pointerType !== 'mouse') return;
      const el = ref.current;
      if (!el) return;

      const { clientX, clientY } = e;
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        const rect = el.getBoundingClientRect();
        // -0.5..0.5 from the card's centre.
        const px = (clientX - rect.left) / rect.width - 0.5;
        const py = (clientY - rect.top) / rect.height - 0.5;

        el.style.transform =
          `perspective(1000px) rotateY(${(px * max * 2).toFixed(2)}deg) ` +
          `rotateX(${(-py * max * 2).toFixed(2)}deg) translateZ(${lift}px)`;

        const g = glareRef.current;
        if (g) {
          g.style.opacity = '1';
          g.style.background =
            `radial-gradient(circle at ${((px + 0.5) * 100).toFixed(1)}% ${((py + 0.5) * 100).toFixed(1)}%, ` +
            'rgb(var(--color-gold) / 0.18), transparent 60%)';
        }
      });
    },
    [max, lift, reducedMotion]
  );

  const handleLeave = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    const el = ref.current;
    if (el) el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    const g = glareRef.current;
    if (g) g.style.opacity = '0';
  }, []);

  return (
    <div
      {...rest}
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={className}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        transition: `transform 500ms ${EASE}`,
        willChange: 'transform',
      }}
    >
      {glare && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ opacity: 0, transition: `opacity 400ms ${EASE}` }}
        />
      )}
      {children}
    </div>
  );
}
