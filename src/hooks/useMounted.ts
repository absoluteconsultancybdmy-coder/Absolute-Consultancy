import { useEffect, useState } from 'react';

/**
 * useMounted — returns `true` after the component has mounted on the client.
 * Use to guard against running browser-only side effects during SSR / hydration.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  return mounted;
}
