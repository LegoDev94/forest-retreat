'use client';
import { useState } from 'react';
import StatusBadge from './StatusBadge';
import { bookingRef } from '../../lib/booking-ref';

const fmt = (s) => s ? new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const eur = (n) => `${n} €`;

export default function UsersList({ users }) {
  const [open, setOpen] = useState(null);
  const [query, setQuery] = useState('');

  const filtered = users.filter((u) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return [u.phone, u.full_name, u.email].some((v) => (v || '').toLowerCase().includes(q));
  });

  if (!users.length) {
    return <div className="admin-empty">Гостей пока нет — они появятся здесь после первой брони с привязкой к телефону.</div>;
  }

  return (
    <>
      <div className="admin-filters" style={{ marginBottom: 14 }}>
        <input
          type="search"
          placeholder="Поиск по телефону, имени, email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="admin-input"
          style={{ minWidth: 320 }}
        />
        <span className="admin-count">· {filtered.length} {filtered.length === 1 ? 'гость' : 'гостей'}</span>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th></th>
            <th>Телефон</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Брони</th>
            <th>Оплачено</th>
            <th>Сумма</th>
            <th>Последний заезд</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <UserRow
              key={u.user_id}
              u={u}
              isOpen={open === u.user_id}
              onToggle={() => setOpen(open === u.user_id ? null : u.user_id)}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}

function UserRow({ u, isOpen, onToggle }) {
  return (
    <>
      <tr className={isOpen ? 'admin-row-open' : ''}>
        <td>
          <button className="admin-row-toggle" onClick={onToggle} aria-label="Раскрыть">
            {isOpen ? '▾' : '▸'}
          </button>
        </td>
        <td className="admin-mono">{u.phone || '—'}</td>
        <td>{u.full_name || '—'}</td>
        <td className="admin-mono" style={{ fontSize: 11 }}>{u.email || '—'}</td>
        <td>{u.total} {u.upcoming > 0 && <span className="admin-pill" style={{ marginLeft: 6 }}>{u.upcoming} впереди</span>}</td>
        <td>{u.paid_count}</td>
        <td>{eur(u.total_spent)}</td>
        <td>{fmt(u.last_check_in)}</td>
      </tr>
      {isOpen && (
        <tr className="admin-row-detail">
          <td colSpan={8}>
            <h4 style={{ margin: '0 0 12px', fontFamily: 'var(--ff-display)', fontSize: 16 }}>История бронирований</h4>
            {u.bookings.length === 0 ? (
              <div className="admin-empty">Нет привязанных бронирований.</div>
            ) : (
              <table className="admin-table" style={{ marginTop: 0 }}>
                <thead>
                  <tr>
                    <th>№</th>
                    <th>Дом</th>
                    <th>Заезд</th>
                    <th>Выезд</th>
                    <th>Сумма</th>
                    <th>Оплата</th>
                    <th>Статус</th>
                    <th>Создана</th>
                  </tr>
                </thead>
                <tbody>
                  {u.bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="admin-mono admin-ref">{bookingRef(b.id)}</td>
                      <td><span className="admin-pill">{b.cottage_id}</span></td>
                      <td>{fmt(b.check_in)}</td>
                      <td>{fmt(b.check_out)}</td>
                      <td>{eur(b.total_price)}</td>
                      <td>
                        <span className={`admin-status admin-status-${b.payment_state === 'paid' ? 'confirmed' : b.payment_state === 'failed' || b.payment_state === 'abandoned' ? 'cancelled' : 'pending'}`}>
                          {b.payment_state || '—'}
                        </span>
                      </td>
                      <td><StatusBadge status={b.status} /></td>
                      <td className="admin-mono" style={{ fontSize: 11 }}>{fmt(b.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
