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
  const { session, profile, loading, configured } = useAuth();
  const location = useLocation();

  if (!configured) return <Navigate to="/" replace />;

  // Hold the render while the session is being restored, otherwise a reload
  // inside the portal bounces the user out to sign-in before it resolves.
  if (loading) {
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

  // Session exists but the profile row has not arrived yet.
  if (!profile) {
    return (
      <div className="min-h-[100dvh] bg-mist flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-full border-2 border-gold/20 border-t-gold animate-spin"
          aria-label="Loading"
        />
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
