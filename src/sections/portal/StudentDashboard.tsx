import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Reveal from '../../components/Reveal';
import { useAuth } from '../../contexts/AuthContext';
import {
  DashboardChrome,
  EmptyState,
  ProfileSettings,
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

const JOURNEY_STEPS = [
  'Free consultation',
  'University shortlist',
  'Application & offer',
  'EMGS student pass',
  'Visa & pre-departure',
  'Arrival in Malaysia',
];

function StudentOverview({
  shortlist,
  applications,
  onTab,
}: {
  shortlist: ShortlistRow[];
  applications: ApplicationRow[];
  onTab: (tab: string) => void;
}) {
  const statuses = new Set(applications.map((app) => app.status));
  const stage = statuses.has('enrolled')
    ? 5
    : statuses.has('visa_approved')
      ? 4
      : statuses.has('visa_processing')
        ? 3
        : applications.length > 0
          ? 2
          : shortlist.length > 0
            ? 1
            : 0;
  const drafts = applications.filter((app) => app.status === 'draft').length;
  const active = applications.filter(
    (app) => !['enrolled', 'rejected', 'withdrawn'].includes(app.status)
  ).length;
  const offers = applications.filter((app) =>
    ['offer_received', 'offer_accepted'].includes(app.status)
  ).length;
  const next = drafts > 0
    ? { title: 'Send your draft for review', body: `${drafts} draft application${drafts === 1 ? ' is' : 's are'} waiting for your confirmation.`, tab: 'applications', label: 'Review applications' }
    : applications.length === 0 && shortlist.length > 0
      ? { title: 'Choose a course to apply for', body: 'Your shortlist is ready. Start an application when you have found the right fit.', tab: 'shortlist', label: 'Open shortlist' }
      : applications.length === 0
        ? { title: 'Build your university shortlist', body: 'Search programmes across our Malaysian university partners and save the strongest options.', tab: 'shortlist', label: 'Start shortlisting' }
        : { title: 'Follow your application updates', body: 'Your consultancy team will update each application as it moves through review, offer, and visa stages.', tab: 'applications', label: 'View applications' };

  return (
    <div className="space-y-6">
      <section className="on-navy grid gap-6 rounded-xl bg-navy p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.22em] text-mouse">Next action</p>
          <h2 className="mt-3 font-display text-2xl uppercase tracking-wide text-kimono sm:text-3xl">
            {next.title}
          </h2>
          <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-mouse">{next.body}</p>
        </div>
        {next.tab === 'shortlist' && shortlist.length === 0 ? (
          <Link
            to="/courses"
            className="inline-flex w-fit rounded-md bg-kimono px-5 py-3 font-display text-xs uppercase tracking-wider text-mist"
          >
            Browse courses
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onTab(next.tab)}
            className="w-fit rounded-md bg-kimono px-5 py-3 font-display text-xs uppercase tracking-wider text-mist"
          >
            {next.label}
          </button>
        )}
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: 'Saved courses', value: shortlist.length },
          { label: 'Active applications', value: active },
          { label: 'Offers received', value: offers },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-cream/15 bg-white p-5">
            <p className="font-body text-xs uppercase tracking-wider text-mouse">{item.label}</p>
            <p className="mt-3 font-display text-3xl tabular-nums text-kimono">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-cream/15 bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-body text-xs uppercase tracking-wider text-mouse">Your study journey</p>
            <h2 className="mt-2 font-display text-xl uppercase tracking-wide text-kimono">
              {JOURNEY_STEPS[stage]}
            </h2>
          </div>
          <span className="font-body text-xs text-mouse">Stage {stage + 1} of {JOURNEY_STEPS.length}</span>
        </div>
        <ol className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {JOURNEY_STEPS.map((step, index) => (
            <li key={step} aria-current={index === stage ? 'step' : undefined}>
              <div className={`h-1 rounded-full ${index <= stage ? 'bg-gold' : 'bg-cream/15'}`} />
              <p className={`mt-2 font-body text-xs leading-snug ${index === stage ? 'font-semibold text-kimono' : 'text-mouse'}`}>
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default function StudentDashboard() {
  const { session } = useAuth();
  const [tab, setTab] = useState('overview');
  const [shortlist, setShortlist] = useState<ShortlistRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

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

  async function sendForReview(id: string) {
    if (!supabase) return;
    setBusyId(id);
    const { error: err } = await supabase
      .from('applications')
      .update({ status: 'submitted', submitted_at: new Date().toISOString() })
      .eq('id', id);
    if (err) setError(err.message);
    else await load();
    setBusyId(null);
    setConfirmingId(null);
  }

  return (
    <DashboardChrome
      heading="My dashboard"
      description="Your courses, applications, and Malaysia study journey in one place."
      active={tab}
      onTab={setTab}
      tabs={[
        { id: 'overview', label: 'Overview' },
        { id: 'shortlist', label: 'Shortlist', count: shortlist.length },
        { id: 'applications', label: 'Applications', count: applications.length },
        { id: 'profile', label: 'My profile' },
      ]}
    >
      {error && (
        <div
          role="alert"
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-red-600/25 bg-red-50 px-4 py-3 font-body text-sm text-red-800"
        >
          <span>{error}</span>
          <button type="button" onClick={load} className="font-semibold underline underline-offset-4">
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : tab === 'overview' ? (
        <StudentOverview shortlist={shortlist} applications={applications} onTab={setTab} />
      ) : tab === 'profile' ? (
        <ProfileSettings />
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
            {shortlist.map((row, i) => (
              <Reveal
                key={row.id}
                as="li"
                index={Math.min(i, 7)}
                stagger={55}
                duration={520}
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
              </Reveal>
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
          {applications.map((app, i) => (
            <Reveal
              key={app.id}
              as="li"
              index={Math.min(i, 7)}
              stagger={55}
              duration={520}
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
                <div className="shrink-0">
                  {confirmingId === app.id ? (
                    <div className="max-w-xs rounded-md border border-gold/20 bg-mist p-3">
                      <p className="font-body text-xs leading-relaxed text-mouse">
                        Send this draft to Absolute Consultancy for review? Your counsellor will
                        confirm documents before any university submission.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => sendForReview(app.id)}
                          disabled={busyId === app.id}
                          className="rounded-md bg-gold px-3 py-2 font-display text-[11px] uppercase tracking-wider text-mist disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingId(null)}
                          className="rounded-md border border-cream/20 px-3 py-2 font-body text-xs text-mouse"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingId(app.id)}
                      className="rounded-md bg-gold px-4 py-2 font-display text-xs uppercase tracking-wider text-mist transition-shadow hover:shadow-gold"
                    >
                      Send for review
                    </button>
                  )}
                </div>
              )}
            </Reveal>
          ))}
        </ul>
      )}
    </DashboardChrome>
  );
}
