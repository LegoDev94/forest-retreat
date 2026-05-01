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
  const { error } = await sb
    .from('bookings')
    .update(update)
    .eq('payment_reference', reference);
  if (error) {
    console.error('callback update error:', error);
    return { ok: false, error: error.message };
  }
  console.log(`EveryPay callback: ${reference} event=${eventName} → ${state}`);
  return { ok: true, payment_state: state };
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
