import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a valid client if keys are present, otherwise create a dummy client to prevent crash
// This allows the app to render and show UI errors instead of WSOD
const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured) {
  console.warn('Missing Supabase environment variables. Authentication will not work.');
}

export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder'
);

// Helper to check configuration status
export const isSupabaseConfigured = () => !!isConfigured;
