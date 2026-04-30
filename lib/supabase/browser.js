// Browser-safe Supabase client (anon key, RLS-protected).
'use client';
import { createClient } from '@supabase/supabase-js';

let _client = null;

export function getBrowserSupabase() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return null; // Caller should handle "demo mode" / no DB configured yet
  }
  _client = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return _client;
}
