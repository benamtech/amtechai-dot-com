import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surface a clear message instead of letting createClient throw at module load,
  // which otherwise crashes the entire app (including routes that never use Supabase).
  console.error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them in your local .env file.'
  );
}

// Fall back to a placeholder so module load never throws; only Supabase-backed
// actions fail (with a network error) rather than white-screening the whole app.
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key'
);
