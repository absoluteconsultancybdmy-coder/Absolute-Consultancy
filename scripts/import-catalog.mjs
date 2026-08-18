/**
 * Loads the scraped partner catalog into Supabase.
 *
 * Usage:
 *   node scripts/import-catalog.mjs --data <dir> [--dry-run]
 *
 * <dir> must contain universities.json and courses.ndjson as produced by the
 * scraper. Writes go through the service role key, because the catalog tables
 * are public-read / service-write under RLS:
 *
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/import-catalog.mjs --data ./tmp
 *
 * Re-running is safe: universities and courses upsert on their slug, while
 * departments and fees are replaced per parent so stale rows do not accumulate.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const DATA_DIR = args[args.indexOf('--data') + 1];

if (!DATA_DIR || DATA_DIR.startsWith('--')) {
  console.error('Missing --data <dir>');
  process.exit(1);
}

const URL = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!DRY_RUN && (!URL || !SERVICE_KEY)) {
  console.error('Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or pass --dry-run).');
  process.exit(1);
}

const db = DRY_RUN
  ? null
  : createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

// ---------------------------------------------------------------- transforms

const QUALIFICATION = {
  "bachelor's degree": 'Bachelor',
  "master's degree": 'Masters',
  'doctoral degree (phd)': 'Doctoral',
  'foundation / a-level': 'Foundation',
  'advanced diploma': 'Advance Diploma',
  diploma: 'Diploma',
  certificate: 'Certificate',
  postgraduate: 'Masters',
};

const qualificationOf = (raw) =>
  raw ? (QUALIFICATION[raw.trim().toLowerCase()] ?? 'Other') : null;

/**
 * The source mixes two conventions in one field: "2.5 years" reads as two and
 * a half years, while "1.6 years" reads as one year six months (1.6 * 12 is
 * not a whole number of months, so it cannot be decimal). Whole numbers and .5
 * are treated as decimal; every other fraction is read as year.month.
 * duration_text keeps the original string either way.
 */
