import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured) {
  console.warn('Missing Supabase environment variables. Authentication will not work.');
}

// Custom fetch that strips the internal AbortController signal
// to prevent "AbortError: signal is aborted without reason"
const customFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  if (init) {
    // Remove the abort signal that Supabase JS injects internally
    const { signal, ...rest } = init;
    return fetch(input, rest);
  }
  return fetch(input);
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

// Helper to check configuration status
export const isSupabaseConfigured = () => !!isConfigured;
