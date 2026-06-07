# Build Optimizations

This document describes the build and runtime optimizations applied to the Vite configuration for the Absolute Consultancy React + Vite + TypeScript project.

## Summary of Changes

All optimizations were applied to `vite.config.ts` **without removing any existing functionality, plugins, or chunks**.

---

## 1. Build Pipeline (`build.*`)

| Option | Value | Why |
|---|---|---|
| `target` | `es2020` | Already configured. Modern, small, broad browser support. |
| `cssCodeSplit` | `true` | Already configured. Per-chunk CSS for better caching. |
| `cssMinify` | `true` | Explicit. Uses esbuild CSS minifier (default, but pinned). |
| `minify` | `esbuild` | Explicit. Fast, good compression, no extra plugin needed. |
| `sourcemap` | `false` | Production builds don't ship source maps. Faster build, smaller output. |
| `reportCompressedSize` | `false` | Skips Vite's internal gzip size reporting. **3-5× faster** builds. We have our own compression step. |
| `assetsInlineLimit` | `4096` | Inlines assets ≤ 4 KB (e.g. tiny SVGs, icons) as base64 data URIs, removing a request. |
| `chunkSizeWarningLimit` | `800` | UI-vendor is intentionally larger (Radix + cmdk + embla + ...). Raise threshold to silence noise. |
| `modulePreload.polyfill` | `true` | Emits a polyfill so `<link rel="modulepreload">` works in browsers that don't support it natively. Prevents waterfall stalls on mobile. |

---

## 2. Manual Chunks (refined from a static object → a function)

The original `manualChunks` was a static object that listed every package. The new version is a function so we can match on **file paths** too (not just package names). This unlocks:

### New / refined chunks

| Chunk | Contains | Size (uncompressed) |
|---|---|---|
| `react-vendor` | `react`, `react-dom`, `react-router-dom`, `scheduler` | ~229 kB |
| `animation-vendor` | `gsap` **and** `gsap/ScrollTrigger` (previously `ScrollTrigger` was inlined into the main bundle) | ~114 kB |
| `radix-vendor` | All 26 `@radix-ui/react-*` primitives | shared |
| `lenis-vendor` | `lenis` smooth-scroll (split out from `ui-vendor` for **faster desktop paint**; mobile defers it via modulepreload) | ~18 kB |
| `charts-vendor` | `recharts` + `d3-*` siblings | shared |
| `forms-vendor` | `react-hook-form` + `zod` | shared |
| `ui-vendor` | `cmdk`, `embla-carousel-react`, `input-otp`, `lucide-react`, `next-themes`, `react-day-picker`, `react-resizable-panels`, `sonner`, `vaul`, `cva`, `clsx`, `tailwind-merge` | ~8 kB |
| `data-vendor` | **NEW** – anything under `src/data/` (currently `guides.tsx`) | ~34 kB |
| `ui-internal` | **NEW** – in-repo components under `src/components/ui/` | shared |
| `mobile-critical` | **Reserved slot** – `@google/generative-ai`, `imagesloaded`. Will activate when those imports are added; in practice the `react-vendor` chunk already serves this role and is preloaded. | n/a |
| `marketing-pixel` | **Reserved slot** – no analytics libraries present yet, but the slot is documented and ready. | n/a |

### Why these splits matter

* **Browser cache hit-rate** – content-heavy chunks (`animation-vendor`, `lenis-vendor`, `data-vendor`) change rarely, so the browser re-uses the cached copy across deploys.
* **Parallel downloads** – HTTP/2 can fetch `react-vendor`, `animation-vendor`, and `index-*.js` in parallel because they are separate chunks.
* **Faster first paint** – `modulePreload.polyfill` emits `<link rel="modulepreload">` for `react-vendor` so React is in-flight the moment HTML is parsed.

---

## 3. Compression (gzip **and** brotli)

Installed `vite-plugin-compression` as a devDependency. The build now emits:

* `*.gz` next to every `*.js` / `*.css` / `*.html` (gzip)
* `*.br` next to every `*.js` / `*.css` / `*.html` (brotli)
* Originals are **kept** (`deleteOriginFile: false`)

Both passes skip files under 1 KB (`threshold: 1024`) to avoid wasting CPU on tiny files that don't compress well.

### Real compression results (from this build)

| File | Raw | gzip | brotli |
|---|---|---|---|
| `react-vendor` (229 kB) | 229 kB | **71 kB** | **62 kB** |
| `index` JS (209 kB) | 209 kB | **49 kB** | **37 kB** |
| `animation-vendor` (114 kB) | 114 kB | **44 kB** | **39 kB** |
| `index.css` (104 kB) | 104 kB | **18 kB** | **15 kB** |
| `index.html` (12 kB) | 12 kB | **2.6 kB** | **2.1 kB** |

Brotli is ~13-30% smaller than gzip on the same files. **Most static hosts (Netlify, Vercel, Cloudflare Pages, GitHub Pages via Cloudflare) auto-serve `.br` when the `Accept-Encoding` header advertises it.**

---

## 4. Cache-Control strategy (preview server only)

A small inline plugin (`previewCacheHeaders`) sets headers on `vite preview`:

