import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdminAuthenticated } from '../../lib/admin-auth';
import { getServerSupabase, isSupabaseConfigured } from '../../lib/supabase/server';
import AdminShell from '../../components/admin/AdminShell';
import StatusBadge from '../../components/admin/StatusBadge';
import LiveVisitors from '../../components/admin/LiveVisitors';

export const dynamic = 'force-dynamic';

const fmt = (s) => new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
const eur = (n) => `${n} €`;

async function loadStats() {
  if (!isSupabaseConfigured()) return null;
  const sb = getServerSupabase();
  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

  const [{ count: pendingCount }, { count: confirmedCount }, { data: upcoming }, { data: revenueRows }] = await Promise.all([
    sb.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    sb.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed').gte('check_in', today),
    sb.from('bookings').select('id, cottage_id, check_in, check_out, guests, guest_name, status, total_price')
      .gte('check_in', today).lt('check_in', in30)
      .in('status', ['pending', 'confirmed'])
      .order('check_in', { ascending: true })
      .limit(10),
    sb.from('bookings').select('total_price')
      .in('status', ['pending', 'confirmed', 'completed'])
      .gte('check_in', new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)),
  ]);

  const revenue30d = (revenueRows ?? []).reduce((s, r) => s + (r.total_price ?? 0), 0);
  return { pendingCount, confirmedCount, upcoming: upcoming ?? [], revenue30d };
}

export default async function DashboardPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');
  const stats = await loadStats();

  return (
    <AdminShell>
      <header className="admin-header">
        <h1>Дашборд</h1>
        <p className="admin-sub">Обзор бронирований за последние 30 дней.</p>
      </header>

      {!stats ? (
        <div className="admin-warn">Supabase env vars не настроены.</div>
      ) : (
        <>
          <div className="admin-stats">
            <div className="admin-stat">
              <div className="admin-stat-label">Ожидают подтверждения</div>
              <div className="admin-stat-value">{stats.pendingCount ?? 0}</div>
            </div>
            <div className="admin-stat">
              <div className="admin-stat-label">Подтверждены (предстоящие)</div>
              <div className="admin-stat-value">{stats.confirmedCount ?? 0}</div>
            </div>
            <div className="admin-stat">
              <div className="admin-stat-label">Выручка · 30 дней</div>
              <div className="admin-stat-value">{eur(stats.revenue30d)}</div>
            </div>
            <LiveVisitors />
          </div>

          <section className="admin-section">
            <div className="admin-section-head">
              <h2>Ближайшие заезды</h2>
              <Link href="/admin/bookings" className="admin-link">Все брони →</Link>
            </div>
            {stats.upcoming.length === 0 ? (
              <div className="admin-empty">Пока никого. Тишина.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Дом</th><th>Заезд</th><th>Выезд</th><th>Гость</th><th>Гостей</th><th>Сумма</th><th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.upcoming.map((b) => (
                    <tr key={b.id}>
                      <td><span className="admin-pill">{b.cottage_id}</span></td>
                      <td>{fmt(b.check_in)}</td>
                      <td>{fmt(b.check_out)}</td>
                      <td>{b.guest_name}</td>
                      <td>{b.guests}</td>
                      <td>{eur(b.total_price)}</td>
                      <td><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </AdminShell>
  );
}
