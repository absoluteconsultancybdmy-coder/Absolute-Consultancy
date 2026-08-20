import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface UseTiltOptions {
  /** Maximum rotation in degrees at the element's corners. */
  max?: number;
  /** How far the element lifts toward the viewer, in px. */
  lift?: number;
  /**
   * Track the pointer with a sheen. Attach the returned `glareRef` to an
   * overlay element; the hook owns that ref rather than accepting one, because
   * writing to a ref handed in as a hook argument breaks the compiler's
   * immutability rule.
   */
  glare?: boolean;
}

/**
 * useTilt — pointer-driven 3D tilt handlers for any element.
 *
 * Transforms are written straight to the node rather than held in state: a
 * pointermove that re-rendered would drop frames across a grid of cards. Moves
 * are coalesced into one rAF per frame for the same reason.
 *
 * Pointer type is checked rather than viewport width — a touch device fires
 * pointermove once on tap, which would leave the element stuck mid-tilt.
 */
export function useTilt({ max = 9, lift = 12, glare = false }: UseTiltOptions = {}) {
  const frameRef = useRef<number | null>(null);
  const glareRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (reducedMotion || e.pointerType !== 'mouse') return;
      const el = e.currentTarget;
      const { clientX, clientY } = e;
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        const rect = el.getBoundingClientRect();
        // -0.5..0.5 from the element's centre.
        const px = (clientX - rect.left) / rect.width - 0.5;
        const py = (clientY - rect.top) / rect.height - 0.5;

        el.style.transform =
          `perspective(1000px) rotateY(${(px * max * 2).toFixed(2)}deg) ` +
          `rotateX(${(-py * max * 2).toFixed(2)}deg) translateZ(${lift}px)`;

        const g = glare ? glareRef.current : null;
        if (g) {
          g.style.opacity = '1';
          g.style.background =
            `radial-gradient(circle at ${((px + 0.5) * 100).toFixed(1)}% ${((py + 0.5) * 100).toFixed(1)}%, ` +
            'rgb(var(--color-gold) / 0.18), transparent 60%)';
        }
      });
    },
    [max, lift, reducedMotion, glare]
  );

  const onPointerLeave = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      // Reset on the next frame, matching onPointerMove: both style writes then
      // land in the same phase, so a leave never races a queued move.
      const el = e.currentTarget;
      window.requestAnimationFrame(() => {
        el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
        const g = glare ? glareRef.current : null;
        if (g) g.style.opacity = '0';
      });
    },
    [glare]
  );

  return { onPointerMove, onPointerLeave, glareRef };
}
