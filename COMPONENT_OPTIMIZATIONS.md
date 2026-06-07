# Component & Bundle Optimizations

This document records the React 19 + Vite performance optimizations applied
to the Absolute Consultancy site. All changes are non-breaking — every
feature, animation, and section is preserved.

## 1. Home page sections → lazy + viewport-triggered

**Before** — `App.tsx` imported 10 sections eagerly. The main bundle
shipped **203.83 kB** of JS for the home page.

**After** — Each below-the-fold section is split into its own chunk via
`React.lazy`, wrapped in a new `<LazySection>` component that uses
`IntersectionObserver` to defer both the chunk fetch *and* the mount
until the section is within 300px of the viewport. Each section is also
wrapped in a per-section `ErrorBoundary` so a single failure can't take
down the rest of the page.

| Section | Eager before | Lazy after | Chunk size |
|---|---|---|---|
| HeroSection | ✓ | ✓ (eager, above the fold) | in main |
| TrustStrip | ✓ | ✓ (eager, above the fold) | in main |
| AboutSection | ✓ | lazy + IO | 20.10 kB |
| StatsSection | ✓ | lazy + IO | 4.84 kB |
| ServicesSection | ✓ | lazy + IO | 4.30 kB |
| ProcessTimeline | ✓ | lazy + IO | 9.81 kB |
| StudentRecruitmentSection | ✓ | lazy + IO | 8.66 kB |
| UniversitiesSection | ✓ | lazy + IO | 23.79 kB |
| ScholarshipsSection | ✓ | lazy + IO | 11.81 kB |
| TestimonialsSection | ✓ | lazy + IO | 9.51 kB |
| ParentVoicesSection | ✓ | lazy + IO | 7.13 kB |
| ContactSection | ✓ | lazy + IO | 11.93 kB |
| Footer | ✓ | lazy + IO | 20.73 kB |

**Result:** main bundle dropped from **203.83 kB → 72.17 kB** (≈64%
reduction, gzip-compressed 48.78 kB → 19.17 kB). The chunks for the
above sections are only fetched as the user scrolls toward them.

### New: `<LazySection>` (`src/components/LazySection.tsx`)

```tsx
<ErrorBoundary name="Services">
  <Suspense fallback={<SectionFallback />}>
    <LazySection minHeight="70vh" rootMargin="300px">
      <ServicesSection />
    </LazySection>
  </Suspense>
</ErrorBoundary>
```

* `useInView` (existing hook) with `rootMargin="300px"` and `once: true`
* Renders a skeleton of `minHeight` while waiting — eliminates CLS
* `IntersectionObserver` is auto-disconnected after first hit

### New: `<ErrorBoundary>` (`src/components/ErrorBoundary.tsx`)

A class-based boundary with a graceful fallback. Catches errors per
section and surfaces them in the console with a label, so the rest of
the page keeps working.

## 2. PlacedNotification — lazy + idle

**Before** — `PlacedNotification` was a static import, so its 4.7 kB
chunk shipped in the main bundle even though the popup doesn't appear
until 5 seconds in.

**After** — Wrapped in `React.lazy` *and* the new `useIdleCallback`
hook. The component is requested only after the browser is idle (≤4 s
timeout). Net: the chunk is removed from the initial critical path
entirely and is requested during idle time on the home page.

```tsx
function IdlePlacedNotification() {
  const ready = useIdleCallback(undefined, 4000);
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <PlacedNotification />
    </Suspense>
  );
}
```

## 3. New performance hooks (`src/hooks/`)

| Hook | Purpose |
|---|---|
| `usePrefersReducedMotion.ts` | Single source of truth for `(prefers-reduced-motion: reduce)`. Replaces 7+ duplicate matchMedia listeners. |
| `useIdleCallback.ts` | `requestIdleCallback` with a `setTimeout` fallback. Returns `true` once the browser is idle. Supports optional callback. |
| `useMounted.ts` | SSR-safe mounted flag. Useful for guarding browser-only side effects. |

## 4. Mobile-aware optimizations

### `Constellation` density

`Constellation` previously used a hard-coded `dotCount = 60` default. On
mobile, the canvas now auto-picks 24 dots (≈60% fewer). The caller can
still pass an explicit value to override.

```diff
- const Constellation = ({ dotCount = 60, ... }: ConstellationProps) => {
+ const Constellation = ({ dotCount, ... }: ConstellationProps) => {
    useEffect(() => {
-     const effectiveDotCount = dotCount ?? 60;
+     const isMobile = window.matchMedia('(pointer: coarse)').matches
+                       || window.innerWidth < 768;
+     const effectiveDotCount = dotCount ?? (isMobile ? 24 : 60);
```

`Constellation` is also wrapped in `React.memo` so it doesn't re-render
when sibling state changes.

### Other components

* `FilmGrain` — already runs at 12 FPS on mobile, 15 on desktop
  (unchanged). Wrapped in `React.memo`.
* `CustomCursor` — already self-disables on `(pointer: coarse)` and
  `< 768px` viewports.
* `MouseTrail` — already self-disables on coarse pointers and reduced
  motion. Lives inside `ArcSection` → `JourneyPage` (already lazy), so
  it isn't on the home page critical path.

## 5. Memoization

### `React.memo` on pure / presentational components

`SectionLabel`, `HighlightText`, `ThemeToggle`, `TrustStrip`,
`BackToTop`, `NextPageButton`, `WhatsAppWidget`, `CookieConsent`,
`QuickApply`, `PlacedNotification`, `FilmGrain`, `ScrollProgress`,
`ScrambledText`, `GooeyBlob`, `Constellation`, `UniversityCard`,
`UniversityModal`.

