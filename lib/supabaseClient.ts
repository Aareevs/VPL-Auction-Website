import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured) {
  console.warn('Missing Supabase environment variables. Authentication will not work.');
}

// Custom fetch that replaces Supabase's internal AbortController
// with a clean 15-second timeout. This prevents the "signal is
// aborted without reason" error while still allowing requests to timeout.
const customFetch: typeof fetch = (input, init) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  // Use a clean signal, ignore whatever Supabase passes
  const cleanInit: RequestInit = {
    ...(init || {}),
    signal: controller.signal,
  };

  return fetch(input, cleanInit).finally(() => clearTimeout(timeout));
};

export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: customFetch,
    },
  }
);

export const isSupabaseConfigured = () => !!isConfigured;
