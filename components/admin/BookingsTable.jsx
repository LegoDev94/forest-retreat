'use client';
import { useState, useTransition } from 'react';
import StatusBadge from './StatusBadge';
import { setBookingStatus, deleteBooking } from '../../app/actions/admin';

const fmt = (s) => new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtFull = (s) => new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
const eur = (n) => `${n} €`;

export default function BookingsTable({ bookings }) {
  const [pending, startTransition] = useTransition();
  const [openRow, setOpenRow] = useState(null);
  const [error, setError] = useState('');

  const updateStatus = (id, status) => {
    setError('');
    startTransition(async () => {
      const r = await setBookingStatus(id, status);
      if (!r.ok) setError(r.error);
    });
  };
  const remove = (id) => {
    if (!confirm('Удалить бронь насовсем?')) return;
    setError('');
    startTransition(async () => {
      const r = await deleteBooking(id);
      if (!r.ok) setError(r.error);
    });
  };

  if (bookings.length === 0) {
    return <div className="admin-empty">Бронирований по фильтру нет.</div>;
  }

  return (
    <>
      {error && <div className="admin-error" style={{ marginBottom: 12 }}>{error}</div>}
      <table className="admin-table">
        <thead>
          <tr>
            <th></th>
            <th>Дом</th>
            <th>Заезд</th>
            <th>Выезд</th>
            <th>Гостей</th>
            <th>Гость</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Создана</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <FragmentRow
              key={b.id}
              b={b}
              isOpen={openRow === b.id}
              onToggle={() => setOpenRow(openRow === b.id ? null : b.id)}
              onStatus={updateStatus}
              onDelete={remove}
              busy={pending}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}

function FragmentRow({ b, isOpen, onToggle, onStatus, onDelete, busy }) {
  return (
    <>
      <tr className={isOpen ? 'admin-row-open' : ''}>
        <td>
          <button className="admin-row-toggle" onClick={onToggle} aria-label="Раскрыть">
            {isOpen ? '▾' : '▸'}
          </button>
        </td>
        <td><span className="admin-pill">{b.cottage_id}</span></td>
        <td>{fmt(b.check_in)}</td>
        <td>{fmt(b.check_out)}</td>
        <td>{b.guests}</td>
        <td>{b.guest_name}</td>
        <td>{eur(b.total_price)}</td>
        <td><StatusBadge status={b.status} /></td>
        <td className="admin-mono">{fmtFull(b.created_at)}</td>
        <td>
          <div className="admin-row-actions">
            {b.status === 'pending' && (
              <button className="admin-btn admin-btn-sm admin-btn-primary" disabled={busy}
                onClick={() => onStatus(b.id, 'confirmed')}>Подтвердить</button>
            )}
            {b.status !== 'cancelled' && b.status !== 'completed' && (
              <button className="admin-btn admin-btn-sm admin-btn-ghost" disabled={busy}
                onClick={() => onStatus(b.id, 'cancelled')}>Отменить</button>
            )}
            {b.status === 'confirmed' && (
              <button className="admin-btn admin-btn-sm admin-btn-ghost" disabled={busy}
                onClick={() => onStatus(b.id, 'completed')}>Завершить</button>
            )}
            <button className="admin-btn admin-btn-sm admin-btn-danger" disabled={busy}
              onClick={() => onDelete(b.id)}>×</button>
          </div>
        </td>
      </tr>
      {isOpen && (
        <tr className="admin-row-detail">
          <td colSpan={10}>
            <dl className="admin-dl">
              <dt>Email</dt><dd><a href={`mailto:${b.guest_email}`}>{b.guest_email}</a></dd>
              <dt>Телефон</dt><dd><a href={`tel:${b.guest_phone}`}>{b.guest_phone}</a></dd>
              <dt>Заметки</dt><dd>{b.notes || '—'}</dd>
              <dt>Локаль</dt><dd>{b.locale}</dd>
              <dt>База</dt><dd>{eur(b.base_price)}</dd>
              <dt>Уборка</dt><dd>{eur(b.cleaning_fee)}</dd>
              <dt>Сервис</dt><dd>{eur(b.service_fee)}</dd>
              <dt>ID</dt><dd className="admin-mono">{b.id}</dd>
            </dl>
          </td>
        </tr>
      )}
    </>
  );
}
