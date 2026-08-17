import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

export function useLenis() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // On mobile/touch devices Lenis is pure overhead: syncTouch is false
    // (touch bypasses it), smoothWheel is unused (no mouse wheel), and the
    // rAF loop still runs every frame. Skip entirely and let the native
    // scroll handle it. ScrollTrigger falls back to native scroll events.
    if (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    // Spec: duration 1.2, exponential ease, no touch smooth-scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Keep mobile scroll native for performance
      syncTouch: false,
    });

    lenisInstance = lenis;

    // Keep GSAP ScrollTrigger in sync with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis via GSAP ticker for frame-perfect sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
