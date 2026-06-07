import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGE_DIR = path.join(__dirname, 'public', 'images');

const SMALL_THRESHOLD = 100 * 1024;
const LARGE_THRESHOLD = 500 * 1024;
const WEBP_QUALITY = 80;
const AVIF_QUALITY = 60;
const MAX_DIMENSION = 1920;

const args = new Set(process.argv.slice(2));
const PROCESS_ALL = args.has('--all');
const VERBOSE = args.has('--verbose') || args.has('-v');

const PRIORITY_CONFIG = {
  'hero-graduate.png': { sizes: [480, 768, 1024], avif: true, avifSizes: [1024] },
  'hero-bg.jpg': { sizes: [768, 1440], avif: true, avifSizes: [1440] },
  'coo-profile.png': { sizes: [480, 768], avif: false, avifSizes: [] },
  'coo-profile2.png': { sizes: [480, 768], avif: false, avifSizes: [] },
  'logo.png': { sizes: [], avif: false, avifSizes: [] },
};

const PATTERNS = [
  { regex: /^about-.*\.(jpg|jpeg|png)$/i, sizes: [], avif: false, avifSizes: [] },
  { regex: /^card\d+\.(jpg|jpeg|png)$/i, sizes: [], avif: false, avifSizes: [] },
  { regex: /University.*\.(jpeg|jpg|png)$/i, sizes: [], avif: false, avifSizes: [] },
  { regex: /Collage.*\.(jpeg|jpg|png)$/i, sizes: [], avif: false, avifSizes: [] },
  { regex: /^dest-.*\.(jpg|jpeg|png)$/i, sizes: [], avif: false, avifSizes: [] },
  { regex: /^(logo|services-section|contact-bg|StudentRecruitment|YourJourney|00aebda26d6b873e5aeffc404746be53)\.(jpg|jpeg|png)$/i, sizes: [], avif: false, avifSizes: [] },
];

const SKIP_FILES = new Set([
  'Firm.avif',
  'BottomVideo.avif',
  'card4.avif',
  'card5.avif',
  'Ginting Highland.jpg',
  'Ginting_Highland.jpg',
  'tayloruniversitylogo.jpg',
  'UCSIlogo.jpg',
  'Services Section.jpg',
]);

const SUPPORTED_EXT = /\.(jpg|jpeg|png)$/i;

