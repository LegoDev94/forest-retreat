import { redirect } from 'next/navigation';
import { getCurrentUser, getSessionSupabase } from '../../../lib/supabase/session';
import { getServerSupabase } from '../../../lib/supabase/server';
import AccountShell from '../../../components/account/AccountShell';
import AccountBookings from '../../../components/account/AccountBookings';
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

  return (
    <AccountShell locale={locale} profile={profile}>
      {showWelcome && (
        <div className="account-banner">
          Добро пожаловать! Это твой личный кабинет — здесь все брони и календарь твоих заездов.
        </div>
      )}
      <section className="account-section">
        <h2>Мои брони</h2>
        <AccountBookings bookings={bookings ?? []} />
      </section>
      <section className="account-section">
        <h2>Сменить пароль</h2>
        <p className="account-sub">Текущий мы создали автоматически — поменяй на свой.</p>
        <ChangePasswordForm />
      </section>
    </AccountShell>
  );
}
