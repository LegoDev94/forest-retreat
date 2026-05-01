'use server';
// Server Action — creates a booking with concurrency guard.
import { headers } from 'next/headers';
import { getServerSupabase, isSupabaseConfigured } from '../../lib/supabase/server';
import { findCottage } from '../../lib/data';
import { sendBookingNotifications } from '../../lib/email';
import {
  createOneoffPayment, isEverypayConfigured, mapEverypayState,
} from '../../lib/everypay';

const ERRORS = {
  BOOKING_CONFLICT: { code: 'CONFLICT',     message: 'These dates have just been booked. Please pick others.' },
  DATES_BLOCKED:    { code: 'BLOCKED',      message: 'Selected dates are not available.' },
  INVALID_DATES:    { code: 'BAD_REQUEST',  message: 'Check-out must be after check-in.' },
  PAST_DATE:        { code: 'BAD_REQUEST',  message: 'Check-in cannot be in the past.' },
  COTTAGE_NOT_FOUND:{ code: 'NOT_FOUND',    message: 'Cottage not found.' },
};

function badRequest(message) { return { ok: false, code: 'BAD_REQUEST', message }; }

export async function createBooking(input) {
  // Validate
  if (!input || typeof input !== 'object') return badRequest('Invalid payload');
  const {
    cottageId, checkIn, checkOut, guests,
    name, email, phone, notes, locale = 'ru',
  } = input;

  if (!cottageId || !checkIn || !checkOut || !guests) return badRequest('Missing required fields');
  if (!name?.trim() || !email?.trim() || !phone?.trim()) return badRequest('Name, email, phone are required');
  if (!/^\S+@\S+\.\S+$/.test(email)) return badRequest('Invalid email');
  const cottage = findCottage(cottageId);
  if (!cottage) return badRequest('Unknown cottage');
  const guestsNum = Number(guests);
  if (!Number.isFinite(guestsNum) || guestsNum < 1 || guestsNum > 10) return badRequest('Guests must be 1-10');

  if (!isSupabaseConfigured()) {
    // Demo mode — no DB yet. Return success without persisting.
    console.warn('Booking submitted in DEMO MODE (no Supabase env vars set)');
    return {
      ok: true,
      demo: true,
      booking: { id: 'demo', cottage_id: cottageId, check_in: checkIn, check_out: checkOut },
    };
  }

  const sb = getServerSupabase();
  const { data, error } = await sb.rpc('try_create_booking', {
    p_cottage_id:  cottageId,
    p_check_in:    checkIn,
    p_check_out:   checkOut,
    p_guests:      guestsNum,
    p_guest_name:  name.trim(),
    p_guest_email: email.trim(),
    p_guest_phone: phone.trim(),
    p_notes:       notes?.trim() || null,
    p_locale:      locale,
  });

  if (error) {
    const known = ERRORS[error.message?.trim()];
    if (known) return { ok: false, ...known };
    console.error('createBooking error:', error);
    return { ok: false, code: 'SERVER_ERROR', message: 'Could not save booking. Please try again.' };
  }

  // Fire-and-forget email (don't fail the booking if email fails)
  sendBookingNotifications(data, cottage.name?.en || cottageId).catch((e) =>
    console.error('email error (non-fatal):', e)
  );

  // If EveryPay is configured, initiate payment immediately and return pay_url.
  // Don't fail the booking if payment init fails — the host can charge offline.
  let payUrl = null;
  if (isEverypayConfigured()) {
    try {
      const h = await headers();
      const proto = h.get('x-forwarded-proto') || 'https';
      const host = h.get('x-forwarded-host') || h.get('host');
      const origin = `${proto}://${host}`;
      const pay = await createOneoffPayment({
        amount:          data.total_price,
        orderReference:  `bk-${data.id.slice(0, 18)}`,
        customerUrl:     `${origin}/${locale}/payment/return`,
        email:           data.guest_email,
        locale,
        description:     `Forest Retreat ${cottage.name?.en || cottageId} ${data.check_in}/${data.check_out}`,
      });
      // Persist what we got back
      await sb.from('bookings').update({
        payment_state:        mapEverypayState(pay.payment_state),
        payment_reference:    pay.payment_reference,
        payment_link:         pay.payment_link,
        payment_initiated_at: new Date().toISOString(),
        payment_raw:          pay.raw,
      }).eq('id', data.id);
      payUrl = pay.payment_link;
    } catch (err) {
      console.error('EveryPay init failed (booking still created):', err);
    }
  }

  return { ok: true, booking: data, pay_url: payUrl };
}

// Manual re-fetch from EveryPay (used by /payment/return when customer comes back).
export async function refreshPaymentStatus(paymentReference) {
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
    if (newState === 'paid') update.payment_paid_at = new Date().toISOString();
    // Auto-confirm booking once payment settles
    if (newState === 'paid') update.status = 'confirmed';
    const { data: row, error } = await sb
      .from('bookings')
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
