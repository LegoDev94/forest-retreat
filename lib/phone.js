// Phone normalization for use as login identifier.
// Strips formatting; ensures leading + or country code.

export function normalizePhone(raw) {
  if (!raw) return '';
  const cleaned = String(raw).trim().replace(/[^\d+]/g, '');
  if (!cleaned) return '';
  // If already starts with + → keep digits after
  if (cleaned.startsWith('+')) {
    const digits = cleaned.slice(1).replace(/\D/g, '');
    return digits ? `+${digits}` : '';
  }
  // Latvian no-prefix → assume Latvia (8 digits)
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length === 8) return `+371${digits}`;
  return `+${digits}`;
}

// Generate a deterministic-ish but secure email tied to a phone number.
// We use this as the *internal* Supabase Auth email — the user logs in by
// phone, but Supabase needs an email to identify the account.
export function syntheticEmailForPhone(phone) {
  const safe = phone.replace(/[^\d]/g, '');
  return `phone+${safe}@account.forestretreat.lv`;
}

export function generatePassword(len = 10) {
  const alphabet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < len; i++) out += alphabet[bytes[i] % alphabet.length];
  } else {
    for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}
