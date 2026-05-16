// Client-side analytics helpers. Safe no-ops when gtag isn't loaded
// (e.g. during SSR or before consent banner is dismissed and gtag.js fetched).

const isClient = () => typeof window !== 'undefined';
const hasGtag  = () => isClient() && typeof window.gtag === 'function';

export function track(event, params = {}) {
  if (!hasGtag()) return;
  window.gtag('event', event, params);
}

// Hash an email with SHA-256 for Google Ads Enhanced Conversions.
// Returns lowercase hex string, or null if Web Crypto unavailable.
export async function hashEmail(email) {
  if (!isClient() || !email || !window.crypto?.subtle) return null;
  const normalized = String(email).trim().toLowerCase();
  const buf = new TextEncoder().encode(normalized);
  const digest = await window.crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function trackViewItem(cottage, locale) {
  if (!cottage) return;
  track('view_item', {
    currency: 'EUR',
    value: cottage.pricePerNight,
    items: [{
      item_id: cottage.id,
      item_name: cottage.name?.[locale] || cottage.name?.en || cottage.id,
      item_category: 'cottage',
      price: cottage.pricePerNight,
      quantity: 1,
    }],
  });
}

export function trackBeginCheckout({ cottage, nights, total, locale }) {
  if (!cottage) return;
  track('begin_checkout', {
    currency: 'EUR',
    value: total,
    items: [{
      item_id: cottage.id,
      item_name: cottage.name?.[locale] || cottage.name?.en || cottage.id,
      item_category: 'cottage',
      price: cottage.pricePerNight,
      quantity: Math.max(1, nights || 1),
    }],
  });
}

export async function trackGenerateLead({ booking, email }) {
  if (!booking) return;
  const params = {
    currency: 'EUR',
    value: booking.total_price ?? booking.totalPrice ?? 0,
    transaction_id: booking.id,
  };
  const hashed = await hashEmail(email);
  if (hashed) params.user_data = { sha256_email_address: hashed };
  track('generate_lead', params);
}

// Service-specific helpers — addons (deer ticket, picnic, tent, jacuzzi, sauna)
const SERVICE_CATEGORY = {
  deer_ticket: 'deer_park',
  picnic_kit:  'picnic',
  tent:        'tent',
  jacuzzi:     'spa',
  sauna:       'spa',
};

export function trackViewService(kind) {
  if (!kind) return;
  track('view_item', {
    currency: 'EUR',
    items: [{
      item_id: kind,
      item_name: kind,
      item_category: 'service',
      item_category2: SERVICE_CATEGORY[kind] || 'service',
      quantity: 1,
    }],
  });
}

export function trackBeginCheckoutService({ kind, total }) {
  if (!kind) return;
  track('begin_checkout', {
    currency: 'EUR',
    value: Number(total) || 0,
    items: [{
      item_id: kind,
      item_name: kind,
      item_category: 'service',
      item_category2: SERVICE_CATEGORY[kind] || 'service',
      price: Number(total) || 0,
      quantity: 1,
    }],
  });
}

export async function trackPurchase({ booking, email }) {
  if (!booking) return;
  const value = Number(booking.total_price ?? booking.totalPrice ?? 0);
  // Service bookings carry `service_kind`; cottage bookings carry `cottage_id`.
  const isService = Boolean(booking.service_kind);
  const itemId    = isService ? booking.service_kind : (booking.cottage_id || booking.cottageId);
  const category  = isService ? 'service' : 'cottage';
  const params = {
    currency: 'EUR',
    value,
    transaction_id: booking.id,
    items: [{
      item_id:        itemId,
      item_name:      itemId,
      item_category:  category,
      item_category2: isService ? (SERVICE_CATEGORY[booking.service_kind] || 'service') : 'cottage',
      price:          value,
      quantity:       1,
    }],
  };
  const hashed = await hashEmail(email);
  if (hashed) params.user_data = { sha256_email_address: hashed };
  track('purchase', params);

  // Optional Google Ads conversion (if AW- + label configured)
  const adsId = process.env.NEXT_PUBLIC_GADS_ID;
  const label = process.env.NEXT_PUBLIC_GADS_PURCHASE_LABEL;
  if (hasGtag() && adsId && label) {
    window.gtag('event', 'conversion', {
      send_to: `${adsId}/${label}`,
      value,
      currency: 'EUR',
      transaction_id: booking.id,
    });
  }
}
