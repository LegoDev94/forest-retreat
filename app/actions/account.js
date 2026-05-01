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
export async function upsertGuestAccount({ phone, fullName, email }) {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;

  const admin = getServerSupabase();
  const internalEmail = email || syntheticEmailForPhone(normalized);

  // Look for existing profile
  const { data: existing } = await admin
    .from('profiles')
    .select('user_id')
    .eq('phone', normalized)
    .maybeSingle();

  if (existing?.user_id) {
    return { user_id: existing.user_id, isNew: false, tempPassword: null, email: internalEmail, phone: normalized };
  }

  // Create new auth user
  const password = generatePassword(10);
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: internalEmail,
    password,
    email_confirm: true,
    user_metadata: { phone: normalized, full_name: fullName },
  });
  if (createErr) {
    console.error('createUser error:', createErr);
    // Edge case: user with this email might already exist (rare race)
    if (createErr.message?.toLowerCase().includes('already')) {
      const { data: list } = await admin.auth.admin.listUsers({ filter: `email.eq.${internalEmail}` });
      const u = list?.users?.[0];
      if (u) return { user_id: u.id, isNew: false, tempPassword: null, email: internalEmail, phone: normalized };
    }
    return null;
  }

  const userId = created.user.id;
  await admin.from('profiles').insert({
    user_id:   userId,
    phone:     normalized,
    full_name: fullName,
    email:     internalEmail,
  });

  return { user_id: userId, isNew: true, tempPassword: password, email: internalEmail, phone: normalized };
}
