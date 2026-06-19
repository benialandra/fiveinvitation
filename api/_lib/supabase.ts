import { createClient } from '@supabase/supabase-js';

// Shared Supabase client for serverless functions
const supabaseUrl = (process.env.VITE_SUPABASE_URL || '').replace(/^["']|["']$/g, '');
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, '');

export const supabase = createClient(supabaseUrl || 'https://mock.supabase.co', supabaseKey || 'mock-key');
export const isMock = !supabaseUrl || supabaseUrl === 'https://mock.supabase.co';

// Simple rate-limit helper (per-function invocation, best-effort)
export function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
