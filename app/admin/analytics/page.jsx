import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '../../../lib/admin-auth';
import { getServerSupabase, isSupabaseConfigured } from '../../../lib/supabase/server';
import AdminShell from '../../../components/admin/AdminShell';
import {
  BookingsByDayChart, RevenueChart, OccupancyByCottage,
  StatusDonut, LeadTimeHistogram,
} from '../../../components/admin/Charts';
import LiveVisitors from '../../../components/admin/LiveVisitors';

export const dynamic = 'force-dynamic';

const DAY = 86400000;

async function loadAnalytics() {
  if (!isSupabaseConfigured()) return null;
  const sb = getServerSupabase();
  const today = new Date();
  const from90 = new Date(today.getTime() - 90 * DAY).toISOString().slice(0, 10);
  const from30 = new Date(today.getTime() - 30 * DAY).toISOString().slice(0, 10);
  const todayISO = today.toISOString().slice(0, 10);
  const next60 = new Date(today.getTime() + 60 * DAY).toISOString().slice(0, 10);

  const [{ data: created90 }, { data: upcoming }, { data: blocks }] = await Promise.all([
    sb.from('bookings')
      .select('id, status, total_price, check_in, check_out, cottage_id, created_at')
      .gte('created_at', from90),
    sb.from('bookings')
      .select('id, cottage_id, check_in, check_out, status')
      .in('status', ['pending', 'confirmed'])
      .gte('check_out', todayISO).lt('check_in', next60),
    sb.from('date_overrides')
      .select('cottage_id, date, blocked')
      .eq('blocked', true)
      .gte('date', todayISO).lt('date', next60),
  ]);

  return {
    created90: created90 ?? [],
    upcoming: upcoming ?? [],
    blocks: blocks ?? [],
    todayISO,
  };
}

const eur = (n) => `${n.toLocaleString('ru-RU')} €`;

export default async function AnalyticsPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');
  const data = await loadAnalytics();

  return (
    <AdminShell>
      <header className="admin-header">
        <h1>Аналитика</h1>
        <p className="admin-sub">Тренды за 90 дней, загрузка на 60 дней вперёд, посетители в реальном времени.</p>
      </header>

      {!data ? (
        <div className="admin-warn">Supabase env vars не настроены.</div>
      ) : (
        <>
          {/* Live visitors strip */}
          <LiveVisitors />

          {/* High-level KPIs */}
          <KPIs created90={data.created90} upcoming={data.upcoming} />

          {/* Charts grid */}
          <div className="charts-grid">
            <section className="admin-section chart-card">
              <h2>Брони по дням</h2>
              <BookingsByDayChart bookings={data.created90} days={30} />
            </section>

            <section className="admin-section chart-card">
              <h2>Выручка по дням</h2>
              <RevenueChart bookings={data.created90} days={30} />
            </section>

            <section className="admin-section chart-card">
              <h2>Загрузка по домам · 60 дней</h2>
              <OccupancyByCottage upcoming={data.upcoming} blocks={data.blocks} fromISO={data.todayISO} days={60} />
            </section>

            <section className="admin-section chart-card">
              <h2>Распределение статусов</h2>
              <StatusDonut bookings={data.created90} />
            </section>

            <section className="admin-section chart-card chart-card-wide">
              <h2>Заранее — за сколько дней бронируют</h2>
              <LeadTimeHistogram bookings={data.created90} />
            </section>
          </div>
        </>
      )}
    </AdminShell>
  );
}

function KPIs({ created90, upcoming }) {
  const successful = created90.filter((b) => ['pending', 'confirmed', 'completed'].includes(b.status));
  const cancelled  = created90.filter((b) => b.status === 'cancelled');
  const totalRev   = successful.reduce((s, b) => s + (b.total_price ?? 0), 0);
  const avgValue   = successful.length ? Math.round(totalRev / successful.length) : 0;
  const cancelRate = created90.length ? Math.round((cancelled.length / created90.length) * 100) : 0;

  // Avg lead time (days between created_at and check_in) for successful
  const leadDays = successful
    .map((b) => Math.max(0, Math.round((new Date(b.check_in) - new Date(b.created_at)) / DAY)))
    .filter((n) => Number.isFinite(n));
  const avgLead = leadDays.length ? Math.round(leadDays.reduce((s, n) => s + n, 0) / leadDays.length) : 0;

  // Avg nights
  const totalNights = successful.reduce((s, b) => s + Math.round((new Date(b.check_out) - new Date(b.check_in)) / DAY), 0);
  const avgNights = successful.length ? (totalNights / successful.length).toFixed(1) : '0.0';

  return (
    <div className="admin-stats">
      <Stat label="Брони · 90 дней" value={created90.length} />
      <Stat label="Выручка · 90 дней" value={eur(totalRev)} />
      <Stat label="Средний чек" value={eur(avgValue)} />
      <Stat label="Среднее ночей" value={avgNights} />
      <Stat label="Lead time, дней" value={avgLead} />
      <Stat label="% отмен" value={`${cancelRate}%`} />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="admin-stat">
      <div className="admin-stat-label">{label}</div>
      <div className="admin-stat-value">{value}</div>
    </div>
  );
}
