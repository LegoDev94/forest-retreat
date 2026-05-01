import { redirect } from 'next/navigation';
import { getCurrentUser, getSessionSupabase } from '../../../lib/supabase/session';
import { getServerSupabase } from '../../../lib/supabase/server';
import AccountShell from '../../../components/account/AccountShell';
import AccountBookings from '../../../components/account/AccountBookings';
import AccountCalendar from '../../../components/account/AccountCalendar';
import QuickContact from '../../../components/account/QuickContact';
import ChangePasswordForm from '../../../components/account/ChangePasswordForm';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false }, title: 'Личный кабинет' };

export default async function AccountPage({ params, searchParams }) {
  const { locale } = await params;
  const sp = (await searchParams) || {};
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/account/login`);

  const sb = await getSessionSupabase();
  const admin = getServerSupabase();
  const [{ data: profile }, { data: bookings }] = await Promise.all([
    sb.from('profiles').select('phone, full_name, email').eq('user_id', user.id).maybeSingle(),
    admin
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('check_in', { ascending: false }),
  ]);

  const showWelcome = sp.welcome === '1';
  const contactConfig = {
    whatsapp: process.env.HOST_WHATSAPP || '',
    phone:    process.env.HOST_PHONE    || '',
    email:    process.env.HOST_EMAIL    || '',
  };

  return (
    <AccountShell locale={locale} profile={profile}>
      {showWelcome && (
        <div className="account-banner">
          Добро пожаловать! Это твой личный кабинет — здесь все брони и календарь твоих заездов.
        </div>
      )}

      <section className="account-section">
        <h2>Календарь твоих заездов</h2>
        <AccountCalendar bookings={bookings ?? []} />
      </section>

      <section className="account-section">
        <h2>Мои брони</h2>
        <AccountBookings bookings={bookings ?? []} />
      </section>

      <section className="account-section">
        <h2>Связь с менеджером</h2>
        <p className="account-sub">Если что-то непонятно или нужно изменить бронь — пиши, мы быстро.</p>
        <QuickContact
          whatsapp={contactConfig.whatsapp}
          phone={contactConfig.phone}
          email={contactConfig.email}
          ref={bookings?.[0] ? `FR-${bookings[0].id.replace(/-/g,'').slice(0,8).toUpperCase()}` : ''}
        />
        {!contactConfig.whatsapp && !contactConfig.phone && !contactConfig.email && (
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
