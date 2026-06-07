import { useEffect, useState } from 'react';

/**
 * useMounted — returns `true` after the component has mounted on the client.
 * Use to guard against running browser-only side effects during SSR / hydration.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
