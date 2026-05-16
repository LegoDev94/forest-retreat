// EveryPay webhook receiver. They POST when payment status changes.
// We just re-fetch the latest state via API and update our row.
import { NextResponse } from 'next/server';
import { getServerSupabase, isSupabaseConfigured } from '../../../../lib/supabase/server';
import {
  getPaymentStatus, isEverypayConfigured, mapEverypayState,
} from '../../../../lib/everypay';

export const dynamic = 'force-dynamic';

async function handleCallback(reference, eventName) {
  if (!reference) return { ok: false, error: 'missing_reference' };
  if (!isSupabaseConfigured() || !isEverypayConfigured()) {
    return { ok: false, error: 'not_configured' };
  }
  const sb = getServerSupabase();
  const data = await getPaymentStatus(reference);
  const state = mapEverypayState(data.payment_state);
  const update = {
    payment_state: state,
    payment_raw:   data,
  };
  if (state === 'paid') {
    update.payment_paid_at = new Date().toISOString();
    update.status = 'confirmed';
  }

  // EveryPay sends one webhook per payment_reference; we don't know upfront
  // whether it belongs to a cottage booking or a service booking. Try
  // bookings first; if no row matched, try service_bookings.
  let kind = 'cottage';
  let res = await sb
    .from('bookings')
    .update(update)
    .eq('payment_reference', reference)
    .select('id');
  if (!res.error && (res.data ?? []).length === 0) {
    kind = 'service';
    res = await sb
      .from('service_bookings')
      .update(update)
      .eq('payment_reference', reference)
      .select('id');
  }
  if (res.error) {
    console.error('callback update error:', res.error);
    return { ok: false, error: res.error.message };
  }
  if ((res.data ?? []).length === 0) {
    console.warn(`EveryPay callback: ${reference} matched no row in either table`);
    return { ok: false, error: 'unknown_reference' };
  }
  console.log(`EveryPay callback: ${reference} event=${eventName} kind=${kind} → ${state}`);
  return { ok: true, payment_state: state, kind };
}

export async function POST(request) {
  let payload = {};
  try {
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      payload = await request.json();
    } else {
      // EveryPay can send urlencoded or query-string-like body
      const text = await request.text();
      const form = new URLSearchParams(text);
      payload = Object.fromEntries(form.entries());
    }
  } catch {}
  const reference = payload.payment_reference || payload.payment_state || null;
  const event = payload.event_name || 'status_updated';
  const result = await handleCallback(payload.payment_reference, event);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

// Some integrations also send GET — accept and treat the same
export async function GET(request) {
  const url = new URL(request.url);
  const result = await handleCallback(
    url.searchParams.get('payment_reference'),
    url.searchParams.get('event_name') || 'status_updated'
  );
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
