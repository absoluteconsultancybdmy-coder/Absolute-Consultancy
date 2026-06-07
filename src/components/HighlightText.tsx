import { memo, useEffect } from 'react';
import { useInView } from '../hooks/useInView';

interface HighlightTextProps {
  children: string;
  delay?: number;
  className?: string;
}

function HighlightText({ children, delay = 0, className = '' }: HighlightTextProps) {
  const [ref, isInView] = useInView<HTMLSpanElement>({ threshold: 0.5 });

  useEffect(() => {
    if (isInView && ref.current) {
      ref.current.classList.add('highlight-active');
    }
  }, [isInView, ref]);

  return (
    <span
      ref={ref}
      className={`highlight-text ${delay > 0 ? `highlight-delay-${delay}` : ''} ${className}`}
    >
      {children}
    </span>
  );
}

export default memo(HighlightText);
