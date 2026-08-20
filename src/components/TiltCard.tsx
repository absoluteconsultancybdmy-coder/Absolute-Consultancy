import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { useTilt } from '../hooks/useTilt';

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
 * TiltCard — a card that tilts in 3D toward the pointer.
 *
 * The tilt itself lives in useTilt; this wraps it with the glare overlay and
 * the transition so the card eases back on leave. Use the hook directly on
 * elements that already have their own hover handlers.
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
  const { onPointerMove, onPointerLeave, glareRef } = useTilt({ max, lift, glare });

  return (
    <div
      {...rest}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
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
          ref={glareRef as React.RefObject<HTMLDivElement | null>}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ opacity: 0, transition: `opacity 400ms ${EASE}` }}
        />
      )}
      {children}
    </div>
  );
}
