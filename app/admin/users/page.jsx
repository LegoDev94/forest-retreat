import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '../../../lib/admin-auth';
import { getServerSupabase, isSupabaseConfigured } from '../../../lib/supabase/server';
import AdminShell from '../../../components/admin/AdminShell';
import UsersList from '../../../components/admin/UsersList';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Гости · Admin', robots: { index: false } };

async function loadUsers() {
  if (!isSupabaseConfigured()) return [];
  const sb = getServerSupabase();
  const [{ data: profiles }, { data: bookings }] = await Promise.all([
    sb.from('profiles').select('user_id, phone, full_name, email, created_at')
      .order('created_at', { ascending: false }),
    sb.from('bookings').select('id, user_id, cottage_id, check_in, check_out, status, payment_state, total_price, created_at')
      .not('user_id', 'is', null)
      .order('check_in', { ascending: false }),
  ]);

  const byUser = {};
  for (const b of bookings ?? []) {
    if (!b.user_id) continue;
    (byUser[b.user_id] ||= []).push(b);
  }

  return (profiles ?? []).map((p) => {
    const list = byUser[p.user_id] ?? [];
    const paid = list.filter((b) => b.payment_state === 'paid');
    const totalSpent = paid.reduce((s, b) => s + (b.total_price ?? 0), 0);
    const upcoming = list.filter((b) => b.status !== 'cancelled' && new Date(b.check_in) >= new Date()).length;
    return {
      ...p,
      bookings:    list,
      total:       list.length,
      paid_count:  paid.length,
      total_spent: totalSpent,
      upcoming,
      last_check_in: list[0]?.check_in || null,
    };
  });
}

export default async function UsersPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');
  const users = await loadUsers();
  return (
    <AdminShell>
      <header className="admin-header">
        <h1>Гости</h1>
        <p className="admin-sub">Все, кто хоть раз бронировал. Кликни на строку — посмотришь историю.</p>
      </header>
      <UsersList users={users} />
    </AdminShell>
  );
}
