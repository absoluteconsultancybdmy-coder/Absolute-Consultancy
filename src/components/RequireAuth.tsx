import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../lib/supabase';

/**
 * Route guard for the portal.
 *
 * This is a convenience gate, not the security boundary — row level security
 * in Postgres is what actually keeps one account's data away from another.
 * A user who forces their way past this still sees nothing they cannot read.
 */
export default function RequireAuth({
  role,
  children,
}: {
  role?: UserRole;
  children: ReactNode;
}) {
  const {
    session,
    profile,
    loading,
    profileLoading,
    profileError,
    retryProfile,
    signOut,
    configured,
  } = useAuth();
  const location = useLocation();

  if (!configured) return <Navigate to="/" replace />;

  // Hold the render while the session is being restored, otherwise a reload
  // inside the portal bounces the user out to sign-in before it resolves.
  if (loading || profileLoading) {
    return (
      <div className="min-h-[100dvh] bg-mist flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-full border-2 border-gold/20 border-t-gold animate-spin"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!session) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/portal/login?next=${next}`} replace />;
  }

  if (profileError || !profile) {
    return (
      <div className="min-h-[100dvh] bg-mist flex items-center justify-center px-5">
        <div className="w-full max-w-md rounded-xl border border-cream/15 bg-white p-7 text-center shadow-glass">
          <h1 className="font-display text-2xl uppercase tracking-wide text-kimono">
            Profile unavailable
          </h1>
          <p role="alert" className="mt-3 font-body text-sm leading-relaxed text-mouse">
            {profileError ?? 'Your account profile is not ready yet. Please contact our team.'}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={retryProfile}
              className="rounded-md bg-gold px-4 py-2.5 font-display text-xs uppercase tracking-wider text-mist"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={signOut}
              className="rounded-md border border-cream/20 px-4 py-2.5 font-body text-xs text-mouse"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admins are allowed everywhere; otherwise send people to their own side.
  if (role && profile.role !== role && profile.role !== 'admin') {
    return (
      <Navigate to={profile.role === 'agent' ? '/portal/agent' : '/portal/student'} replace />
    );
  }

  return <>{children}</>;
}
