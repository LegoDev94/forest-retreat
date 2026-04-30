// GET /api/availability/[id]
// Returns disabled date ranges for a cottage. Public — no PII exposed.
// Uses the SECURITY DEFINER Postgres function `get_unavailable_ranges`.
import { NextResponse } from 'next/server';
import { getServerSupabase, isSupabaseConfigured } from '../../../../lib/supabase/server';
import { findCottage } from '../../../../lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(_request, { params }) {
  const { id } = await params;
  if (!findCottage(id)) {
    return NextResponse.json({ error: 'Unknown cottage' }, { status: 404 });
  }
  if (!isSupabaseConfigured()) {
    // No DB yet — empty availability so UI keeps working
    return NextResponse.json({ ranges: [], configured: false });
  }
  try {
    const sb = getServerSupabase();
    const { data, error } = await sb.rpc('get_unavailable_ranges', { p_cottage_id: id });
    if (error) throw error;
    return NextResponse.json({ ranges: data ?? [], configured: true }, {
      headers: { 'Cache-Control': 'public, max-age=30, s-maxage=30' },
    });
  } catch (err) {
    console.error('availability error:', err);
    return NextResponse.json({ ranges: [], configured: true, error: String(err?.message || err) }, { status: 500 });
  }
}
