// Date utilities for availability + price calc.

const DAY_MS = 24 * 60 * 60 * 1000;

export function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function fromISO(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(a, b) {
  return Math.round((fromISO(b) - fromISO(a)) / DAY_MS);
}

// Expand list of {check_in, check_out} ranges into a Set of disabled ISO date strings.
// Half-open ranges: check_out date itself is NOT booked.
export function rangesToDisabledSet(ranges) {
  const set = new Set();
  for (const r of ranges) {
    const start = fromISO(r.check_in);
    const end = fromISO(r.check_out);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      set.add(toISO(d));
    }
  }
  return set;
}

// Check if a candidate range [checkIn, checkOut) overlaps any disabled day.
export function rangeIsBookable(checkIn, checkOut, disabledSet) {
  const start = fromISO(checkIn);
  const end = fromISO(checkOut);
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    if (disabledSet.has(toISO(d))) return false;
  }
  return true;
}

export function calcQuote({ pricePerNight, checkIn, checkOut, cleaningFee = 30 }) {
  const nights = Math.max(0, daysBetween(checkIn, checkOut));
  const base = pricePerNight * nights;
  const service = Math.round(base * 0.06);
  const total = nights > 0 ? base + cleaningFee + service : 0;
  return { nights, base, service, cleaning: cleaningFee, total };
}
