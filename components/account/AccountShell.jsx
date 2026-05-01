'use client';
import { useTransition } from 'react';
import { logoutAction } from '../../app/actions/account';

export default function AccountShell({ locale, profile, children }) {
  const [pending, startTransition] = useTransition();

  const onLogout = () => {
    const fd = new FormData();
    fd.append('locale', locale);
    startTransition(() => logoutAction(null, fd));
  };

  return (
    <main className="account-screen account-screen-wide">
      <div className="account-shell">
        <header className="account-header">
          <div>
            <span className="account-eyebrow">Forest Retreat · кабинет</span>
            <h1>Привет, {profile?.full_name || profile?.phone || 'гость'}</h1>
            {profile?.phone && <p className="account-sub">{profile.phone}</p>}
          </div>
          <button onClick={onLogout} className="btn-link" disabled={pending}>
            {pending ? 'Выходим…' : 'Выйти'}
          </button>
        </header>
        {children}
      </div>
    </main>
  );
}
