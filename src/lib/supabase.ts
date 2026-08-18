import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * True when the portal is configured. The marketing site must keep working
 * without Supabase credentials, so every auth-aware component checks this
 * rather than assuming a client exists.
 */
export const isSupabaseConfigured = Boolean(url && key);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are unset — portal features are disabled.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(url!, key!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export type UserRole = 'student' | 'agent' | 'admin';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  agent_id: string | null;
  agency_name: string | null;
}
