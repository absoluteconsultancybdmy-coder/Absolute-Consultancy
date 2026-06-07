/* ─────────────────────────────────────────────────────────────────────
 * performance-observer.js
 * Dev-only Core Web Vitals reporter.
 * Loaded conditionally from index.html on localhost / 127.0.0.1 only.
 * Prints LCP, INP, CLS, FCP, TTFB, plus longtask warnings, to the
 * browser console with a single grouped report and per-metric badges.
 * ───────────────────────────────────────────────────────────────────── */

const fmt = (ms) => `${ms.toFixed(0)}ms`;
const fmtBytes = (b) =>
  b < 1024
    ? `${b} B`
    : b < 1024 * 1024
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / 1024 / 1024).toFixed(2)} MB`;

const grade = (value, thresholds) => {
  if (value <= thresholds.good) return { label: 'good', icon: '✓' };
  if (value <= thresholds.ni) return { label: 'needs-improvement', icon: '~' };
  return { label: 'poor', icon: '✗' };
};

const CWV = {
  LCP: { good: 2500, ni: 4000 },
  INP: { good: 200, ni: 500 },
  CLS: { good: 0.1, ni: 0.25 },
  FCP: { good: 1800, ni: 3000 },
  TTFB: { good: 800, ni: 1800 },
};

const metrics = {
  LCP: null,
  INP: null,
  CLS: null,
  FCP: null,
  TTFB: null,
  longTasks: [],
  resources: [],
};

const log = (icon, label, value, g) => {
  const styles = {
    good: 'color:#0a7a3b;font-weight:bold',
    'needs-improvement': 'color:#b58900;font-weight:bold',
    poor: 'color:#c0392b;font-weight:bold',
  }[g.label];
  console.log(`%c${icon} ${label}: ${value}`, styles);
};

// ── Largest Contentful Paint ─────────────────────────────────────────
try {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      metrics.LCP = entry.startTime;
    }
  }).observe({ type: 'largest-contentful-paint', buffered: true });
} catch {
  /* unsupported */
}

// ── First Contentful Paint ───────────────────────────────────────────
try {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        metrics.FCP = entry.startTime;
      }
    }
  }).observe({ type: 'paint', buffered: true });
} catch {
  /* unsupported */
}

// ── Cumulative Layout Shift ──────────────────────────────────────────
try {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        metrics.CLS = (metrics.CLS || 0) + entry.value;
      }
    }
  }).observe({ type: 'layout-shift', buffered: true });
} catch {
  /* unsupported */
}

// ── Interaction to Next Paint (replaces FID) ─────────────────────────
try {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      metrics.INP = entry.processingEnd - entry.startTime;
    }
  }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
} catch {
  /* unsupported — fall back to FID below */
}

// ── Long Tasks (warn on anything over 50ms) ──────────────────────────
try {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 50) {
        metrics.longTasks.push({
          duration: entry.duration,
          startTime: entry.startTime,
        });
        console.warn(
          `[perf] Long task: ${entry.duration.toFixed(0)}ms at ${entry.startTime.toFixed(0)}ms`,
        );
      }
    }
  }).observe({ type: 'longtask', buffered: true });
} catch {
  /* unsupported */
}

// ── Resource waterfall (top 10 slowest) ──────────────────────────────
try {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      metrics.resources.push({
        name: entry.name.replace(location.origin, ''),
        type: entry.initiatorType,
        duration: entry.duration,
        size: entry.transferSize || 0,
      });
    }
  }).observe({ type: 'resource', buffered: true });
} catch {
  /* unsupported */
}

// ── TTFB (Time to First Byte) ────────────────────────────────────────
try {
  const nav = performance.getEntriesByType('navigation')[0];
  if (nav) {
    metrics.TTFB = nav.responseStart - nav.requestStart;
  }
} catch {
  /* unsupported */
}

// ── Print the consolidated report once the page is "loaded" ─────────
const printReport = () => {
  console.groupCollapsed(
    '%c⚡ Core Web Vitals — Absolute Consultancy Firm',
    'color:#C9A234;font-weight:bold;font-size:13px',
  );

  console.log(
    '%cDev-only perf report. These thresholds come from web.dev/vitals.',
    'color:#888;font-style:italic',
  );

  if (metrics.LCP !== null) {
    const g = grade(metrics.LCP, CWV.LCP);
    log(g.icon, 'LCP ', fmt(metrics.LCP), g);
  }
  if (metrics.FCP !== null) {
    const g = grade(metrics.FCP, CWV.FCP);
    log(g.icon, 'FCP ', fmt(metrics.FCP), g);
  }
  if (metrics.CLS !== null) {
    const g = grade(metrics.CLS, CWV.CLS);
    log(g.icon, 'CLS ', metrics.CLS.toFixed(3), g);
  }
  if (metrics.INP !== null) {
    const g = grade(metrics.INP, CWV.INP);
    log(g.icon, 'INP ', fmt(metrics.INP), g);
  }
  if (metrics.TTFB !== null) {
    const g = grade(metrics.TTFB, CWV.TTFB);
    log(g.icon, 'TTFB', fmt(metrics.TTFB), g);
  }

  if (metrics.longTasks.length) {
    const worst = Math.max(...metrics.longTasks.map((t) => t.duration));
    console.log(
      `%c${metrics.longTasks.length} long task(s) — worst ${worst.toFixed(0)}ms`,
      worst > 200 ? 'color:#c0392b;font-weight:bold' : 'color:#b58900;font-weight:bold',
    );
  } else {
    console.log('%cNo long tasks detected.', 'color:#0a7a3b');
  }

  if (metrics.resources.length) {
    const top = [...metrics.resources]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 8);
    console.table(
      top.map((r) => ({
        resource: r.name.length > 80 ? `…${r.name.slice(-77)}` : r.name,
        type: r.type,
        duration: `${r.duration.toFixed(0)}ms`,
        size: fmtBytes(r.size),
      })),
    );
  }

  // Expose for console tinkering
  window.__perfMetrics = metrics;
  console.log(
    '%cTip: type __perfMetrics in the console for the raw data.',
    'color:#888;font-style:italic',
  );
  console.groupEnd();
};

if (document.readyState === 'complete') {
  // Give LCP a beat to settle, then report
  setTimeout(printReport, 1500);
} else {
  window.addEventListener('load', () => setTimeout(printReport, 1500));
}
