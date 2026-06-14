import { createClient } from '@supabase/supabase-js'

// Using environment variables or fallback to a dummy client structure to prevent compilation crash.
// In actual usage, user will configure .env, or the app will show configuration errors in the UI.

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co'
const supabaseUrl = rawSupabaseUrl.replace(/^["']|["']$/g, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key').replace(/^["']|["']$/g, '');

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Utility object to check if Supabase is actually configured
export const isSupabaseConfigured = () => {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}
