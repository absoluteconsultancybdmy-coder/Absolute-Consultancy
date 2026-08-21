import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

/**
 * Centred card layout shared by the sign-in and sign-up screens. Kept separate
 * from the dashboard chrome, which needs the full-width nav.
 */
export function PortalShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main
      id="main-content"
      className="relative min-h-[100dvh] bg-mist flex items-center justify-center px-4 py-8 sm:px-6 lg:py-12"
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgb(var(--color-gold) / 0.45) 50%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-cream/15 bg-white shadow-[0_24px_80px_rgba(3,29,76,0.12)] lg:grid-cols-[0.86fr_1.14fr]">
        <aside className="on-navy relative flex min-h-56 flex-col justify-between overflow-hidden bg-navy p-7 sm:p-9 lg:min-h-[680px]">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.jpg`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/80 to-navy" aria-hidden="true" />

          <Link to="/" className="relative z-10 inline-flex w-fit items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}images/logo.png`}
              alt="Absolute Consultancy Firm"
              className="h-11 w-11 rounded-md bg-white object-contain p-1"
            />
            <span className="font-display text-xs uppercase tracking-[0.22em] text-kimono">
              Absolute Consultancy
            </span>
          </Link>

          <div className="relative z-10 mt-12 max-w-sm lg:mt-0">
            <p className="font-body text-[11px] uppercase tracking-[0.28em] text-mouse">
              Your Malaysia study workspace
            </p>
            <h2 className="mt-4 font-display text-3xl uppercase leading-tight tracking-wide text-kimono sm:text-4xl">
              One place for every next step.
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <div className="border-l border-kimono/25 pl-4">
                <p className="font-display text-sm uppercase tracking-wider text-kimono">Students</p>
                <p className="mt-1 font-body text-sm leading-relaxed text-mouse">
                  Save courses, track applications, and stay clear on what happens next.
                </p>
              </div>
              <div className="border-l border-kimono/25 pl-4">
                <p className="font-display text-sm uppercase tracking-wider text-kimono">Agents</p>
                <p className="mt-1 font-body text-sm leading-relaxed text-mouse">
                  Follow assigned students, applications, and commission records.
                </p>
              </div>
            </div>
          </div>

          <p className="relative z-10 mt-10 font-body text-xs leading-relaxed text-mouse">
            Role-based access · Protected by Supabase authentication
          </p>
        </aside>

        <section className="flex flex-col justify-center px-6 py-9 sm:px-10 lg:px-14 lg:py-12">
          <Link
            to="/"
            className="mb-8 w-fit font-body text-xs text-mouse transition-colors hover:text-gold"
          >
            ← Back to website
          </Link>
          <h1 className="font-display text-3xl uppercase tracking-wide text-kimono sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-mouse">
              {subtitle}
            </p>
          )}

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6 font-body text-sm text-mouse">{footer}</div>}
        </section>
      </div>
    </main>
  );
}

export function Field({
  label,
  id,
  hint,
  children,
}: {
  label: string;
  id: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block font-body text-xs uppercase tracking-wider text-mouse mb-2"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 font-body text-xs text-mouse">{hint}</p>}
    </div>
  );
}

export const inputClass =
  'w-full rounded-md border border-cream/20 bg-mist px-3.5 py-2.5 font-body text-sm text-kimono ' +
  'placeholder:text-mouse outline-none transition-colors focus:border-gold/60 focus:ring-1 focus:ring-gold/30';

export function SubmitButton({
  children,
  pending,
  disabled,
}: {
  children: ReactNode;
  pending?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full rounded-md bg-gold px-4 py-3 font-display text-sm uppercase tracking-wider text-mist
                 transition-all hover:shadow-gold disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? 'Please wait…' : children}
    </button>
  );
}

export function FormAlert({ kind, children }: { kind: 'error' | 'success'; children: ReactNode }) {
  const tone =
    kind === 'error'
      ? 'border-red-600/25 bg-red-50 text-red-800'
      : 'border-lime/30 bg-lime/10 text-lime';
  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      className={`mb-5 rounded-md border px-3.5 py-3 font-body text-sm ${tone}`}
    >
      {children}
    </div>
  );
}

/**
 * Shown instead of a sign-in form when the Supabase keys are absent, so a
 * misconfigured deploy explains itself rather than failing on submit.
 */
export function NotConfiguredNotice() {
  return (
    <FormAlert kind="error">
      The student and agent portal is not configured on this deployment. Please contact us
      directly and we will help you from there.
    </FormAlert>
  );
}
