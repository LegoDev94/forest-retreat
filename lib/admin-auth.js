// Simple cookie-based admin auth.
// Cookie stores the literal ADMIN_SESSION_SECRET (httpOnly). Browser never sees env.
// Stateless — middleware/layout just compares cookie value against env.

import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'fr_admin_session';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

function adminPassword() { return process.env.ADMIN_PASSWORD; }
function sessionSecret() { return process.env.ADMIN_SESSION_SECRET; }

export function isAdminConfigured() {
  return Boolean(adminPassword() && sessionSecret());
}

// Server-only — call from server components / actions
export async function isAdminAuthenticated() {
  const secret = sessionSecret();
  if (!secret) return false;
  const c = await cookies();
  return c.get(ADMIN_COOKIE)?.value === secret;
}

// Used inside Server Actions: validates password and writes cookie
export async function loginAdmin(password) {
  if (!isAdminConfigured()) {
    return { ok: false, reason: 'not_configured' };
  }
  if (password !== adminPassword()) {
    return { ok: false, reason: 'invalid_password' };
  }
  const c = await cookies();
  c.set(ADMIN_COOKIE, sessionSecret(), COOKIE_OPTIONS);
  return { ok: true };
}

export async function logoutAdmin() {
  const c = await cookies();
  c.delete(ADMIN_COOKIE);
}
