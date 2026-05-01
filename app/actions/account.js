'use server';
// Account actions: login by phone, logout, change password.
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getServerSupabase } from '../../lib/supabase/server';
import { getSessionSupabase, getCurrentUser } from '../../lib/supabase/session';
import { normalizePhone, syntheticEmailForPhone, generatePassword } from '../../lib/phone';

// ------------------------------------------------------------
// LOGIN — phone + password
// ------------------------------------------------------------
export async function loginAction(_prevState, formData) {
  const phoneRaw = String(formData.get('phone') || '');
  const password = String(formData.get('password') || '');
  const locale   = String(formData.get('locale') || 'ru');

  const phone = normalizePhone(phoneRaw);
  if (!phone || !password) {
    return { error: 'Введи номер телефона и пароль.' };
  }

  // Find email by phone via service role (bypass RLS)
  const admin = getServerSupabase();
  const { data: emailRow, error: lookupErr } = await admin.rpc('email_for_phone', { p_phone: phone });
  if (lookupErr) return { error: lookupErr.message };
  const email = emailRow || syntheticEmailForPhone(phone);

  // Now do a real signIn with cookie session
  const sb = await getSessionSupabase();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: 'Неверный номер или пароль.' };
  }
  redirect(`/${locale}/account`);
}

// ------------------------------------------------------------
// LOGOUT
// ------------------------------------------------------------
export async function logoutAction(_prevState, formData) {
  const locale = String(formData?.get?.('locale') || 'ru');
  const sb = await getSessionSupabase();
  await sb.auth.signOut();
  redirect(`/${locale}`);
}

// ------------------------------------------------------------
// CHANGE PASSWORD
// ------------------------------------------------------------
export async function changePasswordAction(_prevState, formData) {
  const next = String(formData.get('password') || '');
  if (next.length < 6) return { error: 'Минимум 6 символов.' };
  const sb = await getSessionSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { error: 'Сначала войди.' };
  const { error } = await sb.auth.updateUser({ password: next });
  if (error) return { error: error.message };
  revalidatePath('/account');
  return { ok: true };
}

// ------------------------------------------------------------
// Used by booking action: ensure user exists, return email + isNew + tempPassword
// ------------------------------------------------------------
async function findUserByEmail(admin, email) {
  // Paginate listUsers (Supabase Admin API has no direct email lookup)
  for (let page = 1; page <= 5; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data?.users?.length) return null;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (hit) return hit;
    if (data.users.length < 200) return null;
  }
  return null;
}

async function upsertProfileRow(admin, { userId, phone, fullName, email }) {
  try {
    await admin.from('profiles').upsert(
      { user_id: userId, phone, full_name: fullName, email },
      { onConflict: 'user_id' },
    );
  } catch (e) {
    console.error('upsertProfileRow error:', e?.message || e);
  }
}

export async function upsertGuestAccount({ phone, fullName, email }) {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;

  const admin = getServerSupabase();
  const internalEmail = email || syntheticEmailForPhone(normalized);

  // 1) Look for existing profile by phone
  const { data: existingProfile } = await admin
    .from('profiles')
    .select('user_id')
    .eq('phone', normalized)
    .maybeSingle();

  if (existingProfile?.user_id) {
    return { user_id: existingProfile.user_id, isNew: false, tempPassword: null, email: internalEmail, phone: normalized };
  }

  // 2) No profile — try to create the auth user
  const password = generatePassword(10);
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: internalEmail,
    password,
    email_confirm: true,
    user_metadata: { phone: normalized, full_name: fullName },
  });

  if (!createErr && created?.user?.id) {
    await upsertProfileRow(admin, { userId: created.user.id, phone: normalized, fullName, email: internalEmail });
    return { user_id: created.user.id, isNew: true, tempPassword: password, email: internalEmail, phone: normalized };
  }

  // 3) Auth user already existed (orphaned — no profile row). Recover by finding it
  //    and backfilling the profile so future lookups find it via phone.
  console.error('createUser error:', createErr?.message || createErr);
  const orphan = await findUserByEmail(admin, internalEmail);
  if (orphan) {
    await upsertProfileRow(admin, { userId: orphan.id, phone: normalized, fullName, email: internalEmail });
    return { user_id: orphan.id, isNew: false, tempPassword: null, email: internalEmail, phone: normalized };
  }

  return null;
}
