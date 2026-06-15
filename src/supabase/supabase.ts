import { createClient } from '@supabase/supabase-js'

// Using environment variables or fallback to a dummy client structure to prevent compilation crash.
// In actual usage, user will configure .env, or the app will show configuration errors in the UI.

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl.replace(/^["']|["']$/g, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, '');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("WARNING: Supabase URL or Anon Key is missing. Supabase functionality will be disabled.");
}

export const supabase = createClient(supabaseUrl || 'https://mock.supabase.co', supabaseAnonKey || 'mock-key');

// Utility object to check if Supabase is actually configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://mock.supabase.co');
}
