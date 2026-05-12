// Orchestrates two-way sync with Lodgify.
//
// INBOUND (Lodgify → us):  runLodgifyInboundSync()
//   - Pulls confirmed bookings from each configured Lodgify property
//   - Upserts into public.bookings on lodgify_id (unique constraint)
//   - source = 'lodgify', status = 'confirmed'
//
// OUTBOUND (us → Lodgify):  pushBookingToLodgify(booking)
//   - Called after our local booking transitions to status='confirmed'
//     (i.e. payment settled). Best-effort, never blocks the user flow.
//   - On success, persists the returned Lodgify booking ID back to our row.

import { getServerSupabase, isSupabaseConfigured } from './supabase/server.js';
import {
  iterateBookings,
  createReservation,
  cottageIdForLodgify,
  configuredCottages,
  isLodgifyConfigured,
  lodgifyPropertyIdFor,
} from './lodgify.js';

// ----------------------------------------------------------
// Helpers — translate Lodgify shapes ↔ our schema
// ----------------------------------------------------------

// Status semantics are best-effort: Lodgify uses "Booked", "Tentative",
// "Open", "Declined", etc. We treat anything non-final as confirmed
// (it occupies the calendar) and explicit cancellations as cancelled.
function mapLodgifyStatus(raw) {
  const s = String(raw || '').toLowerCase();
  if (['declined', 'cancelled', 'canceled', 'no-show'].some((x) => s.includes(x))) {
    return 'cancelled';
  }
  return 'confirmed';
}

function num(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? Math.round(n) : fallback;
}

function lodgifyToBookingRow(b) {
  // Field names per https://docs.lodgify.com/reference/get_v2-reservations-bookings
  const propertyId = b.property_id ?? b.propertyId;
  const cottageId  = cottageIdForLodgify(propertyId);
  if (!cottageId) return null;

  const total = num(b.total_amount ?? b.totalAmount ?? b.total, 0);
  return {
    cottage_id:   cottageId,
    check_in:     b.arrival,
    check_out:    b.departure,
    guests:       Math.max(1, num(b.people ?? b.guests ?? 1, 1)),
    guest_name:   String(b.guest_name ?? b.guestName ?? b.guest?.name ?? 'Guest').slice(0, 200),
    guest_email:  String(b.guest_email ?? b.guestEmail ?? b.guest?.email ?? 'noreply@forestretreat.lv'),
    guest_phone:  String(b.guest_phone ?? b.guestPhone ?? b.guest?.phone ?? ''),
    notes:        b.notes || null,
    status:       mapLodgifyStatus(b.status),
    base_price:   total,            // we don't get a breakdown; mirror total
    cleaning_fee: 0,
    service_fee:  0,
    total_price:  total,
    locale:       'lv',
    source:       'lodgify',
    lodgify_id:   String(b.id),
  };
}

// ----------------------------------------------------------
// INBOUND
// ----------------------------------------------------------

export async function runLodgifyInboundSync() {
  if (!isLodgifyConfigured()) {
    return { ok: false, error: 'lodgify_not_configured' };
  }
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'supabase_not_configured' };
  }

  const sb = getServerSupabase();
  const cottages = configuredCottages();
  if (cottages.length === 0) {
    return { ok: false, error: 'no_properties_mapped' };
  }

  let inserted = 0;
  let updated = 0;
  const errors = [];

  for (const { cottageId, propertyId } of cottages) {
    try {
      for await (const raw of iterateBookings({ propertyId, stayFilter: 'All' })) {
        const row = lodgifyToBookingRow(raw);
        if (!row) continue;

        // Upsert by lodgify_id. NULL is distinct in Postgres, so this
        // only collides with rows that already have the same lodgify_id.
        const { data, error } = await sb
          .from('bookings')
          .upsert(row, { onConflict: 'lodgify_id', ignoreDuplicates: false })
          .select('id, created_at')
          .single();

        if (error) {
          errors.push({ cottageId, lodgifyId: row.lodgify_id, error: error.message });
          continue;
        }
        // Heuristic: if created_at is within 5s of now, treat as a fresh insert.
        const ageMs = Date.now() - new Date(data.created_at).getTime();
        if (ageMs < 5000) inserted += 1; else updated += 1;
      }
    } catch (e) {
      errors.push({ cottageId, propertyId, error: String(e?.message || e) });
    }
  }

  return { ok: true, inserted, updated, errors, properties: cottages.length };
}

// ----------------------------------------------------------
// OUTBOUND  (called from refreshPaymentStatus once status=confirmed)
// ----------------------------------------------------------

export async function pushBookingToLodgify(booking) {
  if (!booking || booking.lodgify_id) return { ok: true, skipped: 'already_synced' };
  if (!isLodgifyConfigured()) return { ok: false, skipped: 'not_configured' };

  const propertyId = lodgifyPropertyIdFor(booking.cottage_id);
  if (!propertyId) return { ok: false, skipped: 'unknown_property' };

  // Lodgify v1 POST /reservation/booking payload — keep it conservative;
  // Lodgify ignores unknown fields. Real shape may need tweaking after the
  // first dry-run against the live API.
  const payload = {
    property_id:  Number(propertyId) || propertyId,
    arrival:      booking.check_in,
    departure:    booking.check_out,
    guest_name:   booking.guest_name,
    guest_email:  booking.guest_email,
    guest_phone:  booking.guest_phone,
    people:       booking.guests,
    total:        booking.total_price,
    status:       'Booked',
    source:       'Direct',
    currency_code:'EUR',
    notes:        `Forest Retreat #${booking.id?.slice(0, 8)}`,
  };

  try {
    const resp = await createReservation(payload);
    const lodgifyId = resp?.id ?? resp?.booking_id ?? resp?.bookingId;
    if (lodgifyId == null) {
      return { ok: false, error: 'no_id_in_response', response: resp };
    }

    const sb = getServerSupabase();
    await sb.from('bookings')
      .update({ lodgify_id: String(lodgifyId) })
      .eq('id', booking.id);

    return { ok: true, lodgify_id: String(lodgifyId) };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}
