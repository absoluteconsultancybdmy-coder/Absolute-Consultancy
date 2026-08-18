import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../lib/supabase';
import {
  PortalShell,
  Field,
  inputClass,
  SubmitButton,
  FormAlert,
  NotConfiguredNotice,
} from './PortalShell';

const MIN_PASSWORD = 8;

export default function SignUpPage() {
  const { signUp, configured } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [agencyName, setAgencyName] = useState('');

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (role === 'agent' && !agencyName.trim()) {
      setError('Agency name is required for an agent account.');
      return;
    }

    setPending(true);
    try {
      const { needsConfirmation } = await signUp({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        role,
        phone: phone.trim() || undefined,
        country: country.trim() || undefined,
        agencyName: role === 'agent' ? agencyName.trim() : undefined,
      });

      if (needsConfirmation) {
        setSent(true);
        setPending(false);
      } else {
        navigate(role === 'agent' ? '/portal/agent' : '/portal/student', { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the account.');
      setPending(false);
    }
  }

  if (sent) {
    return (
      <PortalShell
        title="Check your email"
        subtitle={`We sent a confirmation link to ${email}. Open it to activate your account.`}
        footer={
          <Link to="/portal/login" className="text-gold hover:underline">
            Back to sign in
          </Link>
        }
      >
        <FormAlert kind="success">
          The link expires after a while — if it does, sign in and request a new one.
        </FormAlert>
      </PortalShell>
    );
  }

  return (
    <PortalShell
      title="Create account"
      subtitle="Students track applications. Agents manage a student roster and commissions."
      footer={
        <>
          Already registered?{' '}
          <Link to="/portal/login" className="text-gold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {!configured ? (
        <NotConfiguredNotice />
      ) : (
        <form onSubmit={onSubmit} noValidate>
          {error && <FormAlert kind="error">{error}</FormAlert>}

          <div
            role="radiogroup"
            aria-label="Account type"
            className="mb-6 grid grid-cols-2 gap-2 rounded-md border border-white/10 p-1"
          >
            {(['student', 'agent'] as const).map((r) => (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={role === r}
                onClick={() => setRole(r)}
                className={`rounded px-3 py-2.5 font-display text-xs uppercase tracking-wider transition-colors ${
                  role === r ? 'bg-gold text-mist' : 'text-mouse hover:text-kimono'
                }`}
              >
                {r === 'student' ? 'Student' : 'Agent'}
              </button>
            ))}
          </div>

          <Field label="Full name" id="fullName">
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass}
            />
          </Field>

          {role === 'agent' && (
            <Field label="Agency name" id="agencyName">
              <input
                id="agencyName"
                type="text"
                autoComplete="organization"
                required
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className={inputClass}
              />
            </Field>
          )}

          <Field label="Email" id="email">
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </Field>

          <Field
            label="Password"
            id="password"
            hint={`At least ${MIN_PASSWORD} characters.`}
          >
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={MIN_PASSWORD}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4">
            <Field label="Phone (optional)" id="phone">
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+880…"
              />
            </Field>

            <Field label="Country (optional)" id="country">
              <input
                id="country"
                type="text"
                autoComplete="country-name"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={inputClass}
                placeholder="Bangladesh"
              />
            </Field>
          </div>

          <div className="mt-2">
            <SubmitButton pending={pending}>
              {role === 'agent' ? 'Create agent account' : 'Create student account'}
            </SubmitButton>
          </div>

          <p className="mt-4 font-body text-xs leading-relaxed text-mouse/70">
            By creating an account you agree to our{' '}
            <Link to="/terms" className="text-gold/80 hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-gold/80 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      )}
    </PortalShell>
  );
}
