import { Link, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const APPLICATION_STATUSES = [
  'draft',
  'submitted',
  'under_review',
  'offer_received',
  'offer_accepted',
  'visa_processing',
  'visa_approved',
  'enrolled',
  'rejected',
  'withdrawn',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under review',
  offer_received: 'Offer received',
  offer_accepted: 'Offer accepted',
  visa_processing: 'Visa processing',
  visa_approved: 'Visa approved',
  enrolled: 'Enrolled',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

const STATUS_TONE: Record<ApplicationStatus, string> = {
  draft: 'border-cream/15 text-mouse',
  submitted: 'border-gold/40 text-gold',
  under_review: 'border-gold/40 text-gold',
  offer_received: 'border-lime/40 text-lime',
  offer_accepted: 'border-lime/40 text-lime',
  visa_processing: 'border-gold/40 text-gold',
  visa_approved: 'border-lime/40 text-lime',
  enrolled: 'border-lime/60 text-lime',
  rejected: 'border-red-500/40 text-red-300',
  withdrawn: 'border-cream/15 text-mouse',
};

export function StatusPill({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-1 font-body text-[11px] uppercase tracking-wider ${STATUS_TONE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function formatDate(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatMoney(amount: number | string, currency = 'MYR') {
  const n = typeof amount === 'string' ? Number(amount) : amount;
  if (Number.isNaN(n)) return '—';
  return `${currency} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function DashboardChrome({
  heading,
  tabs,
  active,
  onTab,
  children,
}: {
  heading: string;
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onTab: (id: string) => void;
  children: ReactNode;
}) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-[100dvh] bg-mist">
      <header className="border-b border-cream/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link
            to="/"
            className="font-display text-xs uppercase tracking-[0.3em] text-mouse transition-colors hover:text-gold"
          >
            Absolute Consultancy
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden font-body text-sm text-mouse sm:inline">
              {profile?.full_name ?? profile?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="rounded-md border border-cream/15 px-3 py-1.5 font-body text-xs text-mouse transition-colors hover:border-gold/50 hover:text-gold"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="font-display text-3xl uppercase tracking-wide text-kimono sm:text-4xl">
          {heading}
        </h1>

        <div className="mt-8 flex gap-1 overflow-x-auto border-b border-cream/10">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => onTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 font-display text-xs uppercase tracking-wider transition-colors ${
                active === t.id
                  ? 'border-gold text-gold'
                  : 'border-transparent text-mouse hover:text-kimono'
              }`}
            >
              {t.label}
              {typeof t.count === 'number' && (
                <span className="ml-2 text-[11px] opacity-70">{t.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-cream/10 bg-cream/[0.02] px-6 py-14 text-center">
      <p className="font-display text-lg uppercase tracking-wide text-kimono">{title}</p>
      <p className="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-mouse">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-gold/20 border-t-gold"
        aria-label="Loading"
      />
    </div>
  );
}
