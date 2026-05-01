import LoginForm from '../../../../components/account/LoginForm';
import { getCurrentUser } from '../../../../lib/supabase/session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false }, title: 'Вход' };

export default async function LoginPage({ params, searchParams }) {
  const { locale } = await params;
  const sp = (await searchParams) || {};
  const user = await getCurrentUser();
  if (user) redirect(`/${locale}/account`);
  return (
    <main className="account-screen">
      <div className="account-card">
        <h1>Вход в кабинет</h1>
        <p className="account-sub">Логин — твой номер телефона. Пароль мы выслали при бронировании.</p>
        <LoginForm locale={locale} prefillPhone={String(sp.phone || '')} />
      </div>
    </main>
  );
}
