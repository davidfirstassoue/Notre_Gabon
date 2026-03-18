import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("supabaseClient.js: URL present?", !!supabaseUrl);
console.log("supabaseClient.js: Key present?", !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("supabaseClient.js: Missing environment variables!");
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
