import { memo, useEffect, useRef, useState, type CSSProperties } from 'react';

interface ScrambledTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
  duration?: number;
  triggerOn?: 'visible' | 'hover' | 'mount';
}

const SCRAMBLE_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function ScrambledText({
  text,
  className,
  style,
  duration = 1200,
  triggerOn = 'visible',
}: ScrambledTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(text);
  const startedRef = useRef(false);

  useEffect(() => {
    startedRef.current = false;
    setDisplay(text);

    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplay(text);
      return;
    }

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const runScramble = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const totalSteps = Math.max(1, Math.ceil(duration / 50));
      const charsToReveal = text.length;
      const charsPerStep = charsToReveal / totalSteps;
      let step = 0;

      intervalId = setInterval(() => {
        step++;
        const revealed = Math.floor(step * charsPerStep);
        let next = '';
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (i < revealed) {
            next += ch;
          } else if (ch === ' ' || ch === '\n' || ch === '\t') {
            next += ch;
          } else {
            next += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
        }
        setDisplay(next);

        if (revealed >= charsToReveal) {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          setDisplay(text);
        }
      }, 50);
    };

    let cleanupTrigger: (() => void) | undefined;

    if (triggerOn === 'mount') {
      runScramble();
    } else if (triggerOn === 'hover') {
      const handler = () => runScramble();
      el.addEventListener('mouseenter', handler);
      cleanupTrigger = () => el.removeEventListener('mouseenter', handler);
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            runScramble();
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      cleanupTrigger = () => observer.disconnect();
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (cleanupTrigger) cleanupTrigger();
    };
  }, [text, duration, triggerOn]);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}

export default memo(ScrambledText);
