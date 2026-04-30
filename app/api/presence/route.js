// POST /api/presence — accepts a visitor heartbeat
import { NextResponse } from 'next/server';
import { getServerSupabase, isSupabaseConfigured } from '../../../lib/supabase/server';

export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, configured: false }, { status: 200 });
  }
  let body;
  try { body = await request.json(); } catch { body = {}; }

  const id = String(body.id || '');
  const page = String(body.page || '/').slice(0, 500);
  const locale = String(body.locale || '').slice(0, 8) || null;
  const uaHash = String(body.uaHash || '').slice(0, 32) || null;

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ ok: false, error: 'bad id' }, { status: 400 });
  }
  try {
    const sb = getServerSupabase();
    const { error } = await sb.rpc('upsert_visitor_ping', {
      p_visitor_id: id, p_page: page, p_locale: locale, p_ua_hash: uaHash,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('presence error:', err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
