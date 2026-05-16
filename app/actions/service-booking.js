'use server';
// Server action for ancillary-service bookings (deer ticket, picnic kit,
// tent, jacuzzi, sauna). Same pattern as the main createBooking: insert →
// init EveryPay → store pay_url; rollback row if anything fails.
import { headers } from 'next/headers';
import { getServerSupabase, isSupabaseConfigured } from '../../lib/supabase/server';
import {
  createOneoffPayment, isEverypayConfigured, mapEverypayState,
} from '../../lib/everypay';
import { SERVICE_KINDS, LIMITS, quoteService } from '../../lib/services';
import { upsertGuestAccount } from './account';

function bad(msg) { return { ok: false, code: 'BAD_REQUEST', message: msg }; }

const SERVICE_DESC = {
  deer_ticket: 'Deer-park ticket',
  picnic_kit:  'Picnic kit (tent + grill)',
  tent:        'Tent overnight',
  jacuzzi:     'Jacuzzi session',
  sauna:       'Sauna session',
};

export async function createServiceBooking(input) {
  if (!input || typeof input !== 'object') return bad('Invalid payload');

  const {
    kind,
    serviceDate,
    quantity = 1,
    mode = 'hour',    // picnic_kit: 'hour' | 'day'
    hours = 1,        // picnic_kit hourly
    days = 1,         // tent
    startTime = null, // optional HH:MM for jacuzzi/sauna/picnic
    name, email, phone, notes,
    locale = 'ru',
  } = input;

  if (!SERVICE_KINDS.includes(kind)) return bad('Unknown service');
  if (!serviceDate || !/^\d{4}-\d{2}-\d{2}$/.test(serviceDate)) return bad('Invalid date');
  // Reject dates in the past (compare in UTC date)
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (new Date(serviceDate) < today) return bad('Date in the past');

  if (!name?.trim() || !email?.trim() || !phone?.trim()) return bad('Name, email, phone are required');
  if (!/^\S+@\S+\.\S+$/.test(email)) return bad('Invalid email');

  const lim = LIMITS[kind];
  const q = Number(quantity);
  if (!Number.isFinite(q) || q < lim.qtyMin || q > lim.qtyMax) return bad(`Quantity must be ${lim.qtyMin}–${lim.qtyMax}`);

  if (kind === 'picnic_kit') {
    if (!['hour', 'day'].includes(mode)) return bad('mode must be hour or day');
    if (mode === 'hour') {
      const h = Number(hours);
      if (!Number.isFinite(h) || h < lim.hoursMin || h > lim.hoursMax) return bad('Invalid hours');
    }
  }
  if (kind === 'tent') {
    const d = Number(days);
    if (!Number.isFinite(d) || d < lim.daysMin || d > lim.daysMax) return bad('Invalid days');
  }

  // SERVER-SIDE PRICE — never trust client total
  const total = quoteService({ kind, quantity: q, mode, hours, days });
  if (total <= 0) return bad('Could not compute price');

  if (!isSupabaseConfigured()) {
    return {
      ok: true, demo: true,
      booking: { id: 'demo', service_kind: kind, total_price: total },
    };
  }

  const sb = getServerSupabase();
  const row = {
    service_kind:   kind,
    service_date:   serviceDate,
    start_time:     startTime || null,
    duration_hours: kind === 'picnic_kit' && mode === 'hour' ? Math.max(1, Number(hours) || 1)
                   : kind === 'tent' ? Math.max(1, Number(days) || 1) * 24
                   : kind === 'jacuzzi' || kind === 'sauna' ? 3
                   : null,
    quantity:       q,
    guest_name:     name.trim(),
    guest_email:    email.trim(),
    guest_phone:    phone.trim(),
    notes:          notes?.trim() || null,
    total_price:    total,
    locale,
  };

  const { data, error } = await sb
    .from('service_bookings')
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error('service_bookings insert failed:', error);
    return { ok: false, code: 'SERVER_ERROR', message: 'Could not save booking.' };
  }

  // Link to guest account (best-effort)
  try {
    const account = await upsertGuestAccount({ phone, fullName: name, email });
    if (account?.user_id) {
      await sb.from('service_bookings').update({ user_id: account.user_id }).eq('id', data.id);
    }
  } catch (e) {
    console.error('service account link failed (non-fatal):', e);
  }

  if (!isEverypayConfigured()) {
    await sb.from('service_bookings').delete().eq('id', data.id);
    return {
      ok: false,
      code: 'PAYMENT_UNAVAILABLE',
      message: 'Платёжная система временно недоступна. Свяжитесь с нами на hello@forestretreat.lv',
    };
  }

  let pay;
  try {
    const h = await headers();
    const proto = h.get('x-forwarded-proto') || 'https';
    const host  = h.get('x-forwarded-host')  || h.get('host');
    const origin = `${proto}://${host}`;
    pay = await createOneoffPayment({
      amount:         data.total_price,
      orderReference: `sv-${data.id.slice(0, 18)}`,
      customerUrl:    `${origin}/${locale}/payment/return`,
      email:          data.guest_email,
      locale,
      description:    `Forest Retreat - ${SERVICE_DESC[kind] || kind} - ${data.service_date}`,
    });
  } catch (err) {
    console.error('EveryPay init failed (service) — rolling back row:', err);
    await sb.from('service_bookings').delete().eq('id', data.id);
    return { ok: false, code: 'PAYMENT_INIT_FAILED', message: 'Не удалось создать платёж.' };
  }

  await sb.from('service_bookings').update({
    payment_state:        mapEverypayState(pay.payment_state),
    payment_reference:    pay.payment_reference,
    payment_link:         pay.payment_link,
    payment_initiated_at: new Date().toISOString(),
    payment_raw:          pay.raw,
  }).eq('id', data.id);

  return { ok: true, booking: data, pay_url: pay.payment_link };
}

// Manual re-fetch from EveryPay for service bookings (used by /payment/return).
export async function refreshServicePaymentStatus(paymentReference) {
  if (!paymentReference) return { ok: false, error: 'missing_reference' };
  if (!isSupabaseConfigured() || !isEverypayConfigured()) {
    return { ok: false, error: 'not_configured' };
  }
  const sb = getServerSupabase();
  try {
    const { getPaymentStatus } = await import('../../lib/everypay');
    const data = await getPaymentStatus(paymentReference);
    const newState = mapEverypayState(data.payment_state);
    const update = {
      payment_state: newState,
      payment_raw:   data,
    };
    if (newState === 'paid') {
      update.payment_paid_at = new Date().toISOString();
      update.status = 'confirmed';
    }
    const { data: row, error } = await sb
      .from('service_bookings')
      .update(update)
      .eq('payment_reference', paymentReference)
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    return { ok: true, booking: row, payment_state: data.payment_state };
  } catch (err) {
    return { ok: false, error: String(err?.message || err) };
  }
}
