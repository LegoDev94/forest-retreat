import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '../../../lib/admin-auth';
import { getServerSupabase, isSupabaseConfigured } from '../../../lib/supabase/server';
import AdminShell from '../../../components/admin/AdminShell';
import BookingsTable from '../../../components/admin/BookingsTable';

export const dynamic = 'force-dynamic';

async function loadBookings({ status, cottage }) {
  if (!isSupabaseConfigured()) return [];
  const sb = getServerSupabase();
  let q = sb.from('bookings').select('*').order('created_at', { ascending: false });
  if (status && status !== 'all') q = q.eq('status', status);
  if (cottage && cottage !== 'all') q = q.eq('cottage_id', cottage);
  const { data, error } = await q;
  if (error) {
    console.error('bookings load:', error);
    return [];
  }
  return data ?? [];
}

export default async function BookingsPage({ searchParams }) {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');
  const params = (await searchParams) || {};
  const status = params.status || 'all';
  const cottage = params.cottage || 'all';
  const bookings = await loadBookings({ status, cottage });

  return (
    <AdminShell>
      <header className="admin-header">
        <h1>Брони</h1>
        <p className="admin-sub">Все запросы и подтверждённые бронирования.</p>
      </header>

      <div className="admin-filters">
        <FilterGroup name="status" current={status} options={[
          { value: 'all',       label: 'Все' },
          { value: 'pending',   label: 'Ожидают' },
          { value: 'confirmed', label: 'Подтверждены' },
          { value: 'completed', label: 'Завершены' },
          { value: 'cancelled', label: 'Отменены' },
        ]} />
        <FilterGroup name="cottage" current={cottage} options={[
          { value: 'all',    label: 'Все дома' },
          { value: 'dragon', label: 'Dragon' },
          { value: 'viking', label: 'Viking' },
          { value: 'farm',   label: 'Farm' },
          { value: 'black',  label: 'Black' },
        ]} />
      </div>

      <BookingsTable bookings={bookings} />
    </AdminShell>
  );
}

function FilterGroup({ name, current, options }) {
  return (
    <div className="admin-filter-group">
      {options.map((o) => {
        const params = new URLSearchParams();
        params.set(name, o.value);
        return (
          <a
            key={o.value}
            href={`/admin/bookings?${params}`}
            className={`admin-filter-btn${current === o.value ? ' active' : ''}`}
          >
            {o.label}
          </a>
        );
      })}
    </div>
  );
}
