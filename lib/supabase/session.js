// Server-side Supabase client tied to Next.js cookies — for guest accounts.
// Sessions live in httpOnly cookies; this client reads/writes them.
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function getSessionSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  const jar = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => jar.getAll().map((c) => ({ name: c.name, value: c.value })),
      setAll: (entries) => {
        for (const { name, value, options } of entries) {
          try { jar.set(name, value, options); } catch { /* called from a server component — silent */ }
        }
      },
    },
  });
}

export async function getCurrentUser() {
  const sb = await getSessionSupabase();
  const { data: { user } } = await sb.auth.getUser();
  return user;
}
