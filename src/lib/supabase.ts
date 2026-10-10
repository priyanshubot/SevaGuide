import { createClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.SUPABASE_URL;
const envAnonKey = import.meta.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(envUrl) &&
    Boolean(envAnonKey) &&
    envUrl !== 'https://your-project.supabase.co' &&
    envAnonKey !== 'your-anon-key-here'
  );
};

// Safe fallback for compilation and offline demo
const supabaseUrl = envUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = envAnonKey || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
