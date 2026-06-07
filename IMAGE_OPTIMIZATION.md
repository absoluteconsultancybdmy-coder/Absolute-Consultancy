# Image Optimization Guide

This project ships optimized image variants in `public/images/`. The
optimization script (`optimize-images.js`) generates WebP and AVIF files
alongside the original JPG/PNG assets using `sharp`.

## Generated Files

The script produces files with predictable naming:

| Source | Generated variants |
| --- | --- |
| `hero-graduate.png` | `hero-graduate.webp`, `hero-graduate-480.webp`, `hero-graduate-768.webp`, `hero-graduate-1024.webp`, `hero-graduate.avif`, `hero-graduate-1024.avif` |
| `hero-bg.jpg` | `hero-bg.webp`, `hero-bg-768.webp`, `hero-bg-1440.webp`, `hero-bg.avif`, `hero-bg-1440.avif` |
| `coo-profile.png` | `coo-profile.webp`, `coo-profile-480.webp`, `coo-profile-768.webp` |
| `coo-profile2.png` | `coo-profile2.webp`, `coo-profile2-480.webp`, `coo-profile2-768.webp` |
| `logo.png` | `logo.webp` |
| `about-*.jpg`, `card*.jpg`, `*University.jpeg`, `*Collage.jpeg`, `dest-*.jpg`, etc. | `<name>.webp` (single optimized variant) |

Original files are never modified or deleted.

## `<picture>` Element Usage

The `<picture>` element is the recommended way to serve modern formats with
a fallback. Browsers pick the first `<source>` they support.

### Hero image (AVIF -> WebP -> JPG with responsive sizes)

```html
<picture>
  <source
    type="image/avif"
    srcset="
      /images/hero-graduate-1024.avif 1024w,
      /images/hero-graduate.avif 1024w
    "
    sizes="(max-width: 768px) 100vw, 50vw"
  />
  <source
    type="image/webp"
    srcset="
      /images/hero-graduate-480.webp 480w,
      /images/hero-graduate-768.webp 768w,
      /images/hero-graduate-1024.webp 1024w,
      /images/hero-graduate.webp 1024w
    "
    sizes="(max-width: 768px) 100vw, 50vw"
  />
  <img
    src="/images/hero-graduate.png"
    srcset="
      /images/hero-graduate-480.png 480w,
      /images/hero-graduate-768.png 768w,
      /images/hero-graduate-1024.png 1024w
    "
    sizes="(max-width: 768px) 100vw, 50vw"
    alt="Graduate celebrating admission"
    width="1024"
    height="1536"
    loading="eager"
    fetchpriority="high"
    decoding="async"
  />
</picture>
```

### Hero background (AVIF -> WebP -> JPG)

```html
<picture>
  <source
    type="image/avif"
    srcset="
      /images/hero-bg-1440.avif 1440w,
      /images/hero-bg.avif 1440w
    "
    sizes="100vw"
  />
  <source
    type="image/webp"
    srcset="
      /images/hero-bg-768.webp 768w,
      /images/hero-bg-1440.webp 1440w,
      /images/hero-bg.webp 1440w
    "
    sizes="100vw"
  />
  <img
    src="/images/hero-bg.jpg"
    srcset="
      /images/hero-bg-768.jpg 768w,
      /images/hero-bg-1440.jpg 1440w
    "
    sizes="100vw"
    alt=""
    width="1344"
    height="768"
    loading="eager"
    fetchpriority="high"
    decoding="async"
  />
</picture>
```

### Profile image (WebP only -> PNG fallback)

```html
<picture>
  <source
    type="image/webp"
    srcset="
      /images/coo-profile-480.webp 480w,
      /images/coo-profile-768.webp 768w,
      /images/coo-profile.webp 1024w
    "
    sizes="(max-width: 768px) 80px, 160px"
  />
  <img
    src="/images/coo-profile.png"
    width="160"
    height="160"
    alt="COO portrait"
    loading="lazy"
    decoding="async"
  />
</picture>
```

### Single optimized image (card, university, destination, about)