function fmt(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function getConfigFor(filename) {
  if (PRIORITY_CONFIG[filename]) return { ...PRIORITY_CONFIG[filename], source: 'priority' };
  for (const p of PATTERNS) {
    if (p.regex.test(filename)) return { ...p, source: 'pattern' };
  }
  return null;
}

async function isNewer(outputPath, sourcePath) {
  try {
    const [out, src] = await Promise.all([fs.stat(outputPath), fs.stat(sourcePath)]);
    return out.mtimeMs >= src.mtimeMs;
  } catch {
    return false;
  }
}

async function processImage(filename, config) {
  const srcPath = path.join(IMAGE_DIR, filename);
  const srcStat = await fs.stat(srcPath);
  const isSmall = srcStat.size < SMALL_THRESHOLD;
  const isLarge = srcStat.size >= LARGE_THRESHOLD;

  const ext = path.extname(filename);
  const base = path.basename(filename, ext);

  const result = {
    originalSize: srcStat.size,
    optimizedSize: 0,
    newFiles: [],
    cachedFiles: 0,
  };

  const allWebpWidths = [null, ...(config.sizes || [])];

  for (const width of allWebpWidths) {
    if (isSmall && width !== null) continue;

    const suffix = width ? `-${width}` : '';
    const outPath = path.join(IMAGE_DIR, `${base}${suffix}.webp`);

    if (await isNewer(outPath, srcPath)) {
      const s = await fs.stat(outPath);
      result.optimizedSize += s.size;
      result.cachedFiles++;
      if (VERBOSE) console.log(`  CACHE ${base}${suffix}.webp (${fmt(s.size)})`);
      continue;
    }

    try {
      let p = sharp(srcPath);
      if (width) {
        p = p.resize({ width, withoutEnlargement: true });
      } else if (isLarge) {
        p = p.resize({ width: MAX_DIMENSION, withoutEnlargement: true });
      }
      await p.webp({ quality: WEBP_QUALITY }).toFile(outPath);
      const s = await fs.stat(outPath);
      result.optimizedSize += s.size;
      result.newFiles.push({ path: `${base}${suffix}.webp`, size: s.size });
      console.log(`  + ${base}${suffix}.webp (${fmt(s.size)})`);
    } catch (err) {
      console.error(`  ! ${base}${suffix}.webp: ${err.message}`);
    }
  }

  const avifEnabled = config.avif === true || (config.avif === 'auto' && isLarge);
  if (avifEnabled && !isSmall) {
    const allAvifWidths = [null, ...(config.avifSizes || [])];
    for (const width of allAvifWidths) {
      const suffix = width ? `-${width}` : '';
      const outPath = path.join(IMAGE_DIR, `${base}${suffix}.avif`);

      if (await isNewer(outPath, srcPath)) {
        const s = await fs.stat(outPath);
        result.optimizedSize += s.size;
        result.cachedFiles++;
        if (VERBOSE) console.log(`  CACHE ${base}${suffix}.avif (${fmt(s.size)})`);
        continue;
      }

      try {
        let p = sharp(srcPath);
        if (width) {
          p = p.resize({ width, withoutEnlargement: true });
        }
        await p.avif({ quality: AVIF_QUALITY }).toFile(outPath);
        const s = await fs.stat(outPath);
        result.optimizedSize += s.size;
        result.newFiles.push({ path: `${base}${suffix}.avif`, size: s.size });
        console.log(`  + ${base}${suffix}.avif (${fmt(s.size)})`);
      } catch (err) {
        console.error(`  ! ${base}${suffix}.avif: ${err.message}`);
      }
    }
  }

  return result;
}

async function main() {
  console.log('=== Image Optimization ===');
  console.log(`Source: ${IMAGE_DIR}`);
  console.log(`Mode: ${PROCESS_ALL ? 'ALL' : 'PRIORITY'}`);
  console.log(`WebP quality: ${WEBP_QUALITY}, AVIF quality: ${AVIF_QUALITY}`);
  console.log('');

  const files = await fs.readdir(IMAGE_DIR);
  const imageFiles = files.filter(f => SUPPORTED_EXT.test(f) && !SKIP_FILES.has(f));

  const targets = [];
  if (PROCESS_ALL) {
    for (const f of imageFiles) {
      const config = getConfigFor(f) || { sizes: [], avif: 'auto', avifSizes: [], source: 'default' };
      targets.push({ file: f, config });
    }
  } else {
    for (const f of imageFiles) {
      const config = getConfigFor(f);
      if (config) targets.push({ file: f, config });
    }
  }

  console.log(`Targets (${targets.length}):`);
  for (const t of targets) {
    const s = (await fs.stat(path.join(IMAGE_DIR, t.file))).size;
    console.log(`  - ${t.file} [${t.config.source}] (${fmt(s)})`);
  }
  console.log('');

  let totalOriginal = 0;
  let totalOptimized = 0;
  let totalNew = 0;
  let totalCached = 0;
  const allNewFiles = [];
  let errors = 0;

  for (const t of targets) {
    console.log(`> ${t.file}`);
    try {
      const r = await processImage(t.file, t.config);
      totalOriginal += r.originalSize;
      totalOptimized += r.optimizedSize;
      totalNew += r.newFiles.length;
      totalCached += r.cachedFiles;
      for (const f of r.newFiles) {
        allNewFiles.push(f);
      }
    } catch (err) {
      console.error(`  FAIL: ${err.message}`);
      errors++;
    }
  }

  console.log('');
  console.log('=== Summary ===');
  console.log(`New files created: ${totalNew}`);
  console.log(`Cached (skipped): ${totalCached}`);
  console.log(`Source files total: ${fmt(totalOriginal)}`);
  console.log(`Optimized output total (new + cached): ${fmt(totalOptimized)}`);
  if (totalOriginal > 0) {
    const newOptimized = allNewFiles.reduce((s, f) => s + f.size, 0);
    const saved = totalOriginal - newOptimized;
    const pct = ((saved / totalOriginal) * 100).toFixed(1);
    console.log(`Savings on new outputs only: ${fmt(saved)} (${pct}%)`);
  }
  if (errors > 0) console.log(`Errors: ${errors}`);

  if (allNewFiles.length > 0) {
    console.log('');
    console.log('New files:');
    for (const f of allNewFiles) {
      console.log(`  ${f.path} (${fmt(f.size)})`);
    }
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
