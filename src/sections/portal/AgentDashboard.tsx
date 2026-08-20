import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Reveal from '../../components/Reveal';
import TiltCard from '../../components/TiltCard';
import {
  DashboardChrome,
  EmptyState,
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

export default function AgentDashboard() {
  const [tab, setTab] = useState('students');
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [commissions, setCommissions] = useState<CommissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const sum = (statuses: string[]) =>
      commissions
        .filter((c) => statuses.includes(c.status))
        .reduce((n, c) => n + Number(c.amount), 0);
    return {
      pending: sum(['pending']),
      approved: sum(['approved']),
      paid: sum(['paid']),
    };
  }, [commissions]);

  return (
    <DashboardChrome
      heading="Agent dashboard"
      active={tab}
      onTab={setTab}
      tabs={[
        { id: 'students', label: 'Students', count: students.length },
        { id: 'applications', label: 'Applications', count: applications.length },
        { id: 'commissions', label: 'Commissions', count: commissions.length },
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
      ) : tab === 'students' ? (
        students.length === 0 ? (
          <EmptyState
            title="No students yet"
            body="Students linked to your agency will appear here once they are assigned to you."
          />
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
                {students.map((st) => (
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
        )
      ) : tab === 'applications' ? (
        applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            body="Applications from your students appear here as they are created."
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
                <p className="mt-2 font-display text-2xl text-gold">{formatMoney(card.value)}</p>
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
