import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '../../../lib/admin-auth';
import { getServerSupabase, isSupabaseConfigured } from '../../../lib/supabase/server';
import AdminShell from '../../../components/admin/AdminShell';

export const dynamic = 'force-dynamic';

const KIND_LABEL = {
  deer_ticket: '🦌 Олений парк',
  picnic_kit:  '🔥 Тент + мангал',
  tent:        '⛺ Палатка',
  jacuzzi:     '♨️ Джакузи',
  sauna:       '🧖 Сауна',
};

async function loadServiceBookings() {
  if (!isSupabaseConfigured()) return [];
  const sb = getServerSupabase();
  const { data, error } = await sb
    .from('service_bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) {
    console.error('service_bookings load:', error);
    return [];
  }
  return data ?? [];
}

const fmtDate = (s) => new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtDateTime = (s) => new Date(s).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

function quantityCell(r) {
  if (r.service_kind === 'deer_ticket') return `${r.quantity} чел`;
  if (r.service_kind === 'picnic_kit')  return r.duration_hours ? `${r.duration_hours} ч × ${r.quantity}` : `сутки × ${r.quantity}`;
  if (r.service_kind === 'tent')        return `${Math.round((r.duration_hours || 24) / 24)} сут × ${r.quantity}`;
  return `${r.quantity} сеанс`;
}

export default async function ServiceBookingsPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');
  const rows = await loadServiceBookings();

  return (
    <AdminShell>
      <header className="admin-header">
        <h1>Услуги</h1>
        <p className="admin-sub">Бронирования допов: парк, пикник, палатка, сауна, джакузи.</p>
      </header>

      {!rows.length ? (
        <div className="admin-empty">Пока пусто.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Создано</th>
              <th>Услуга</th>
              <th>Дата</th>
              <th>Время</th>
              <th>Кол-во</th>
              <th>Гость</th>
              <th>Контакт</th>
              <th>Сумма</th>
              <th>Оплата</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{fmtDateTime(r.created_at)}</td>
                <td>{KIND_LABEL[r.service_kind] || r.service_kind}</td>
                <td>{fmtDate(r.service_date)}</td>
                <td>{r.start_time || '—'}</td>
                <td>{quantityCell(r)}</td>
                <td>{r.guest_name}</td>
                <td>
                  <div><a href={`tel:${r.guest_phone}`}>{r.guest_phone}</a></div>
                  <div><a href={`mailto:${r.guest_email}`}>{r.guest_email}</a></div>
                </td>
                <td>{r.total_price} €</td>
                <td>{r.payment_state || '—'}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
