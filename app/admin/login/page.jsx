import LoginForm from '../../../components/admin/LoginForm';
import { isAdminAuthenticated, isAdminConfigured } from '../../../lib/admin-auth';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Admin login', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await isAdminAuthenticated()) {
    redirect('/admin');
  }
  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-mark">
          <svg viewBox="0 0 40 40" width="44" height="44" aria-hidden="true">
            <circle cx="20" cy="20" r="19" fill="#c9a86a" />
            <g fill="#0a0e0c">
              <path d="M14 11l-3 6h2l-2 4h6l-2-4h2z" />
              <path d="M26 14l-2.5 5h1.5l-1.5 3h5l-1.5-3h1.5z" />
            </g>
          </svg>
        </div>
        <h1>Forest Retreat — Админка</h1>
        <p className="admin-login-sub">Войди, чтобы управлять бронированиями.</p>
        {!isAdminConfigured() && (
          <div className="admin-warn">
            Не настроены переменные <code>ADMIN_PASSWORD</code> и <code>ADMIN_SESSION_SECRET</code>.
            Добавь их в Vercel env vars и redeploy.
          </div>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
