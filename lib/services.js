// Pricing + helpers for ancillary services (deer-park ticket, picnic kit,
// tent, jacuzzi, sauna). Single source of truth: the server-side quote uses
// these same numbers, so the price the customer pays cannot be tampered with.

export const SERVICE_KINDS = ['deer_ticket', 'picnic_kit', 'tent', 'jacuzzi', 'sauna'];

// Hard limits keep abuse off the form
export const LIMITS = {
  deer_ticket: { qtyMin: 1, qtyMax: 50 },
  picnic_kit:  { qtyMin: 1, qtyMax: 5, hoursMin: 1, hoursMax: 12 }, // hours OR full day
  tent:        { qtyMin: 1, qtyMax: 5, daysMin: 1, daysMax: 14 },
  jacuzzi:     { qtyMin: 1, qtyMax: 2 }, // sessions (3h each)
  sauna:       { qtyMin: 1, qtyMax: 2 }, // sessions (3h each)
};

// EUR — prices the customer sees
export const PRICES = {
  deer_ticket:     10, // per person · day
  picnic_kit_hour: 10, // per hour
  picnic_kit_day:  50, // per full day (cap)
  tent_day:        20, // per night
  jacuzzi_session: 70, // 3h
  sauna_session:   30, // 3h
};

// Compute the line total in EUR for one service line.
// `mode` for picnic_kit: 'hour' | 'day'.
// `hours` for picnic_kit hourly.
// `quantity` is units of the chosen mode (people, sessions, kits, etc.)
export function quoteService({ kind, quantity = 1, mode = 'hour', hours = 1, days = 1 }) {
  const q = Number(quantity);
  if (!Number.isFinite(q) || q < 1) return 0;

  switch (kind) {
    case 'deer_ticket':
      return PRICES.deer_ticket * q;

    case 'picnic_kit': {
      const hrs = Math.min(LIMITS.picnic_kit.hoursMax, Math.max(1, Number(hours) || 1));
      const unit = mode === 'day' ? PRICES.picnic_kit_day : PRICES.picnic_kit_hour * hrs;
      return unit * q;
    }

    case 'tent': {
      const d = Math.min(LIMITS.tent.daysMax, Math.max(1, Number(days) || 1));
      return PRICES.tent_day * d * q;
    }

    case 'jacuzzi':
      return PRICES.jacuzzi_session * q;

    case 'sauna':
      return PRICES.sauna_session * q;

    default:
      return 0;
  }
}

// Human-readable summary line for the order, e.g. "Tent · 2 nights × 1"
// Pure i18n strings live in dict.js; this is only the structural bit.
export function summarize({ kind, quantity = 1, mode = 'hour', hours = 1, days = 1 }) {
  switch (kind) {
    case 'deer_ticket':  return { kind, qty: quantity, label: 'deer_ticket' };
    case 'picnic_kit':   return { kind, qty: quantity, mode, hours, label: mode === 'day' ? 'picnic_kit_day' : 'picnic_kit_hour' };
    case 'tent':         return { kind, qty: quantity, days, label: 'tent' };
    case 'jacuzzi':      return { kind, qty: quantity, label: 'jacuzzi' };
    case 'sauna':        return { kind, qty: quantity, label: 'sauna' };
    default:             return { kind: 'unknown' };
  }
}