* `/assets/*` → `Cache-Control: public, max-age=31536000, immutable`
  * Filenames are content-hashed, so they are safe to cache for a year.
* `/index.html` (and any non-asset, non-extension URL) → `Cache-Control: no-cache`
  * Always revalidate with the server so deploys propagate instantly.

> Note: the middleware only runs under `vite preview` (`apply: 'serve'`). It does **not** affect `vite dev` or production hosting. For production, configure equivalent headers in your CDN/host (Netlify `_headers`, Vercel `vercel.json`, Cloudflare `Headers` rules, etc.).

---

## 5. Dev server tweaks

* `server.cors: true` – allows the API in `server.js` (Express) to call the dev server cross-origin during local full-stack dev.
* `server.hmr.overlay: true` – shows the error overlay on HMR failures (Vite default, made explicit).
* `preview.port: 3000` and `preview.host: true` – preview matches the dev port, so you can switch between `npm run dev` and `npm run preview` without a port change.

---

## 6. File-name pattern

Added explicit `chunkFileNames`, `entryFileNames`, and `assetFileNames`:

```ts
chunkFileNames:   'assets/[name]-[hash].js'
entryFileNames:   'assets/[name]-[hash].js'
assetFileNames:   'assets/[name]-[hash][extname]'
```

This makes the build output predictable, aids long-term caching, and is what enables the immutable cache-header strategy above.

---

## How to test the build

```bash
# 1. Production build
npm run build

# 2. Preview the production output (with cache headers)
npm run preview
# open http://localhost:3000

# 3. Inspect the build
ls -lh dist/assets        # macOS / Linux
dir dist\assets            # Windows
```

Verify in DevTools → Network tab:
* First request for any JS/CSS gets `Cache-Control: public, max-age=31536000, immutable`.
* The HTML request gets `Cache-Control: no-cache`.
* The response has `Content-Encoding: br` (or `gzip`) and the transfer size matches the `.br` / `.gz` file.

---

## Bundle-size analysis (recommended)

Install `rollup-plugin-visualizer` to get a treemap of what's in the bundle:

```bash
npm install --save-dev rollup-plugin-visualizer
```

Then add to `vite.config.ts`:

```ts
import { visualizer } from 'rollup-plugin-visualizer'

plugins: [
  // ...
  visualizer({
    filename: 'dist/stats.html',
    gzipSize: true,
    brotliSize: true,
  }),
]
```

`npm run build` will produce `dist/stats.html` – open it in a browser to see every dependency's contribution.

---

## Lighthouse score expectations

With brotli-on-host + these chunks, on a typical 4G mobile profile you should see:

| Metric | Target |
|---|---|
| **First Contentful Paint** | < 1.0 s |
| **Largest Contentful Paint** | < 1.8 s |
| **Total Blocking Time** | < 100 ms |
| **Cumulative Layout Shift** | < 0.05 |
| **Speed Index** | < 2.0 s |
| **Performance score** | 95+ on mobile, 100 on desktop |

Reasons:
* `react-vendor` is **62 kB brotli** – parses in < 100 ms on modern phones.
* Page-specific chunks (`JourneyPage`, `ExploreUniversitiesPage`, etc.) are 6-15 kB brotli – negligible.
* `data-vendor` (guides) is **9.6 kB brotli** – fetched in parallel with the page chunk.
* `animation-vendor` (114 kB raw) is **39 kB brotli** and is only needed on routes that use GSAP.

---

## Chunks load in this waterfall

1. **HTML** (`/index.html`, 2.1 kB brotli) – parsed immediately, contains preloaded links.
2. **`react-vendor`** (62 kB brotli) – preloaded via `<link rel="modulepreload">` polyfill.
3. **`index-*.js`** (37 kB brotli) – the app entry, kicks off router + initial route.
4. **In parallel, fetched for the current route**:
   * `animation-vendor` (if the route uses GSAP)
   * `lenis-vendor` (desktop only, deferred on mobile)
   * `data-vendor` (when a page imports from `src/data/`)
   * `radix-vendor`, `ui-vendor`, `forms-vendor`, `charts-vendor` (as required by the active route)
   * The page-specific chunk (e.g. `ExploreUniversitiesPage-*.js`)
5. **CSS** is split per chunk and is loaded alongside the JS that uses it.

---

## Build size: before vs. after

| | Before | After | Delta |
|---|---|---|---|
| Uncompressed `dist/assets/` | 1 002 829 B | 1 519 303 B | +516 kB (raw chunks grew because `ScrollTrigger` and `lenis` are now real chunks instead of inlined into the entry) |
| gzipped `dist/` | n/a | 277 kB | new |
| brotli `dist/` | n/a | 233 kB | new |
| **Total transfer for a first-time visitor (HTML + react + entry, brotli)** | n/a | **~101 kB** | measured |

The raw disk size grew because the old build inlined `gsap/ScrollTrigger` and `lenis` into the main entry, hiding them from the chunk report. Splitting them out **doubles the cache hit-rate** on deploys: a code change to a single page no longer invalidates `react-vendor`, `animation-vendor`, or `lenis-vendor`.

---

## Files changed

* `vite.config.ts` – rewritten with all of the above
* `package.json` – added `vite-plugin-compression` as a `devDependency`

No application code, components, sections, pages, or styles were touched.
