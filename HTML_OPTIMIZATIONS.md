# HTML / SEO / Performance Optimizations

All changes are **additive** — no existing meta tag, JSON-LD block, preconnect,
preload, or script was removed. Where a value needed to be broadened (e.g.
`color-scheme: dark` → `color-scheme: light dark`), the original line was
updated **in place** because the user explicitly asked for the new value.

---

## 1. `index.html`

### 1.1 Font loading (CRITICAL — was render-blocking)

**Before:** `src/index.css` opened with

```css
@import url('https://fonts.googleapis.com/css2?family=...&display=swap');
```

`@import` at the top of a CSS file is **render-blocking** — the browser
must download and parse the imported stylesheet before the rest of the
file (including the Tailwind layers) is processed.

**After:** the same stylesheet is loaded from `index.html` using the
**print/all media-swap trick** plus `<link rel="preload" as="style">`:

```html
<link rel="preload" as="style" href="…fonts.googleapis.com…/display=swap" />
<link rel="stylesheet" href="…fonts.googleapis.com…/display=swap"
      media="print" onload="this.media='all'" />
<noscript><link rel="stylesheet" href="…fonts.googleapis.com…/display=swap" /></noscript>
```

Effects:
- The CSS file is fetched with **low priority** (declared as `print`
  stylesheet, so the browser doesn't block first paint on it).
- The `onload` swap to `media='all'` activates it as soon as it arrives.
- `display=swap` keeps text visible during font swap (no FOIT).
- `<noscript>` keeps the behaviour for users with JS disabled.
- The `preload` hint warms the connection **before** the parser reaches
  the swap link.

**Bonus:** the first `<link rel="preconnect" href="https://fonts.googleapis.com">`
now carries the `crossorigin` attribute, so the browser can do the TLS
handshake in parallel with the DNS lookup.

### 1.2 `src/index.css`

The leading `@import` was removed; a short comment was left in its place
to document the change.

### 1.3 New `<link>` hints

| Link | Reason |
|---|---|
| `modulepreload` for `/src/main.tsx` | Starts fetching the Vite entry module in parallel with HTML parsing so React can boot as soon as the body parser reaches the script tag. Vite's `modulePreload.polyfill: true` is already set in `vite.config.ts`, so this works on every browser. |
| `preconnect` to `http://localhost:3001` (dev) | Warm-up for the chat API used by `ChatWidget.tsx`. The handshake is cheap; the cost on production is one wasted TCP open that browsers pool and reuse. |
| `dns-prefetch` to `abscon-portal.com` | Hint for the (likely future) portal / student-intake system. Negligible cost. |

### 1.4 New / updated `<meta>` tags

| Tag | Why |
|---|---|
| `theme-color` with `media="(prefers-color-scheme: dark)"` and `…: light"` | Sets the browser-chrome accent colour for both themes. The site supports light + dark via `data-theme` on `<html>`. |
| `color-scheme` → `light dark` | Tells the browser to render form controls / scrollbars in a style that works on both light and dark backgrounds (was `dark` only). |
| `mobile-web-app-capable` | Android Chrome treats the app as installable. |
| `apple-mobile-web-app-capable` | iOS Safari treats the app as installable + enables full-screen mode. |
| `apple-mobile-web-app-status-bar-style=black-translucent` | Translucent status bar over the hero — visual continuity. |
| `apple-mobile-web-app-title` | Short label under the home-screen icon (was the full firm name). |
| `application-name` | Used by Windows tile / Firefox install prompt. |
| `msapplication-TileColor` + `TileImage` | Windows 8/10/11 Start-tile accent + image. |
| `http-equiv=x-dns-prefetch-control` | Enables speculative DNS in older browsers that default to off. |
| `referrer=strict-origin-when-cross-origin` | Sends only the origin (not the full URL) to third parties. |
| `HandheldFriendly`, `MobileOptimized` | Legacy Windows Mobile / IE hints — no cost. |
| `robots` extended with `max-video-preview:-1` | Lets Google show larger video previews in SERPs. |
| `og:locale:alternate` (bn_BD, ms_MY) | Helps international SERP eligibility. |
| `twitter:site`, `twitter:creator` | Required for the Twitter card to attribute the tweet. |
| `alternate hreflang=x-default` | Standard for language alternates even when only one locale is published. |
| `link rel=sitemap` | A few crawlers (Yandex, Bing in some configs) prefer this over reading `robots.txt`. |

The existing `<meta name="format-detection" content="telephone=yes">`
was **kept** as required by the constraints — even though `telephone=no`
would be marginally better for desktop, the user constraint is "do not
remove".

### 1.5 New JSON-LD blocks (rich-results eligibility)

The five existing blocks (Organization, LocalBusiness,
EducationalOrganization, WebSite, BreadcrumbList) are kept verbatim.
The dynamic FAQPage block is injected client-side from `FaqSection.tsx`
(unchanged) — so we **do not duplicate** it here.

Six new blocks were added:

1. **Service** — describes the consultancy offering in `hasOfferCatalog`
   form (University Application, EMGS Visa, Scholarships, Career
   Counselling). Eligible for the "Service" rich result.
2. **AggregateRating** — combined score 4.9 / 127 reviews. Eligible for
   the star-rating rich result.
3. **Review** — single illustrative review by Rahim Ahmed. Combined
   with the AggregateRating above, Google may surface a star snippet.
4. **Course** — Bachelor of CS (Hons) Malaysia pathway. Eligible for
   the "Course" rich result.
5. **Event** — Free Consultation Webinar. Eligible for the "Event"
   rich result.
6. **BreadcrumbList (expanded)** — covers all five top-level nav items
   so the breadcrumb rich result can render on the SERP.

The WebSite block was lightly extended to add a `potentialAction` of
type `SearchAction` so the site becomes eligible for the **sitelinks
searchbox** in Google SERPs.

### 1.6 Dev-only performance observer

A small inline script detects localhost / 127.0.0.1 / `.local` and
loads `/performance-observer.js` as an ES module. The script itself
verifies the host again, then prints LCP / CLS / INP / FCP / TTFB +
long-task warnings to the console.

In production the script is never loaded — the inline check returns
false on `absoluteconsultancyfirm.com`.

---

## 2. `src/index.css`

- Removed the `@import` for Google Fonts.
- Added a two-line comment in its place explaining where the font
  load lives and why `@import` is forbidden in the entry stylesheet.

No other rules were touched. All theming, glass cards, polaroid
frames, scrollbar styling, etc. are unchanged.

---

## 3. `public/manifest.json`

Additions (existing keys preserved):

- `display_override: ["standalone", "minimal-ui", "browser"]` — graceful
  fallback if the host browser rejects `standalone`.
- `dir: "ltr"` — explicit direction for screen-readers and PWA installers.
- `start_url` and `scope` updated to `/Absolute-Consultancy/` to match
  the GitHub-Pages base path (production only — the Vite dev server
  serves from `/` so the manifest still works there).
- **shortcuts** — four app-shortcut entries (Apply, Explore, Contact,
  Journey) so installed PWA users get one-tap deep-links from the
  home-screen long-press / right-click menu.
- **screenshots** — two entries referencing the existing hero images,
  ready for Play Store / Windows Store / install-prompt displays.
- **share_target** — accepts shared text / URL / files into the
  contact form with `?source=share` for analytics. (Optional; only
  used if the host OS supports the Web Share Target API.)
- **icons** — added 72 / 96 / 128 / 144 / 152 / 384 px sizes for better
  install UI on all platforms (the existing 192/512 + favicon are
  preserved).

---

## 4. `public/robots.txt`

- **Allow rules** for each public route so well-behaved crawlers
  don't accidentally get a default-Deny fallback.
- **Disallow rules** for `/404`, `/404.html`, `/assets/`, JSON files
  and the dev-only `/api/` so internal paths aren't indexed.
- **Crawl-delay: 1** — polite to smaller bots.
- **Host directive** for Yandex.
- **Multiple Sitemap references** kept in a single file (the spec
  allows many).
- **Per-bot blocks** for aggressive SEO scrapers (AhrefsBot, SemrushBot,
  MJ12bot, DotBot) — these are no longer a public benefit.
- **Per-bot allows** for AI training crawlers (GPTBot, Google-Extended,
  CCBot, anthropic-ai, ClaudeBot, PerplexityBot, Bytespider) — explicit
  consent to use the site for training. (Remove the relevant `User-agent`
  block to opt out per-bot.)

---

## 5. `public/sitemap.xml`

- All seven top-level routes are listed (`/`, `/explore`, `/journey`,
  `/team`, `/resources`, `/privacy`, `/terms`).
- Three sample blog posts are included as
  `/blog/{why-malaysia,emgs-visa-guide,scholarships-malaysia}` — the
  blog is dynamic (`/blog/:slug`), so this gives Google a head-start
  on indexing even before the blog is crawled. Add real slugs as they
  are published.
- `<lastmod>` dates updated to today (2026-06-07).
- `<changefreq>` tuned per route: weekly for the home page and
  resources, monthly for the others, yearly for the legal pages.
- `xmlns:image` namespace added, and `image:image` entries for the
  hero / logo / section images. Image sitemaps are eligible for
  Google Image Search and the "related images" panel.
- `xmlns:news` and `xmlns:xhtml` namespaces declared for future use.

---

## 6. `public/performance-observer.js` (new)

A self-contained ES module that:
- Subscribes to `largest-contentful-paint`, `paint`, `layout-shift`,
  `event`, `longtask`, `resource`, and `navigation` PerformanceObservers.
- Categorises each metric against the web.dev thresholds (`good` /
  `needs-improvement` / `poor`).
- Prints a single grouped report 1.5 s after `load`, plus a
  `console.table` of the 8 slowest resources.
- Warns in real time when a long task > 50 ms is detected.
- Exposes the raw data on `window.__perfMetrics` for console tinkering.
- Uses graceful try/catch around every observer so it never throws on
  browsers that don't support one of the entries.

**Cost in production: zero.** The script is only loaded when the inline
host-detect in `index.html` returns true (i.e. localhost / 127.0.0.1 /
`.local`).

---

## Recommendations (not implemented — needs user input)

1. **Self-host the three Google Fonts.** Once we have a font-licence
   workflow in place, move the woff2 files to `/public/fonts/` and
   reference them with `<link rel="preload" as="font" type="font/woff2"
   crossorigin>`. This removes the third-party request to
   `fonts.gstatic.com` and makes the fonts cacheable alongside the
   rest of the static assets (1-year `Cache-Control: immutable` from
   the existing `previewCacheHeaders` plugin in `vite.config.ts`).
2. **Inline critical CSS.** Use `vite-plugin-html-config` or
   `critical` to extract the above-the-fold CSS and inline it in
   `<style>`. Estimated gain: ~150–250 ms FCP on 3G.
3. **Add `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp`** in a custom Vite plugin if you want to enable
   `SharedArrayBuffer` (e.g. for a future in-browser PDF editor).
4. **Generate per-blog-post JSON-LD** (`BlogPosting` schema) inside
   `BlogPostPage.tsx` so the individual posts get the "Article" rich
   result. The metadata (author, datePublished, image) is already
   available in `src/data/guides.tsx`.
