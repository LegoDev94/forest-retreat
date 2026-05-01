import { redirect } from 'next/navigation';
import { getCurrentUser, getSessionSupabase } from '../../../lib/supabase/session';
import { getServerSupabase, isSupabaseConfigured } from '../../../lib/supabase/server';
import AccountShell from '../../../components/account/AccountShell';
import AccountBookings from '../../../components/account/AccountBookings';
import AccountCalendar from '../../../components/account/AccountCalendar';
import QuickContact from '../../../components/account/QuickContact';
import ChangePasswordForm from '../../../components/account/ChangePasswordForm';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false }, title: 'Личный кабинет' };

async function loadProfile(user) {
  try {
    const sb = await getSessionSupabase();
    if (!sb) return null;
    const { data } = await sb
      .from('profiles')
      .select('phone, full_name, email')
      .eq('user_id', user.id)
      .maybeSingle();
    return data || null;
  } catch (e) {
    console.error('account loadProfile error:', e?.message || e);
    return null;
  }
}

async function loadUserBookings(userId) {
  try {
    if (!isSupabaseConfigured()) return [];
    const admin = getServerSupabase();
    const { data, error } = await admin
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('check_in', { ascending: false });
    if (error) {
      console.error('account loadUserBookings error:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('account loadUserBookings exception:', e?.message || e);
    return [];
  }
}

export default async function AccountPage({ params, searchParams }) {
  const { locale } = await params;
  const sp = (await searchParams) || {};

  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/account/login`);

  const [profile, bookings] = await Promise.all([
    loadProfile(user),
    loadUserBookings(user.id),
  ]);

  const showWelcome = sp.welcome === '1';
  const contact = {
    whatsapp: process.env.HOST_WHATSAPP || '',
    phone:    process.env.HOST_PHONE    || '',
    email:    process.env.HOST_EMAIL    || '',
  };

  // Derive a fallback display name from auth metadata if profile row missing
  const displayProfile = profile || {
    phone:     user.user_metadata?.phone || '',
    full_name: user.user_metadata?.full_name || user.email || '',
    email:     user.email || '',
  };

  const firstRef = bookings?.[0]
    ? `FR-${bookings[0].id.replace(/-/g, '').slice(0, 8).toUpperCase()}`
    : '';

  return (
    <AccountShell locale={locale} profile={displayProfile}>
      {showWelcome && (
        <div className="account-banner">
          Добро пожаловать! Это твой личный кабинет — здесь все брони и календарь твоих заездов.
        </div>
      )}

      <section className="account-section">
        <h2>Календарь твоих заездов</h2>
        <AccountCalendar bookings={bookings} />
      </section>

      <section className="account-section">
        <h2>Мои брони</h2>
        <AccountBookings bookings={bookings} />
      </section>

      <section className="account-section">
        <h2>Связь с менеджером</h2>
        <p className="account-sub">Если что-то непонятно или нужно изменить бронь — пиши, мы быстро.</p>
        <QuickContact
          whatsapp={contact.whatsapp}
          phone={contact.phone}
          email={contact.email}
          bookingRef={firstRef}
        />
        {!contact.whatsapp && !contact.phone && !contact.email && (
          <p className="account-sub" style={{ marginTop: 12 }}>
            Контакты пока не настроены. Установи <code>HOST_WHATSAPP</code>, <code>HOST_PHONE</code> и <code>HOST_EMAIL</code> в Vercel env vars.
          </p>
        )}
      </section>

      <section className="account-section">
        <h2>Сменить пароль</h2>
        <p className="account-sub">Текущий мы создали автоматически — поменяй на свой.</p>
        <ChangePasswordForm />
      </section>
    </AccountShell>
  );
}
