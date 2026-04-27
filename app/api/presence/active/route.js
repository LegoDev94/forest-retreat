// GET /api/presence/active — admin-only, returns currently-active visitors
import { NextResponse } from 'next/server';
import { getServerSupabase, isSupabaseConfigured } from '../../../../lib/supabase/server';
import { isAdminAuthenticated } from '../../../../lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, configured: false, visitors: [] });
  }

  const url = new URL(request.url);
  const seconds = Math.min(600, Math.max(10, parseInt(url.searchParams.get('seconds') || '60', 10)));

  const sb = getServerSupabase();
  const { data, error } = await sb.rpc('active_visitors', { p_seconds: seconds });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, visitors: data ?? [] });
}
