'use server';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSupabase, isSupabaseConfigured } from '../../lib/supabase/server';
import {
  isAdminAuthenticated, loginAdmin, logoutAdmin,
} from '../../lib/admin-auth';
import { runLodgifyInboundSync } from '../../lib/lodgify-sync';
import {
  createOneoffPayment, isEverypayConfigured, isEverypayDemoMode,
} from '../../lib/everypay';

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login');
  }
}

// ============================================================
// AUTH
// ============================================================
export async function loginAction(_prevState, formData) {
  const password = String(formData.get('password') || '');
  const result = await loginAdmin(password);
  if (!result.ok) {
    return {
      error: result.reason === 'not_configured'
        ? 'Admin не настроен. Установите ADMIN_PASSWORD и ADMIN_SESSION_SECRET в Vercel env vars.'
        : 'Неверный пароль.',
    };
  }
  redirect('/admin');
}

export async function logoutAction() {
  await logoutAdmin();
  redirect('/admin/login');
}

// ============================================================
// BOOKINGS
// ============================================================
export async function setBookingStatus(id, status) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { ok: false, error: 'DB not configured' };
  const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!allowed.includes(status)) return { ok: false, error: 'Invalid status' };
  const sb = getServerSupabase();
  const { error } = await sb.from('bookings').update({ status }).eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/bookings');
  revalidatePath('/admin');
  revalidatePath('/admin/calendar');
  return { ok: true };
}

export async function deleteBooking(id) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { ok: false, error: 'DB not configured' };
  const sb = getServerSupabase();
  const { error } = await sb.from('bookings').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/bookings');
  revalidatePath('/admin');
  revalidatePath('/admin/calendar');
  return { ok: true };
}

// ============================================================
// DATE BLOCKS / OVERRIDES
// ============================================================
export async function addDateBlock(_prevState, formData) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'DB not configured' };
  const cottage_id = String(formData.get('cottage_id') || '');
  const from_date  = String(formData.get('from_date') || '');
  const to_date    = String(formData.get('to_date')   || '');
  const note       = String(formData.get('note') || '') || null;

  if (!cottage_id || !from_date || !to_date) return { error: 'Заполни все поля' };
  if (to_date < from_date) return { error: 'Конечная дата должна быть позже' };

  // Insert one row per blocked date
  const dates = [];
  const d = new Date(from_date);
  const end = new Date(to_date);
  while (d <= end) {
    dates.push(new Date(d).toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }

  const sb = getServerSupabase();
  const rows = dates.map((date) => ({ cottage_id, date, blocked: true, note }));
  const { error } = await sb
    .from('date_overrides')
    .upsert(rows, { onConflict: 'cottage_id,date' });
  if (error) return { error: error.message };

  revalidatePath('/admin/blocks');
  revalidatePath('/admin/calendar');
  return { ok: true, count: dates.length };
}

export async function removeDateBlock(id) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { ok: false, error: 'DB not configured' };
  const sb = getServerSupabase();
  const { error } = await sb.from('date_overrides').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/blocks');
  revalidatePath('/admin/calendar');
  return { ok: true };
}

// ============================================================
// PRICING
// ============================================================
export async function updateCottagePrice(_prevState, formData) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'DB not configured' };
  const id = String(formData.get('id') || '');
  const price = parseInt(formData.get('price') || '0', 10);
  if (!id) return { error: 'Дом не указан' };
  if (!Number.isFinite(price) || price < 1 || price > 9999) return { error: 'Цена должна быть 1–9999' };
  const sb = getServerSupabase();
  const { error } = await sb.from('cottages').update({ price_per_night: price }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/pricing');
  revalidatePath('/admin');
  return { ok: true };
}

export async function addPriceOverride(_prevState, formData) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'DB not configured' };
  const cottage_id = String(formData.get('cottage_id') || '');
  const from_date  = String(formData.get('from_date') || '');
  const to_date    = String(formData.get('to_date') || '');
  const price      = parseInt(formData.get('price') || '0', 10);
  const note       = String(formData.get('note') || '') || null;

  if (!cottage_id || !from_date || !to_date) return { error: 'Заполни все поля' };
  if (to_date < from_date) return { error: 'Конечная дата должна быть позже' };
  if (!Number.isFinite(price) || price < 1 || price > 9999) return { error: 'Цена должна быть 1–9999' };

  const dates = [];
  const d = new Date(from_date);
  const end = new Date(to_date);
  while (d <= end) {
    dates.push(new Date(d).toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }

  const sb = getServerSupabase();
  const rows = dates.map((date) => ({
    cottage_id, date, blocked: false, price_override: price, note,
  }));
  const { error } = await sb
    .from('date_overrides')
    .upsert(rows, { onConflict: 'cottage_id,date' });
  if (error) return { error: error.message };

  revalidatePath('/admin/pricing');
  revalidatePath('/admin/calendar');
  return { ok: true, count: dates.length };
}

export async function removePriceOverride(id) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { ok: false, error: 'DB not configured' };
  const sb = getServerSupabase();
  const { error } = await sb.from('date_overrides').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/pricing');
  revalidatePath('/admin/calendar');
  return { ok: true };
}

// ============================================================
// EVERYPAY TEST — fires a €1 payment to verify credentials
// (used after switching demo → production env)
// ============================================================
export async function createTestPayment() {
  await requireAdmin();
  if (!isEverypayConfigured()) {
    return { ok: false, error: 'EveryPay env vars не настроены' };
  }

  const h = await headers();
  const proto = h.get('x-forwarded-proto') || 'https';
  const host  = h.get('x-forwarded-host') || h.get('host');
  const origin = `${proto}://${host}`;

  try {
    const pay = await createOneoffPayment({
      amount:         1,
      orderReference: `test-${Date.now()}`,
      customerUrl:    `${origin}/admin?payment_test=done`,
      email:          'hello@forestretreat.lv',
      locale:         'en',
      description:    'EveryPay test payment €1',
    });
    return {
      ok: true,
      pay_url:           pay.payment_link,
      payment_reference: pay.payment_reference,
      mode:              isEverypayDemoMode() ? 'demo' : 'production',
    };
  } catch (err) {
    return { ok: false, error: String(err?.message || err) };
  }
}

// ============================================================
// LODGIFY SYNC (admin-triggered, same logic as Vercel cron)
// ============================================================
export async function triggerLodgifySync() {
  await requireAdmin();
  const started = Date.now();
  const result = await runLodgifyInboundSync();
  revalidatePath('/admin/bookings');
  revalidatePath('/admin/calendar');
  revalidatePath('/admin');
  return { ...result, ms: Date.now() - started };
}
