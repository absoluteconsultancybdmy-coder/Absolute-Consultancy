import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, type Profile } from '../lib/supabase';

interface SignUpArgs {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  country?: string;
}

type ProfileUpdates = Pick<Profile, 'full_name' | 'phone' | 'country' | 'agency_name'>;

interface AuthValue {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  profileError: string | null;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (args: SignUpArgs) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (updates: Partial<ProfileUpdates>) => Promise<void>;
  retryProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Load the profile row for the signed-in user. Kept separate from the
  // session so a profile fetch failure never blocks auth state.
  const loadProfile = useCallback(async (userId: string) => {
    if (!supabase) return;
    setProfileLoading(true);
    setProfileError(null);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, full_name, email, phone, country, agent_id, agency_name')
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      console.error('[auth] failed to load profile', error.message);
      setProfile(null);
      setProfileError('We could not load your portal profile. Please try again.');
      setProfileLoading(false);
      return;
    }
    setProfile(data as Profile | null);
    if (!data) setProfileError('Your account profile is not ready yet. Please contact our team.');
    setProfileLoading(false);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) loadProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (next?.user) {
        setProfile(null);
        loadProfile(next.user.id);
      } else {
        setProfile(null);
        setProfileError(null);
        setProfileLoading(false);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Portal is not configured.');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }, []);

  const signUp = useCallback(async (args: SignUpArgs) => {
    if (!supabase) throw new Error('Portal is not configured.');
    // Public registration always creates a student. Agent/admin roles must be
    // assigned through the consultancy's trusted approval workflow.
    const { data, error } = await supabase.auth.signUp({
      email: args.email,
      password: args.password,
      options: {
        data: {
          full_name: args.fullName,
          role: 'student',
          phone: args.phone ?? null,
          country: args.country ?? null,
        },
        emailRedirectTo: `${window.location.origin}/portal/login`,
      },
    });
    if (error) throw new Error(error.message);
    return { needsConfirmation: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!supabase) throw new Error('Portal is not configured.');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/login?recovery=1`,
    });
    if (error) throw new Error(error.message);
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (!supabase) throw new Error('Portal is not configured.');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<ProfileUpdates>) => {
    if (!supabase) throw new Error('Portal is not configured.');
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) throw new Error('Please sign in again.');
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', auth.user.id)
      .select('id, role, full_name, email, phone, country, agent_id, agency_name')
      .single();
    if (error) throw new Error(error.message);
    setProfile(data as Profile);
  }, []);

  const retryProfile = useCallback(async () => {
    if (session?.user) await loadProfile(session.user.id);
  }, [session, loadProfile]);

  const value = useMemo<AuthValue>(
    () => ({
      session,
      profile,
      loading,
      profileLoading,
      profileError,
      configured: isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      updateProfile,
      retryProfile,
    }),
    [
      session,
      profile,
      loading,
      profileLoading,
      profileError,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      updateProfile,
      retryProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
