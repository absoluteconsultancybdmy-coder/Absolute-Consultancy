import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  DashboardChrome,
  EmptyState,
  Spinner,
  StatusPill,
  formatDate,
  type ApplicationStatus,
} from './DashboardChrome';

interface CourseSummary {
  id: string;
  slug: string;
  name: string;
  qualification: string | null;
  duration_text: string | null;
  universities: { name: string; location: string | null } | null;
}

interface ShortlistRow {
  id: string;
  created_at: string;
  courses: CourseSummary | null;
}

interface ApplicationRow {
  id: string;
  status: ApplicationStatus;
  submitted_at: string | null;
  created_at: string;
  courses: CourseSummary | null;
}

export default function StudentDashboard() {
  const { session } = useAuth();
  const [tab, setTab] = useState('shortlist');
  const [shortlist, setShortlist] = useState<ShortlistRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // RLS scopes both of these to the signed-in student, so no filter is needed
  // here — the policy is the filter.
  const COURSE_FIELDS =
    'id, slug, name, qualification, duration_text, universities ( name, location )';

  // fetchAll is deliberately free of setState so the effect can apply the
  // result inside a promise callback rather than synchronously in its body.
  const fetchAll = useCallback(async () => {
    if (!supabase) return null;
    return Promise.all([
      supabase
        .from('shortlists')
        .select(`id, created_at, courses ( ${COURSE_FIELDS} )`)
        .order('created_at', { ascending: false }),
      supabase
        .from('applications')
        .select(`id, status, submitted_at, created_at, courses ( ${COURSE_FIELDS} )`)
        .order('created_at', { ascending: false }),
    ]);
  }, []);

  const apply = useCallback((res: Awaited<ReturnType<typeof fetchAll>>) => {
    if (!res) return;
    const [s, a] = res;
    if (s.error || a.error) {
      setError(s.error?.message ?? a.error?.message ?? 'Could not load your dashboard.');
    } else {
      setShortlist((s.data ?? []) as unknown as ShortlistRow[]);
      setApplications((a.data ?? []) as unknown as ApplicationRow[]);
      setError(null);
    }
    setLoading(false);
  }, []);

  const load = useCallback(() => fetchAll().then(apply), [fetchAll, apply]);

  useEffect(() => {
    let cancelled = false;
    fetchAll().then((res) => {
      if (!cancelled) apply(res);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchAll, apply]);

  async function removeFromShortlist(id: string) {
    if (!supabase) return;
    setBusyId(id);
    const { error: err } = await supabase.from('shortlists').delete().eq('id', id);
    if (err) setError(err.message);
    else setShortlist((rows) => rows.filter((r) => r.id !== id));
    setBusyId(null);
  }

  async function applyTo(courseId: string, shortlistId: string) {
    if (!supabase || !session) return;
    setBusyId(shortlistId);
    setError(null);
    const { error: err } = await supabase
      .from('applications')
      .insert({ student_id: session.user.id, course_id: courseId, status: 'draft' });
    if (err) {
      // A unique constraint here means they already applied to this course.
      setError(
        err.code === '23505'
          ? 'You already have an application for that course.'
          : err.message
      );
      setBusyId(null);
      return;
    }
    await load();
    setBusyId(null);
    setTab('applications');
  }

  async function submitApplication(id: string) {
    if (!supabase) return;
    setBusyId(id);
    const { error: err } = await supabase
      .from('applications')
      .update({ status: 'submitted' })
      .eq('id', id);
    if (err) setError(err.message);
    else await load();
    setBusyId(null);
  }

  return (
    <DashboardChrome
      heading="My dashboard"
      active={tab}
      onTab={setTab}
      tabs={[
        { id: 'shortlist', label: 'Shortlist', count: shortlist.length },
        { id: 'applications', label: 'Applications', count: applications.length },
      ]}
    >
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-200"
        >
          {error}
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : tab === 'shortlist' ? (
        shortlist.length === 0 ? (
          <EmptyState
            title="Nothing saved yet"
            body="Browse the course catalogue and save the ones you like. They will show up here so you can compare them and apply when you are ready."
            action={
              <Link
                to="/courses"
                className="inline-block rounded-md bg-gold px-5 py-3 font-display text-xs uppercase tracking-wider text-mist transition-shadow hover:shadow-gold"
              >
                Browse courses
              </Link>
            }
          />
        ) : (
          <ul className="space-y-3">
            {shortlist.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-4 rounded-lg border border-cream/10 bg-cream/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-body text-base text-kimono">{row.courses?.name}</p>
                  <p className="mt-1 font-body text-sm text-mouse">
                    {row.courses?.universities?.name}
                    {row.courses?.duration_text ? ` · ${row.courses.duration_text}` : ''}
                    {row.courses?.qualification ? ` · ${row.courses.qualification}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => row.courses && applyTo(row.courses.id, row.id)}
                    disabled={busyId === row.id}
                    className="rounded-md bg-gold px-4 py-2 font-display text-xs uppercase tracking-wider text-mist transition-shadow hover:shadow-gold disabled:opacity-50"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => removeFromShortlist(row.id)}
                    disabled={busyId === row.id}
                    className="rounded-md border border-cream/15 px-4 py-2 font-body text-xs text-mouse transition-colors hover:border-red-500/40 hover:text-red-300 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          body="When you apply to a course it appears here, and you can follow it from submission through to your visa and enrolment."
        />
      ) : (
        <ul className="space-y-3">
          {applications.map((app) => (
            <li
              key={app.id}
              className="flex flex-col gap-4 rounded-lg border border-cream/10 bg-cream/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-body text-base text-kimono">{app.courses?.name}</p>
                  <StatusPill status={app.status} />
                </div>
                <p className="mt-1 font-body text-sm text-mouse">
                  {app.courses?.universities?.name} · started {formatDate(app.created_at)}
                  {app.submitted_at ? ` · submitted ${formatDate(app.submitted_at)}` : ''}
                </p>
              </div>
              {app.status === 'draft' && (
                <button
                  onClick={() => submitApplication(app.id)}
                  disabled={busyId === app.id}
                  className="shrink-0 rounded-md bg-gold px-4 py-2 font-display text-xs uppercase tracking-wider text-mist transition-shadow hover:shadow-gold disabled:opacity-50"
                >
                  Submit
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </DashboardChrome>
  );
}
