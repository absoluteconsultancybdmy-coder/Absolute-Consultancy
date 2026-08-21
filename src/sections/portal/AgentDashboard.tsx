import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Reveal from '../../components/Reveal';
import TiltCard from '../../components/TiltCard';
import {
  DashboardChrome,
  EmptyState,
  ProfileSettings,
  Spinner,
  StatusPill,
  formatDate,
  formatMoney,
  type ApplicationStatus,
} from './DashboardChrome';

interface StudentRow {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  created_at: string;
}

interface ApplicationRow {
  id: string;
  status: ApplicationStatus;
  submitted_at: string | null;
  created_at: string;
  courses: { name: string; universities: { name: string } | null } | null;
  profiles: { full_name: string | null; email: string | null } | null;
}

interface CommissionRow {
  id: string;
  amount: string;
  currency: string;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  paid_at: string | null;
  created_at: string;
  applications: { courses: { name: string } | null } | null;
}

function MoneyLines({ values }: { values: { currency: string; amount: number }[] }) {
  if (values.length === 0) return <span>—</span>;
  return (
    <>
      {values.map((value) => (
        <span key={value.currency} className="block">
          {formatMoney(value.amount, value.currency)}
        </span>
      ))}
    </>
  );
}

function AgentOverview({
  students,
  applications,
  pending,
  onTab,
}: {
  students: StudentRow[];
  applications: ApplicationRow[];
  pending: { currency: string; amount: number }[];
  onTab: (tab: string) => void;
}) {
  const active = applications.filter(
    (app) => !['enrolled', 'rejected', 'withdrawn'].includes(app.status)
  ).length;
  const decisions = applications.filter((app) =>
    ['offer_received', 'offer_accepted', 'visa_approved', 'enrolled'].includes(app.status)
  ).length;
  const recent = applications.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Assigned students', value: students.length },
          { label: 'Active applications', value: active },
          { label: 'Offers & outcomes', value: decisions },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-cream/15 bg-white p-5">
            <p className="font-body text-xs uppercase tracking-wider text-mouse">{item.label}</p>
            <p className="mt-3 font-display text-3xl tabular-nums text-kimono">{item.value}</p>
          </div>
        ))}
        <div className="on-navy rounded-xl bg-navy p-5">
          <p className="font-body text-xs uppercase tracking-wider text-mouse">Pending commission</p>
          <p className="mt-3 font-display text-xl tabular-nums text-kimono">
            <MoneyLines values={pending} />
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-cream/15 bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-body text-xs uppercase tracking-wider text-mouse">Latest activity</p>
            <h2 className="mt-2 font-display text-xl uppercase tracking-wide text-kimono">
              Recent applications
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onTab('applications')}
            className="font-body text-xs font-semibold text-gold underline-offset-4 hover:underline"
          >
            View all
          </button>
        </div>
        {recent.length === 0 ? (
          <p className="mt-6 font-body text-sm text-mouse">
            Applications will appear here when assigned students begin their course journey.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-cream/10">
            {recent.map((app) => (
              <li key={app.id} className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-body text-sm text-kimono">{app.courses?.name ?? 'Course pending'}</p>
                  <p className="mt-1 font-body text-xs text-mouse">
                    {app.profiles?.full_name ?? app.profiles?.email ?? 'Student'} · {formatDate(app.created_at)}
                  </p>
                </div>
                <StatusPill status={app.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default function AgentDashboard() {
  const [tab, setTab] = useState('overview');
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [commissions, setCommissions] = useState<CommissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  // Every query below is scoped by RLS to this agent's own rows.
  // fetchAll is deliberately free of setState so the effect can apply the
  // result inside a promise callback rather than synchronously in its body.
  const fetchAll = useCallback(async () => {
    if (!supabase) return null;
    return Promise.all([
      supabase
        .from('profiles')
        .select('id, full_name, email, phone, country, created_at')
        .eq('role', 'student')
        .order('created_at', { ascending: false }),
      supabase
        .from('applications')
        .select(
          'id, status, submitted_at, created_at, courses ( name, universities ( name ) ), profiles!applications_student_id_fkey ( full_name, email )'
        )
        .order('created_at', { ascending: false }),
      supabase
        .from('commissions')
        .select('id, amount, currency, status, paid_at, created_at, applications ( courses ( name ) )')
        .order('created_at', { ascending: false }),
    ]);
  }, []);

  const apply = useCallback((res: Awaited<ReturnType<typeof fetchAll>>) => {
    if (!res) return;
    const [s, a, c] = res;
    if (s.error || a.error || c.error) {
      setError(s.error?.message ?? a.error?.message ?? c.error?.message ?? 'Could not load.');
    } else {
      setStudents((s.data ?? []) as unknown as StudentRow[]);
      setApplications((a.data ?? []) as unknown as ApplicationRow[]);
      setCommissions((c.data ?? []) as unknown as CommissionRow[]);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchAll().then((res) => {
      if (!cancelled) apply(res);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchAll, apply]);

  const totals = useMemo(() => {
    const sum = (status: CommissionRow['status']) => {
      const byCurrency = new Map<string, number>();
      commissions
        .filter((commission) => commission.status === status)
        .forEach((commission) => {
          byCurrency.set(
            commission.currency,
            (byCurrency.get(commission.currency) ?? 0) + Number(commission.amount)
          );
        });
      return Array.from(byCurrency, ([currency, amount]) => ({ currency, amount }));
    };
    return { pending: sum('pending'), approved: sum('approved'), paid: sum('paid') };
  }, [commissions]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredStudents = useMemo(
    () =>
      normalizedQuery
        ? students.filter((student) =>
            [student.full_name, student.email, student.phone, student.country].some((value) =>
              value?.toLowerCase().includes(normalizedQuery)
            )
          )
        : students,
    [students, normalizedQuery]
  );
  const filteredApplications = useMemo(
    () =>
      normalizedQuery
        ? applications.filter((application) =>
            [
              application.profiles?.full_name,
              application.profiles?.email,
              application.courses?.name,
              application.courses?.universities?.name,
              application.status,
            ].some((value) => value?.toLowerCase().includes(normalizedQuery))
          )
        : applications,
    [applications, normalizedQuery]
  );

  return (
    <DashboardChrome
      heading="Agent dashboard"
      description="Monitor assigned students, application progress, and commission records."
      active={tab}
      onTab={setTab}
      tabs={[
        { id: 'overview', label: 'Overview' },
        { id: 'students', label: 'Students', count: students.length },
        { id: 'applications', label: 'Applications', count: applications.length },
        { id: 'commissions', label: 'Commissions', count: commissions.length },
        { id: 'profile', label: 'Agency profile' },
      ]}
    >
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-md border border-red-600/25 bg-red-50 px-4 py-3 font-body text-sm text-red-800"
        >
          {error}
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : tab === 'overview' ? (
        <AgentOverview
          students={students}
          applications={applications}
          pending={totals.pending}
          onTab={setTab}
        />
      ) : tab === 'profile' ? (
        <ProfileSettings agent />
      ) : tab === 'students' ? (
        students.length === 0 ? (
          <EmptyState
            title="No students yet"
            body="Students linked to your agency will appear here once they are assigned to you."
          />
        ) : (
          <div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, phone, or country"
              aria-label="Search students"
              className="mb-4 w-full max-w-lg rounded-md border border-cream/20 bg-white px-4 py-3 font-body text-sm text-kimono placeholder:text-mouse outline-none focus:border-gold/60"
            />
            {filteredStudents.length === 0 ? (
              <EmptyState title="No matching students" body="Try a different name, email, phone number, or country." />
            ) : (
          <div className="overflow-x-auto rounded-lg border border-cream/10">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="border-b border-cream/10 bg-cream/[0.02]">
                  {['Name', 'Email', 'Phone', 'Country', 'Joined'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-body text-xs uppercase tracking-wider text-mouse"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="border-b border-cream/5 last:border-0">
                    <td className="px-4 py-3 font-body text-sm text-kimono">{st.full_name ?? '—'}</td>
                    <td className="px-4 py-3 font-body text-sm text-mouse">{st.email ?? '—'}</td>
                    <td className="px-4 py-3 font-body text-sm text-mouse">{st.phone ?? '—'}</td>
                    <td className="px-4 py-3 font-body text-sm text-mouse">{st.country ?? '—'}</td>
                    <td className="px-4 py-3 font-body text-sm text-mouse">{formatDate(st.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            )}
          </div>
        )
      ) : tab === 'applications' ? (
        applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            body="Applications from your students appear here as they are created."
          />
        ) : (
          <div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search student, course, university, or status"
              aria-label="Search applications"
              className="mb-4 w-full max-w-lg rounded-md border border-cream/20 bg-white px-4 py-3 font-body text-sm text-kimono placeholder:text-mouse outline-none focus:border-gold/60"
            />
            {filteredApplications.length === 0 ? (
              <EmptyState title="No matching applications" body="Try a different student, course, university, or status." />
            ) : (
          <ul className="space-y-3">
            {filteredApplications.map((app, i) => (
              <Reveal
                key={app.id}
                as="li"
                index={Math.min(i, 7)}
                stagger={55}
                duration={520}
                className="rounded-lg border border-cream/10 bg-cream/[0.02] p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-body text-base text-kimono">{app.courses?.name}</p>
                  <StatusPill status={app.status} />
                </div>
                <p className="mt-1 font-body text-sm text-mouse">
                  {app.profiles?.full_name ?? app.profiles?.email ?? 'Unknown student'} ·{' '}
                  {app.courses?.universities?.name} · started {formatDate(app.created_at)}
                </p>
              </Reveal>
            ))}
          </ul>
            )}
          </div>
        )
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: 'Pending', value: totals.pending },
              { label: 'Approved', value: totals.approved },
              { label: 'Paid', value: totals.paid },
            ].map((card, i) => (
              <Reveal key={card.label} index={i} stagger={70}>
                <TiltCard className="relative h-full rounded-lg border border-cream/10 bg-cream/[0.02] p-5" max={6} lift={8}>
                <p className="font-body text-xs uppercase tracking-wider text-mouse">{card.label}</p>
                <p className="mt-2 font-display text-xl text-gold">
                  <MoneyLines values={card.value} />
                </p>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          {commissions.length === 0 ? (
            <EmptyState
              title="No commissions yet"
              body="A commission is recorded against each application. Amounts and payment status are set by Absolute Consultancy and shown here read-only."
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-cream/10">
              <table className="w-full min-w-[560px] border-collapse">
                <thead>
                  <tr className="border-b border-cream/10 bg-cream/[0.02]">
                    {['Course', 'Amount', 'Status', 'Paid'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-body text-xs uppercase tracking-wider text-mouse"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((c) => (
                    <tr key={c.id} className="border-b border-cream/5 last:border-0">
                      <td className="px-4 py-3 font-body text-sm text-kimono">
                        {c.applications?.courses?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-kimono">
                        {formatMoney(c.amount, c.currency)}
                      </td>
                      <td className="px-4 py-3 font-body text-sm capitalize text-mouse">{c.status}</td>
                      <td className="px-4 py-3 font-body text-sm text-mouse">{formatDate(c.paid_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </DashboardChrome>
  );
}
