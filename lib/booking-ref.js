// Human-friendly booking reference derived from the UUID id.
// Shape: FR-A1B2C3D4 (8 hex chars uppercase).
// Deterministic — no migration needed, frontend-derivable too.
export function bookingRef(id) {
  if (!id) return '';
  const hex = String(id).replace(/-/g, '').slice(0, 8).toUpperCase();
  return `FR-${hex}`;
}

// EveryPay order_reference (already in use). Keep the lowercase variant
// for compatibility with existing rows.
export function paymentOrderRef(id) {
  return `bk-${String(id).slice(0, 18)}`;
}
