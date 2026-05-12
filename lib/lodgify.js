// Lodgify Public API client.
// Docs: https://docs.lodgify.com/reference
//
// Auth: X-ApiKey header. Rate limits: v1 = 600/min, v2 = 750/min.
//
// Property ID mapping is held here (server-only) so that lib/data.js
// (which is imported by static pages) stays free of secrets.

const BASE = 'https://api.lodgify.com';

const PROPERTY_MAP = {
  dragon: process.env.LODGIFY_PROPERTY_DRAGON,
  viking: process.env.LODGIFY_PROPERTY_VIKING,
  farm:   process.env.LODGIFY_PROPERTY_FARM,
  black:  process.env.LODGIFY_PROPERTY_BLACK,
};

export function isLodgifyConfigured() {
  return Boolean(process.env.LODGIFY_API_KEY);
}

export function lodgifyPropertyIdFor(cottageId) {
  return PROPERTY_MAP[cottageId] || null;
}

export function cottageIdForLodgify(propertyId) {
  if (propertyId == null) return null;
  const target = String(propertyId);
  for (const [cottageId, id] of Object.entries(PROPERTY_MAP)) {
    if (id && String(id) === target) return cottageId;
  }
  return null;
}

export function configuredCottages() {
  return Object.entries(PROPERTY_MAP)
    .filter(([, id]) => Boolean(id))
    .map(([cottageId, propertyId]) => ({ cottageId, propertyId }));
}

async function call(path, { method = 'GET', body, query } = {}) {
  const key = process.env.LODGIFY_API_KEY;
  if (!key) throw new Error('LODGIFY_API_KEY not set');

  const url = new URL(BASE + path);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      'X-ApiKey': key,
      'Accept': 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText;
    const err = new Error(`Lodgify ${method} ${path} → ${res.status} ${msg}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

// ---- Reservations / bookings ----

// GET /v2/reservations/bookings
// stayFilter: Upcoming | Current | Historic | All
export async function listBookings({
  propertyId,
  stayFilter = 'All',
  updatedSince,
  size = 50,
  page = 1,
} = {}) {
  return call('/v2/reservations/bookings', {
    query: {
      propertyId,
      stayFilter,
      updatedSince,
      size,
      page,
      includeCount: true,
    },
  });
}

// Walks all pages and yields raw items. Stops at empty page.
export async function* iterateBookings(opts = {}) {
  let page = 1;
  const size = opts.size || 50;
  while (true) {
    const resp = await listBookings({ ...opts, size, page });
    const items = resp?.items || resp?.data || [];
    if (items.length === 0) return;
    for (const it of items) yield it;
    if (items.length < size) return;
    page += 1;
    if (page > 200) return; // hard safety cap
  }
}

// POST /v1/reservation/booking
// Body shape per Lodgify docs:
// https://docs.lodgify.com/reference/post_v1-reservation-booking
export async function createReservation(payload) {
  return call('/v1/reservation/booking', {
    method: 'POST',
    body: payload,
  });
}

// GET /v2/availability/{propertyId}
export async function getAvailability(propertyId, { start, end } = {}) {
  return call(`/v2/availability/${propertyId}`, {
    query: { start, end },
  });
}