function durationMonths(text) {
  if (!text) return null;
  const m = text.match(/([\d.]+)\s*year/i);
  if (!m) {
    const mm = text.match(/(\d+)\s*month/i);
    return mm ? parseInt(mm[1], 10) : null;
  }
  const [whole, frac] = m[1].split('.');
  const years = parseInt(whole, 10);
  if (Number.isNaN(years)) return null;
  if (!frac) return years * 12;
  if (frac === '5') return years * 12 + 6;
  const months = parseInt(frac, 10);
  return months >= 1 && months <= 11 ? years * 12 + months : years * 12;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function intakeMonths(text) {
  if (!text) return [];
  const found = [];
  for (const part of text.split(/[,/&]| and /i)) {
    const hit = MONTHS.find((mo) => part.trim().toLowerCase().startsWith(mo.toLowerCase()));
    if (hit && !found.includes(hit)) found.push(hit);
  }
  return found;
}

/** "MYR 14,000.00" -> 14000. Returns null when no number is present. */
function feeAmount(text) {
  const m = (text ?? '').replace(/,/g, '').match(/([\d]+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

/**
 * The detail page runs straight from entry requirements into unrelated
 * sections with no separating markup, so the scrape carries them along. Cut
 * the list at the first heading that belongs to a later section.
 */
const REQUIREMENT_END = /^(future careers?|career opportunit|education pathway|curriculum|overview|apply now)/i;

function cleanRequirements(list) {
  if (!Array.isArray(list)) return list || null;
  const out = [];
  for (const item of list) {
    if (REQUIREMENT_END.test(item.trim())) break;
    const text = item
      .replace(/&bull;/g, '')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
    if (text.length > 2) out.push(text);
  }
  return out.join('\n') || null;
}

/** Names differ in punctuation and spacing between the two sources. */
const norm = (s) =>
  (s ?? '')
    .toLowerCase()
    .replace(/[’'`]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const slugify = (s) =>
  norm(s).replace(/\s+/g, '-').slice(0, 120);

// --------------------------------------------------------------------- load

const universities = JSON.parse(readFileSync(join(DATA_DIR, 'universities.json'), 'utf8'));
const courses = readFileSync(join(DATA_DIR, 'courses.ndjson'), 'utf8')
  .split('\n')
  .filter((l) => l.trim())
  .map((l) => JSON.parse(l));

console.log(`loaded ${universities.length} universities, ${courses.length} courses`);

const uniByName = new Map();
for (const u of universities) uniByName.set(norm(u.name), u);

// A course card names its university in card_meta[0]; logo_alt repeats it and
// acts as a fallback when the card layout varies.
function universityFor(course) {
  const candidates = [course.card_meta?.[0], course.logo_alt].filter(Boolean);
  for (const c of candidates) {
    const hit = uniByName.get(norm(c));
    if (hit) return hit;
  }
  return null;
}

// Department comes from the university page's accordion, keyed by course name.
const deptOfCourse = new Map();
for (const u of universities) {
  for (const d of u.departments ?? []) {
    for (const c of d.courses ?? []) {
      deptOfCourse.set(`${u.slug}::${norm(c.name)}`, d.name);
    }
  }
}

// ------------------------------------------------------------------- verify

const unmatched = courses.filter((c) => !universityFor(c));
const withDept = courses.filter((c) => {
  const u = universityFor(c);
  return u && deptOfCourse.has(`${u.slug}::${norm(c.name)}`);
});

console.log(`university matched : ${courses.length - unmatched.length}/${courses.length}`);
console.log(`department matched : ${withDept.length}/${courses.length}`);
if (unmatched.length) {
  const names = [...new Set(unmatched.map((c) => c.card_meta?.[0] ?? '(none)'))];
  console.log(`unmatched universities: ${names.slice(0, 10).join(' | ')}`);
}

const feeCount = courses.reduce(
  (n, c) => n + (c.tuition_fees?.length ?? 0) + (c.other_fees?.length ?? 0),
  0
);
console.log(`fee rows to insert : ${feeCount}`);

if (DRY_RUN) {
  const sample = courses.find((c) => c.tuition_fees?.length);
  console.log('\n--- sample mapped course ---');
  console.log(JSON.stringify(mapCourse(sample, universityFor(sample), null), null, 2));
  console.log('\ndry run complete, nothing written');
  process.exit(0);
}

// -------------------------------------------------------------------- write

function mapCourse(c, uni, departmentId) {
  const meta = c.card_meta?.[1] ?? '';
  return {
    slug: c.slug,
    name: c.name,
    university_id: uni?.id ?? null,
    department_id: departmentId,
    qualification_raw: c.qualification ?? null,
    qualification: qualificationOf(c.qualification),
    duration_text: c.duration ?? null,
    duration_months: durationMonths(c.duration),
    intake_months: intakeMonths(c.intake),
    english_requirement: c.english_requirement ?? null,
    class_type: c.class_type ?? null,
    offer_letter_free: /offer letter:\s*free/i.test(meta) ? true : null,
    entry_requirements: cleanRequirements(c.entry_requirements),
    // overview is intentionally left null: the partner's marketing prose is
    // theirs, and this site supplies its own copy.
    overview: null,
  };
}

async function chunked(rows, size, fn) {
  for (let i = 0; i < rows.length; i += size) {
    await fn(rows.slice(i, i + size), i);
    process.stdout.write(`\r  ${Math.min(i + size, rows.length)}/${rows.length}`);
  }
  process.stdout.write('\n');
}

async function main() {
  console.log('\nupserting universities…');
  const uniRows = universities.map((u) => ({
    slug: u.slug,
    name: u.name,
    location: u.location ?? null,
    city: u.location ? u.location.split(',')[0].trim() : null,
    logo_url: u.logo ?? null,
    offer_letter_free: null,
  }));
  const { data: savedUnis, error: uniErr } = await db
    .from('universities')
    .upsert(uniRows, { onConflict: 'slug' })
    .select('id, slug, name');
  if (uniErr) throw new Error(`universities: ${uniErr.message}`);

  const uniIdBySlug = new Map(savedUnis.map((u) => [u.slug, u.id]));
  for (const u of universities) u.id = uniIdBySlug.get(u.slug);
  console.log(`  ${savedUnis.length} universities`);

  console.log('replacing departments…');
  const deptRows = [];
  for (const u of universities) {
    for (const d of u.departments ?? []) {
      deptRows.push({ university_id: u.id, name: d.name });
    }
  }
  await db.from('departments').delete().neq('university_id', '00000000-0000-0000-0000-000000000000');
  const { data: savedDepts, error: deptErr } = await db
    .from('departments')
    .insert(deptRows)
    .select('id, university_id, name');
  if (deptErr) throw new Error(`departments: ${deptErr.message}`);

  const deptId = new Map(
    savedDepts.map((d) => [`${d.university_id}::${norm(d.name)}`, d.id])
  );
  console.log(`  ${savedDepts.length} departments`);

  console.log('upserting courses…');
  const courseRows = [];
  for (const c of courses) {
    const uni = universityFor(c);
    if (!uni?.id) continue;
    const deptName = deptOfCourse.get(`${uni.slug}::${norm(c.name)}`);
    courseRows.push(mapCourse(c, uni, deptId.get(`${uni.id}::${norm(deptName)}`) ?? null));
  }

  const courseIdBySlug = new Map();
  await chunked(courseRows, 200, async (batch) => {
    const { data, error } = await db
      .from('courses')
      .upsert(batch, { onConflict: 'slug' })
      .select('id, slug');
    if (error) throw new Error(`courses: ${error.message}`);
    for (const r of data) courseIdBySlug.set(r.slug, r.id);
  });
  console.log(`  ${courseIdBySlug.size} courses`);

  console.log('replacing fees…');
  const feeRows = [];
  for (const c of courses) {
    const id = courseIdBySlug.get(c.slug);
    if (!id) continue;
    (c.tuition_fees ?? []).forEach((f, i) =>
      feeRows.push({ course_id: id, kind: 'tuition', label: f.label, amount: feeAmount(f.amount), sort_order: i })
    );
    (c.other_fees ?? []).forEach((f, i) =>
      feeRows.push({ course_id: id, kind: 'other', label: f.label, amount: feeAmount(f.amount), sort_order: i })
    );
  }
  await db.from('course_fees').delete().neq('course_id', '00000000-0000-0000-0000-000000000000');
  await chunked(feeRows, 500, async (batch) => {
    const { error } = await db.from('course_fees').insert(batch);
    if (error) throw new Error(`course_fees: ${error.message}`);
  });
  console.log(`  ${feeRows.length} fee rows`);

  console.log('\nimport complete');
}

main().catch((e) => {
  console.error('\nFAILED', e.message);
  process.exit(1);
});
