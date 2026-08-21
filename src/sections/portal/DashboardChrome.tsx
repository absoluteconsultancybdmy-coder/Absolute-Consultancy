import { Link, useNavigate } from 'react-router-dom';
import { useState, type FormEvent, type ReactNode } from 'react';
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
  rejected: 'border-red-600/30 bg-red-50 text-red-800',
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
  description,
  tabs,
  active,
  onTab,
  children,
}: {
  heading: string;
  description?: string;
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
        {description && (
          <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-mouse">
            {description}
          </p>
        )}

        <div
          role="tablist"
          aria-label="Dashboard sections"
          className="mt-8 flex gap-1 overflow-x-auto border-b border-cream/10"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              aria-controls={`portal-panel-${t.id}`}
              id={`portal-tab-${t.id}`}
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

        <div
          id={`portal-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`portal-tab-${active}`}
          className="mt-8"
        >
          {children}
        </div>
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
    <div className="flex justify-center py-16" role="status" aria-label="Loading dashboard">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-gold/20 border-t-gold"
        aria-hidden="true"
      />
    </div>
  );
}

const profileInput =
  'w-full rounded-md border border-cream/20 bg-white px-3.5 py-2.5 font-body text-sm text-kimono outline-none transition-colors focus:border-gold/60 focus:ring-1 focus:ring-gold/30';

export function ProfileSettings({ agent = false }: { agent?: boolean }) {
  const { profile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [country, setCountry] = useState(profile?.country ?? '');
  const [agencyName, setAgencyName] = useState(profile?.agency_name ?? '');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    try {
      await updateProfile({
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
        country: country.trim() || null,
        ...(agent ? { agency_name: agencyName.trim() || null } : {}),
      });
      setMessage({ kind: 'success', text: 'Profile saved.' });
    } catch {
      setMessage({ kind: 'error', text: 'We could not save your profile. Please try again.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
      <form onSubmit={save} className="rounded-xl border border-cream/15 bg-white p-5 sm:p-7">
        <h2 className="font-display text-xl uppercase tracking-wide text-kimono">Account details</h2>
        <p className="mt-2 font-body text-sm leading-relaxed text-mouse">
          Keep these details current so our team can reach you about time-sensitive updates.
        </p>

        {message && (
          <p
            role={message.kind === 'error' ? 'alert' : 'status'}
            className={`mt-5 rounded-md border px-3.5 py-3 font-body text-sm ${
              message.kind === 'error'
                ? 'border-red-600/25 bg-red-50 text-red-800'
                : 'border-lime/30 bg-lime/10 text-lime'
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="font-body text-xs uppercase tracking-wider text-mouse">
            Full name
            <input
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`${profileInput} mt-2`}
            />
          </label>
          {agent && (
            <label className="font-body text-xs uppercase tracking-wider text-mouse">
              Agency name
              <input
                required
                autoComplete="organization"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className={`${profileInput} mt-2`}
              />
            </label>
          )}
          <label className="font-body text-xs uppercase tracking-wider text-mouse">
            Phone
            <input
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`${profileInput} mt-2`}
            />
          </label>
          <label className="font-body text-xs uppercase tracking-wider text-mouse">
            Country
            <input
              autoComplete="country-name"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={`${profileInput} mt-2`}
            />
          </label>
        </div>

        <div className="mt-4 rounded-md bg-mist px-3.5 py-3">
          <p className="font-body text-xs uppercase tracking-wider text-mouse">Sign-in email</p>
          <p className="mt-1 break-all font-body text-sm text-kimono">{profile?.email ?? '—'}</p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-6 rounded-md bg-gold px-5 py-3 font-display text-xs uppercase tracking-wider text-mist transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save profile'}
        </button>
      </form>

      <aside className="on-navy rounded-xl bg-navy p-6 sm:p-7">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-mouse">Need help?</p>
        <h2 className="mt-3 font-display text-2xl uppercase tracking-wide text-kimono">
          Talk to our team
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mouse">
          Ask about an application, document, student assignment, or portal access.
        </p>
        <a
          href="https://wa.me/60175631621?text=Hello%2C%20I%20need%20help%20with%20the%20Absolute%20Consultancy%20portal."
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex rounded-md bg-kimono px-4 py-2.5 font-display text-xs uppercase tracking-wider text-mist"
        >
          Message on WhatsApp
        </a>
      </aside>
    </div>
  );
}