```html
<picture>
  <source srcset="/images/card1.webp" type="image/webp" />
  <img
    src="/images/card1.jpg"
    alt="Service card"
    width="1254"
    height="836"
    loading="lazy"
    decoding="async"
  />
</picture>
```

## Responsive `srcset` Patterns

Use `w` descriptors with `sizes` so the browser picks the correct file:

- Hero / full-width banner: `sizes="100vw"`
- Two-column layout where image is half the viewport on desktop and full on mobile: `sizes="(max-width: 768px) 100vw, 50vw"`
- Card grid (3 columns desktop, 1 column mobile): `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`
- Small avatar (~160px): `sizes="160px"` or a media query variant like `sizes="(max-width: 768px) 80px, 160px"`

Typical srcset ladder for a hero image:

```
480w   -> hero-graduate-480.webp
768w   -> hero-graduate-768.webp
1024w  -> hero-graduate-1024.webp
1440w  -> hero-graduate-1440.webp  (only when source is >= 1440 wide)
1920w  -> hero-graduate-1920.webp  (only when source is >= 1920 wide)
```

For this project, the hero source is 1024x1536, so 480/768/1024 are the
meaningful variants for `hero-graduate`. The base `hero-graduate.webp`
mirrors the 1024 variant and is safe to use as the `src` fallback.

## Mobile Considerations

- Mobile devices have slower networks and smaller viewports. The 480w
  variant is usually the right pick for phones in `srcset`.
- The 768w variant fits most tablets.
- Always provide an explicit `sizes` attribute; without it the browser
  assumes `100vw` and may over-fetch.
- For images that render above the fold (hero, LCP candidate) use
  `loading="eager"` and `fetchpriority="high"`. Everything else should
  use `loading="lazy"`.
- Combine `loading="lazy"` with `decoding="async"` to keep the main
  thread free.
- The `<img>` element should always include intrinsic `width` and
  `height` (or `aspect-ratio` in CSS) to prevent layout shift (CLS).

## Loading Hints Reference

| Attribute | Effect |
| --- | --- |
| `loading="lazy"` | Defers fetching until the image is near the viewport. Skip for LCP images. |
| `loading="eager"` | Loads immediately. Use for above-the-fold / hero images. |
| `fetchpriority="high"` | Hints the browser to prioritize this resource. Use sparingly (one LCP image per page). |
| `decoding="async"` | Decodes the image off the main thread. Safe to use on all non-LCP images. |
| `width` / `height` | Reserves layout space, prevents CLS. |

## Preload Hints (index.html)

The page `<head>` preloads the WebP variants of the hero assets and uses
`imagesrcset` / `imagesizes` so the browser fetches the right size for
the current viewport:

```html
<link
  rel="preload"
  as="image"
  href="/Absolute-Consultancy/images/hero-bg.webp"
  type="image/webp"
  fetchpriority="high"
  imagesrcset="
    /Absolute-Consultancy/images/hero-bg-768.webp 768w,
    /Absolute-Consultancy/images/hero-bg-1440.webp 1440w,
    /Absolute-Consultancy/images/hero-bg.webp 1440w
  "
  imagesizes="100vw"
/>
<link
  rel="preload"
  as="image"
  href="/Absolute-Consultancy/images/hero-graduate.webp"
  type="image/webp"
  fetchpriority="high"
  imagesrcset="
    /Absolute-Consultancy/images/hero-graduate-768.webp 768w,
    /Absolute-Consultancy/images/hero-graduate-1024.webp 1024w,
    /Absolute-Consultancy/images/hero-graduate.webp 1024w
  "
  imagesizes="(max-width: 768px) 100vw, 50vw"
/>
```

The original JPG/PNG preloads are kept as fallbacks for browsers that
ignore the WebP preloads.

## Regenerating Optimized Assets

```bash
# Process the priority list (default)
node optimize-images.js

# Process every JPG/PNG in public/images/
node optimize-images.js --all

# Verbose output (shows cached files)
node optimize-images.js --verbose
```

The script is idempotent: if an output file is newer than its source, it
is skipped. Delete the generated file (or use `--all` after touching a
source) to force regeneration.
