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
    <div className="relative min-h-[100dvh] bg-mist flex flex-col items-center justify-center px-5 py-16">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255,0.45) 50%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <Link
        to="/"
        className="font-display tracking-[0.3em] text-xs text-mouse hover:text-gold transition-colors mb-10 uppercase"
      >
        Absolute Consultancy
      </Link>

      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl sm:text-4xl text-kimono uppercase tracking-wide text-center">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-sm text-mouse text-center mt-3 leading-relaxed">
            {subtitle}
          </p>
        )}

        <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.02] p-6 sm:p-8 shadow-glass">
          {children}
        </div>

        {footer && (
          <div className="mt-6 text-center font-body text-sm text-mouse">{footer}</div>
        )}
      </div>
    </div>
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
  'w-full rounded-md border border-white/10 bg-black/40 px-3.5 py-2.5 font-body text-sm text-kimono ' +
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
      ? 'border-red-500/30 bg-red-500/10 text-red-200'
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
