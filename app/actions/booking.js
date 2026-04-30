'use server';
// Server Action — creates a booking with concurrency guard.
import { getServerSupabase, isSupabaseConfigured } from '../../lib/supabase/server';
import { findCottage } from '../../lib/data';
import { sendBookingNotifications } from '../../lib/email';

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

  return { ok: true, booking: data };
}
