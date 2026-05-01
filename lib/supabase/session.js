// Server-side Supabase client tied to Next.js cookies — for guest accounts.
// Sessions live in httpOnly cookies; this client reads/writes them.
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export function isSessionReady() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getSessionSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  let jar;
  try { jar = await cookies(); } catch { return null; }

  return createServerClient(url, key, {
    cookies: {
      getAll: () => {
        try { return jar.getAll().map((c) => ({ name: c.name, value: c.value })); }
        catch { return []; }
      },
      setAll: (entries) => {
        for (const { name, value, options } of entries) {
          try { jar.set(name, value, options); } catch { /* read-only context — ignore */ }
        }
      },
    },
  });
}

export async function getCurrentUser() {
  try {
    const sb = await getSessionSupabase();
    if (!sb) return null;
    const { data, error } = await sb.auth.getUser();
    if (error) return null;
    return data?.user ?? null;
  } catch {
    return null;
  }
}
