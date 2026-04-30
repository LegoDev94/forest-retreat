// Email via Resend. Falls back to console.log in dev / when not configured.
import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const FROM = process.env.RESEND_FROM || 'Forest Retreat <onboarding@resend.dev>';
const HOST = process.env.HOST_EMAIL || 'hello@forestretreat.lv';

function fmt(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function bookingLines(b, cottage) {
  return [
    `Cottage: ${cottage}`,
    `Check-in: ${fmt(b.check_in)}`,
    `Check-out: ${fmt(b.check_out)}`,
    `Guests: ${b.guests}`,
    `Total: €${b.total_price}`,
    `Booking ID: ${b.id}`,
  ].join('\n');
}

export async function sendBookingNotifications(booking, cottage) {
  const resend = getResend();
  const subjectGuest = `Your booking request — Forest Retreat`;
  const subjectHost  = `New booking: ${cottage} — ${fmt(booking.check_in)} → ${fmt(booking.check_out)}`;

  const guestBody = `Hi ${booking.guest_name},\n\nWe received your booking request and will confirm within an hour.\n\n${bookingLines(booking, cottage)}\n\n— Forest Retreat`;
  const hostBody  = `New booking request:\n\n${bookingLines(booking, cottage)}\n\nGuest: ${booking.guest_name}\nEmail: ${booking.guest_email}\nPhone: ${booking.guest_phone}\nNotes: ${booking.notes || '—'}`;

  if (!resend) {
    console.log('[email fallback — no RESEND_API_KEY]');
    console.log('TO GUEST:', booking.guest_email, '\n', subjectGuest, '\n', guestBody);
    console.log('TO HOST: ', HOST, '\n', subjectHost, '\n', hostBody);
    return { ok: true, mode: 'console' };
  }

  try {
    await Promise.all([
      resend.emails.send({ from: FROM, to: booking.guest_email, subject: subjectGuest, text: guestBody }),
      resend.emails.send({ from: FROM, to: HOST, subject: subjectHost, text: hostBody }),
    ]);
    return { ok: true, mode: 'resend' };
  } catch (err) {
    console.error('Resend send failed:', err);
    return { ok: false, error: String(err?.message || err) };
  }
}
