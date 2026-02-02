import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://egvtsedkjwrytmgykrie.supabase.co';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
