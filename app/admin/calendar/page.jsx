import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '../../../lib/admin-auth';
import { getServerSupabase, isSupabaseConfigured } from '../../../lib/supabase/server';
import AdminShell from '../../../components/admin/AdminShell';
import AdminCalendar from '../../../components/admin/AdminCalendar';
import { COTTAGES } from '../../../lib/data';

export const dynamic = 'force-dynamic';

const COTTAGE_IDS = COTTAGES.map((c) => c.id);
const RANGE_DAYS = 60;

async function loadCalendarData() {
  if (!isSupabaseConfigured()) return null;
  const sb = getServerSupabase();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const fromISO = today.toISOString().slice(0, 10);
  const to = new Date(today.getTime() + RANGE_DAYS * 86400000);
  const toISO = to.toISOString().slice(0, 10);

  const [{ data: bookings }, { data: blocks }] = await Promise.all([
    sb.from('bookings')
      .select('id, cottage_id, check_in, check_out, status, guest_name, guests')
      .in('status', ['pending', 'confirmed'])
      .lt('check_in', toISO).gt('check_out', fromISO),
    sb.from('date_overrides')
      .select('id, cottage_id, date, blocked, note')
      .gte('date', fromISO).lt('date', toISO),
  ]);

  return {
    fromISO, toISO,
    bookings: bookings ?? [],
    blocks: blocks ?? [],
  };
}

export default async function CalendarPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');
  const data = await loadCalendarData();
  return (
    <AdminShell>
      <header className="admin-header">
        <h1>Календарь</h1>
        <p className="admin-sub">{RANGE_DAYS} дней вперёд по всем 4 домам.</p>
      </header>
      {!data ? (
        <div className="admin-warn">Supabase env vars не настроены.</div>
      ) : (
        <AdminCalendar
          cottages={COTTAGE_IDS}
          fromISO={data.fromISO}
          toISO={data.toISO}
          bookings={data.bookings}
          blocks={data.blocks}
        />
      )}
    </AdminShell>
  );
}
