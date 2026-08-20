import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Reveal from '../components/Reveal';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const PAGE_SIZE = 20;

const QUALIFICATIONS = [
  'Certificate',
  'Foundation',
  'Diploma',
  'Advance Diploma',
  'Bachelor',
  'Masters',
  'Doctoral',
  'Other',
] as const;

interface CourseResult {
  id: string;
  slug: string;
  name: string;
  qualification: string | null;
  duration_text: string | null;
  intake_months: string[];
  english_requirement: string | null;
  universities: { name: string; location: string | null; logo_url: string | null } | null;
  departments: { name: string } | null;
}

interface UniversityOption {
  id: string;
  name: string;
}

export default function CourseSearchPage() {
  const { session } = useAuth();
  const [params, setParams] = useSearchParams();

  const q = params.get('q') ?? '';
  const qualification = params.get('level') ?? '';
  const universityId = params.get('uni') ?? '';
  const page = Math.max(1, Number(params.get('page') ?? 1));

  const [draft, setDraft] = useState(q);
  const [results, setResults] = useState<CourseResult[]>([]);
  const [total, setTotal] = useState(0);
  const [universities, setUniversities] = useState<UniversityOption[]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);

  // Keep the input in step with the URL (back button, cleared filters) using
  // React's adjust-state-during-render pattern rather than an effect.
  const [lastQ, setLastQ] = useState(q);
  if (q !== lastQ) {
    setLastQ(q);
    setDraft(q);
  }

  // Filter values live in the URL so a search can be shared or bookmarked.
  const setParam = useCallback(
    (patch: Record<string, string>) => {
      const next = new URLSearchParams(params);
      for (const [k, v] of Object.entries(patch)) {
        if (v) next.set(k, v);
        else next.delete(k);
      }
      if (!('page' in patch)) next.delete('page');
      setParams(next, { replace: true });
    },
    [params, setParams]
  );

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('universities')
      .select('id, name')
      .order('name')
      .then(({ data }) => setUniversities(data ?? []));
  }, []);

  // "Loading" is derived from which filter combination has been fetched rather
  // than tracked with its own setState, so the effect writes no state until
  // the query resolves.
  const queryKey = JSON.stringify({ q, qualification, universityId, page });
  const loading = isSupabaseConfigured && loadedFor !== queryKey;

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    const from = (page - 1) * PAGE_SIZE;
    let query = supabase
      .from('courses')
      .select(
        'id, slug, name, qualification, duration_text, intake_months, english_requirement, universities ( name, location, logo_url ), departments ( name )',
        { count: 'exact' }
      )
      .range(from, from + PAGE_SIZE - 1);

    // websearch_to_tsquery handles quoted phrases and OR the way people
    // actually type into a search box.
    if (q.trim()) query = query.textSearch('search_tsv', q.trim(), { type: 'websearch' });
    if (qualification) query = query.eq('qualification', qualification);
    if (universityId) query = query.eq('university_id', universityId);
    query = query.order('name');

    query.then(({ data, error: err, count }) => {
      if (cancelled) return;
      if (err) {
        setError(err.message);
      } else {
        setResults((data ?? []) as unknown as CourseResult[]);
        setTotal(count ?? 0);
        setError(null);
      }
      setLoadedFor(queryKey);
    });

    return () => {
      cancelled = true;
    };
  }, [q, qualification, universityId, page, queryKey]);

  async function save(courseId: string) {
    if (!supabase || !session) return;
    setSavingId(courseId);
    const { error: err } = await supabase
      .from('shortlists')
      .insert({ student_id: session.user.id, course_id: courseId });
    // 23505 = already shortlisted, which is not a failure worth surfacing.
    if (!err || err.code === '23505') setSaved((s) => new Set(s).add(courseId));
    else setError(err.message);
    setSavingId(null);
  }

  const pages = Math.ceil(total / PAGE_SIZE);
  const showing = useMemo(
    () => (total === 0 ? '0' : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)}`),
    [page, total]
  );

  return (
    <div className="min-h-[100dvh] bg-mist">
      <Navigation />
      <main id="main-content" className="mx-auto max-w-6xl px-5 pb-20 pt-28">
        <h1 className="font-display text-3xl uppercase tracking-wide text-kimono sm:text-5xl">
          Find your course
        </h1>
        <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-mouse">
          Search every programme across our partner universities in Malaysia — by subject,
          qualification, or institution.
        </p>

        {!isSupabaseConfigured ? (
          <div className="mt-10 rounded-lg border border-cream/10 bg-cream/[0.02] px-6 py-12 text-center">
            <p className="font-body text-sm text-mouse">
              The course catalogue is not available on this deployment yet.{' '}
              <Link to="/#contact" className="text-gold hover:underline">
                Contact us
              </Link>{' '}
              and we will send you the full list.
            </p>
          </div>
        ) : (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setParam({ q: draft });
              }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="search"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="e.g. computer science, business, nursing"
                aria-label="Search courses"
                className="flex-1 rounded-md border border-cream/10 bg-cream/[0.06] px-4 py-3 font-body text-sm text-kimono placeholder:text-mouse outline-none transition-colors focus:border-gold/60"
              />
              <button
                type="submit"
                className="rounded-md bg-gold px-6 py-3 font-display text-xs uppercase tracking-wider text-mist transition-shadow hover:shadow-gold"
              >
                Search
              </button>
            </form>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <select
                aria-label="Qualification level"
                value={qualification}
                onChange={(e) => setParam({ level: e.target.value })}
                className="rounded-md border border-cream/10 bg-cream/[0.06] px-3 py-2.5 font-body text-sm text-kimono outline-none focus:border-gold/60"
              >
                <option value="">All qualifications</option>
                {QUALIFICATIONS.map((qual) => (
                  <option key={qual} value={qual}>
                    {qual}
                  </option>
                ))}
              </select>

              <select
                aria-label="University"
                value={universityId}
                onChange={(e) => setParam({ uni: e.target.value })}
                className="min-w-0 flex-1 rounded-md border border-cream/10 bg-cream/[0.06] px-3 py-2.5 font-body text-sm text-kimono outline-none focus:border-gold/60"
              >
                <option value="">All universities</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              {(q || qualification || universityId) && (
                <button
                  onClick={() => setParams(new URLSearchParams(), { replace: true })}
                  className="rounded-md border border-cream/15 px-4 py-2.5 font-body text-xs text-mouse transition-colors hover:border-gold/50 hover:text-gold"
                >
                  Clear
                </button>
              )}
            </div>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-200"
              >
                {error}
              </div>
            )}

            <p className="mt-8 font-body text-xs uppercase tracking-wider text-mouse">
              {loading ? 'Searching…' : `Showing ${showing} of ${total.toLocaleString()} courses`}
            </p>

            {loading ? (
              <div className="flex justify-center py-20">
                <div
                  className="h-8 w-8 animate-spin rounded-full border-2 border-gold/20 border-t-gold"
                  aria-label="Loading"
                />
              </div>
            ) : results.length === 0 ? (
              <div className="mt-6 rounded-lg border border-cream/10 bg-cream/[0.02] px-6 py-14 text-center">
                <p className="font-display text-lg uppercase tracking-wide text-kimono">
                  No matches
                </p>
                <p className="mx-auto mt-3 max-w-md font-body text-sm text-mouse">
                  Try a broader term, or clear the filters and browse from there.
                </p>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {results.map((c, i) => (
                  <Reveal
                    key={c.id}
                    as="li"
                    variant="up"
                    // Only the first screenful cascades; past that the delay
                    // would outlast the scroll and rows would arrive late.
                    index={Math.min(i, 7)}
                    stagger={55}
                    duration={520}
                    className="flex flex-col gap-4 rounded-lg border border-cream/10 bg-cream/[0.02] p-5 transition-colors hover:border-gold/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-body text-base text-kimono">{c.name}</p>
                      <p className="mt-1 font-body text-sm text-mouse">
                        {c.universities?.name}
                        {c.universities?.location ? ` · ${c.universities.location}` : ''}
                      </p>
                      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-body text-xs text-mouse/80">
                        {c.qualification && <span>{c.qualification}</span>}
                        {c.duration_text && <span>· {c.duration_text}</span>}
                        {c.departments?.name && <span>· {c.departments.name}</span>}
                        {c.intake_months?.length > 0 && (
                          <span>· Intake {c.intake_months.join(', ')}</span>
                        )}
                        {c.english_requirement && <span>· {c.english_requirement}</span>}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {session ? (
                        <button
                          onClick={() => save(c.id)}
                          disabled={savingId === c.id || saved.has(c.id)}
                          className="rounded-md border border-cream/15 px-4 py-2 font-body text-xs text-mouse transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-60"
                        >
                          {saved.has(c.id) ? 'Saved' : 'Save'}
                        </button>
                      ) : (
                        <Link
                          to="/portal/login?next=/courses"
                          className="rounded-md border border-cream/15 px-4 py-2 font-body text-xs text-mouse transition-colors hover:border-gold/50 hover:text-gold"
                        >
                          Sign in to save
                        </Link>
                      )}
                    </div>
                  </Reveal>
                ))}
              </ul>
            )}

            {pages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
                <button
                  onClick={() => setParam({ page: String(page - 1) })}
                  disabled={page <= 1}
                  className="rounded-md border border-cream/15 px-4 py-2 font-body text-xs text-mouse transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="font-body text-xs text-mouse">
                  Page {page} of {pages}
                </span>
                <button
                  onClick={() => setParam({ page: String(page + 1) })}
                  disabled={page >= pages}
                  className="rounded-md border border-cream/15 px-4 py-2 font-body text-xs text-mouse transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  );
}
