import { Suspense, useRef, type ReactNode, type CSSProperties } from 'react';
import { useInView } from '../hooks/useInView';

interface LazySectionProps {
  children: ReactNode;
  /** Skeleton height to reserve layout while loading. Default 60vh. */
  minHeight?: string;
  /** Pre-mount trigger offset. Default '300px' (loads ~300px before viewport). */
  rootMargin?: string;
  /** Threshold at which IntersectionObserver fires. Default 0. */
  threshold?: number;
  /** Custom fallback to render while children are loading. */
  fallback?: ReactNode;
  /** Container id (forwarded). */
  id?: string;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_FALLBACK_STYLE: CSSProperties = {
  minHeight: '60vh',
  background: 'rgba(2, 22, 53,0.4)',
};

function DefaultFallback({ minHeight }: { minHeight: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative w-full flex items-center justify-center"
      style={{ ...DEFAULT_FALLBACK_STYLE, minHeight }}
    >
      <div
        className="w-8 h-8 rounded-full border-2 border-gold/20 border-t-gold animate-spin"
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * LazySection — combines an IntersectionObserver trigger with a
 * <Suspense> boundary. Children are not mounted (and their chunk is not
 * requested) until the section is within `rootMargin` of the viewport.
 *
 * Designed for below-the-fold home page sections to cut the initial bundle.
 */
export function LazySection({
  children,
  minHeight = '60vh',
  rootMargin = '300px',
  threshold = 0,
  fallback,
  id,
  className,
  style,
}: LazySectionProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({
    threshold,
    rootMargin,
    once: true,
  });

  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={style}
      data-lazy-section={isInView ? 'active' : 'pending'}
    >
      {isInView ? (
        <Suspense fallback={fallback ?? <DefaultFallback minHeight={minHeight} />}>
          {children}
        </Suspense>
      ) : (
        fallback ?? <DefaultFallback minHeight={minHeight} />
      )}
    </div>
  );
}

/**
 * IdleSection — renders `children` only after the first requestIdleCallback
 * fires (or fallback to setTimeout). Use for non-critical widgets that don't
 * need to be on the initial render.
 */
export function IdleSection({
  children,
  minHeight = '0px',
  fallback,
}: {
  children: ReactNode;
  minHeight?: string;
  fallback?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} style={{ minHeight }}>
      <Suspense fallback={fallback ?? null}>{children}</Suspense>
    </div>
  );
}

export default LazySection;
