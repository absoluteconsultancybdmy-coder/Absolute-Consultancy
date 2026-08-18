import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  PortalShell,
  Field,
  inputClass,
  SubmitButton,
  FormAlert,
  NotConfiguredNotice,
} from './PortalShell';

/**
 * One sign-in screen for both students and agents.
 *
 * Deliberately no student/agent switch here: the account's role already lives
 * on its profile, so asking again at sign-in would let someone pick the wrong
 * side and see a confusing failure. The role decides where they land instead.
 */
export default function LoginPage() {
  const { signIn, resetPassword, session, profile, configured } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(
    params.get('confirmed') ? 'Email confirmed — you can sign in now.' : null
  );

  // Wait for the profile before redirecting: the role determines the landing
  // page, and it arrives a moment after the session does.
  useEffect(() => {
    if (!session || !profile) return;
    const target = params.get('next');
    if (target?.startsWith('/')) {
      navigate(target, { replace: true });
      return;
    }
    navigate(profile.role === 'agent' ? '/portal/agent' : '/portal/student', {
      replace: true,
    });
  }, [session, profile, navigate, params]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await signIn(email.trim(), password);
      // Redirect happens in the effect above, once the profile resolves.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
      setPending(false);
    }
  }

  async function onForgot() {
    setError(null);
    setNotice(null);
    if (!email.trim()) {
      setError('Enter your email address first, then choose “Forgot password”.');
      return;
    }
    try {
      await resetPassword(email.trim());
      setNotice('If that email has an account, a reset link is on its way.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the reset email.');
    }
  }

  return (
    <PortalShell
      title="Sign in"
      subtitle="Track your applications, shortlist courses, and pick up where you left off."
      footer={
        <>
          New here?{' '}
          <Link to="/portal/signup" className="text-gold hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {!configured ? (
        <NotConfiguredNotice />
      ) : (
        <form onSubmit={onSubmit} noValidate>
          {error && <FormAlert kind="error">{error}</FormAlert>}
          {notice && <FormAlert kind="success">{notice}</FormAlert>}

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

          <Field label="Password" id="password">
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </Field>

          <div className="mb-6 text-right">
            <button
              type="button"
              onClick={onForgot}
              className="font-body text-xs text-mouse hover:text-gold transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <SubmitButton pending={pending}>Sign in</SubmitButton>
        </form>
      )}
    </PortalShell>
  );
}
