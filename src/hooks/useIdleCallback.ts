import { useEffect, useRef, useState } from 'react';

type IdleCallbackId = number;

interface IdleCallbackWindow {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => IdleCallbackId;
  cancelIdleCallback?: (id: IdleCallbackId) => void;
}

function getIdleApi(): IdleCallbackWindow | null {
  if (typeof window === 'undefined') return null;
  return window as unknown as IdleCallbackWindow;
}

const DEFAULT_TIMEOUT = 2000;

/**
 * useIdleCallback — defers `fn` until the browser is idle. Falls back to
 * setTimeout when `requestIdleCallback` is unavailable (e.g. Safari).
 * Returns a boolean indicating whether the callback has fired.
 *
 * Pass `undefined` for `fn` to use the hook purely as a "browser is now
 * idle" signal that you can branch on in your render.
 */
export function useIdleCallback(fn: (() => void) | undefined, timeout: number = DEFAULT_TIMEOUT): boolean {
  const [fired, setFired] = useState(false);
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const idle = getIdleApi();
    const handle = () => {
      fnRef.current?.();
      setFired(true);
    };

    if (idle?.requestIdleCallback) {
      const id = idle.requestIdleCallback(handle, { timeout });
      return () => idle.cancelIdleCallback?.(id);
    }

    const id = window.setTimeout(handle, Math.min(timeout, 1500));
    return () => window.clearTimeout(id);
  }, [timeout]);

  return fired;
}
