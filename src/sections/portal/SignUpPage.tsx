import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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

  const [role, setRole] = useState<'student' | 'agent'>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');

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
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setPending(true);
    try {
      const { needsConfirmation } = await signUp({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
        country: country.trim() || undefined,
      });

      if (needsConfirmation) {
        setSent(true);
        setPending(false);
      } else {
        navigate('/portal/student', { replace: true });
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
      subtitle="Create a student account, or request approved access for your education agency."
      footer={
        <>
          Already registered?{' '}
          <Link to="/portal/login" className="text-gold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <fieldset className="mb-7 grid grid-cols-2 gap-2 rounded-md border border-cream/15 p-1">
        <legend className="sr-only">Account type</legend>
        {(['student', 'agent'] as const).map((r) => (
          <label
            key={r}
            className={`cursor-pointer rounded px-3 py-2.5 text-center font-display text-xs uppercase tracking-wider transition-colors ${
              role === r ? 'bg-gold text-mist' : 'text-mouse hover:text-kimono'
            }`}
          >
            <input
              type="radio"
              name="accountType"
              value={r}
              checked={role === r}
              onChange={() => setRole(r)}
              className="sr-only"
            />
            {r === 'student' ? 'Student' : 'Education agent'}
          </label>
        ))}
      </fieldset>

      {!configured ? (
        <NotConfiguredNotice />
      ) : role === 'agent' ? (
        <div className="rounded-xl border border-cream/15 bg-mist p-5 sm:p-6">
          <p className="font-display text-lg uppercase tracking-wide text-kimono">
            Agent access is approved
          </p>
          <p className="mt-3 font-body text-sm leading-relaxed text-mouse">
            To protect student records and commission data, agent accounts are created after
            Absolute Consultancy verifies the agency and its authorised contact.
          </p>
          <a
            href="https://wa.me/60175631621?text=I%27d%20like%20to%20request%20access%20to%20the%20Absolute%20Consultancy%20agent%20portal."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-md bg-gold px-5 py-3 font-display text-xs uppercase tracking-wider text-mist transition-transform hover:-translate-y-0.5"
          >
            Request agent access
          </a>
          <p className="mt-4 font-body text-xs leading-relaxed text-mouse">
            Already approved?{' '}
            <Link to="/portal/login" className="text-gold hover:underline">
              Sign in here
            </Link>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          {error && <FormAlert kind="error">{error}</FormAlert>}

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

          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4">
            <Field label="Password" id="password" hint={`At least ${MIN_PASSWORD} characters.`}>
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
            <Field label="Confirm password" id="confirmPassword">
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={MIN_PASSWORD}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

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
            <SubmitButton pending={pending}>Create student account</SubmitButton>
          </div>

          <p className="mt-4 font-body text-xs leading-relaxed text-mouse">
            By creating an account you agree to our{' '}
            <Link to="/terms" className="text-gold/80 hover:underline">Terms</Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-gold/80 hover:underline">Privacy Policy</Link>.
          </p>
        </form>
      )}
    </PortalShell>
  );
}