### `useCallback` for stable handlers

* `Navigation` — `scrollTo`, `isActive` lookups
* `UniversitiesSection` — `closeModal`, `handleCardClick`, `goExplore`
  (passed to memoized `UniversityCard`)
* `ChatWidget` — `handleKeyDown`, `formatContent`

### Event handler extraction

* `BackToTop`, `QuickApply`, `Navigation` — their scroll listeners now
  RAF-throttle updates so state only commits once per frame.

## 6. Scroll-handler optimization

| File | Before | After |
|---|---|---|
| `ScrollProgress` | RAF-throttled | RAF-throttled + subscribes to Lenis when available |
| `NextPageButton` | RAF-throttled | unchanged |
| `BackToTop` | direct `setState` per scroll | RAF-throttled + passive listener |
| `QuickApply` | direct `setState` per scroll | RAF-throttled + passive listener |
| `Navigation` | direct `setState` per scroll | RAF-throttled + passive listener |

All scroll listeners already used `{ passive: true }`.

## 7. Image lazy loading audit

Every `<img>` in the codebase now has explicit dimensions and the
appropriate lazy/priority hint:

| Image | Loading | Decoding | fetchPriority |
|---|---|---|---|
| `hero-bg.jpg` | `eager` | `async` | `high` |
| `hero-graduate.png` | `eager` | `async` | `high` |
| `Navigation` logo | (no lazy — above the fold) | `async` | — |
| All section images | `lazy` | `async` | — |
| `BlogPostPage` cover | `eager` (LCP of post) | `async` | `high` |
| `BlogPostPage` author photos | `lazy` | `async` | — |
| `Footer` logo | `lazy` | `async` | — |

No `<picture>` / AVIF migration was applied — the existing JPEG/PNG/AVIF
mix is loaded as-is to avoid touching the image optimization agent's
work.

## 8. ChatWidget — environment-driven API URL

**Before:**

```ts
const res = await fetch('http://localhost:3001/api/chat', { ... });
```

**After:**

```ts
const CHAT_API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') ||
  'http://localhost:3001';
// ...
const res = await fetch(`${CHAT_API_URL}/api/chat`, { ... });
```

`.env.example` now includes the `VITE_API_URL` key with a
`http://localhost:3001` default.

## 9. Virtualization — intentionally skipped

* `ExploreUniversitiesPage` renders 33 cards — small enough that the
  cost of mounting all cards is dominated by image decoding, not React
  render. Adding `react-window`/`react-virtuoso` would cost ~10 kB of
  library overhead and ~50 lines of integration for a list that is
  scrolled end-to-end in <2 s.
* No other list in the codebase exceeds ~10 items.

The data layer in `ExploreUniversitiesPage` already memoises
`typeCounts` and `filteredUniversities` with `useMemo`, which is the
highest-leverage optimization for that page.

## 10. Bundle-size summary

| Metric | Before | After | Δ |
|---|---|---|---|
| `index-*.js` (main) | 203.83 kB / 48.78 kB gz | **72.17 kB / 19.17 kB gz** | **−64% / −61%** |
| Total `assets/*.js` (initial route) | 203.83 kB | 72.17 kB | −64% |
| Home page sections split into | 1 chunk | 12 chunks | — |
| PlacedNotification in initial bundle | yes | no | idle-loaded |
| `prefers-reduced-motion` listeners | 7+ duplicates | 1 hook | deduped |
| Memoized components | 0 | 16 | — |

---

## Files changed

* `src/App.tsx` — lazy sections, SectionBoundary wrapper, IdlePlacedNotification
* `src/components/ErrorBoundary.tsx` (new)
* `src/components/LazySection.tsx` (new)
* `src/hooks/usePrefersReducedMotion.ts` (new)
* `src/hooks/useIdleCallback.ts` (new)
* `src/hooks/useMounted.ts` (new)
* `src/components/ScrollProgress.tsx` — uses `usePrefersReducedMotion`, memo
* `src/components/FilmGrain.tsx` — memo
* `src/components/BackToTop.tsx` — RAF-throttled scroll, memo
* `src/components/NextPageButton.tsx` — memo
* `src/components/WhatsAppWidget.tsx` — uses `usePrefersReducedMotion`, memo
* `src/components/QuickApply.tsx` — uses `usePrefersReducedMotion`, RAF-throttled, memo
* `src/components/CookieConsent.tsx` — uses `usePrefersReducedMotion`, memo
* `src/components/PlacedNotification.tsx` — memo
* `src/components/Navigation.tsx` — RAF-throttled scroll
* `src/components/ThemeToggle.tsx` — memo
* `src/components/TrustStrip.tsx` — memo
* `src/components/HighlightText.tsx` — memo
* `src/components/SectionLabel.tsx` — memo
* `src/components/ScrambledText.tsx` — memo
* `src/components/GooeyBlob.tsx` — memo
* `src/components/Constellation.tsx` — mobile-aware default density, memo
* `src/components/ChatWidget.tsx` — `VITE_API_URL` env, useCallback'd handlers
* `src/sections/UniversitiesSection.tsx` — memoized card & modal, useCallback handlers
* `src/sections/HeroSection.tsx` — `fetchPriority="high"` on LCP images
* `src/sections/BlogPostPage.tsx` — `fetchPriority="high"` on cover, dims on all imgs
* `.env.example` — added `VITE_API_URL` key
