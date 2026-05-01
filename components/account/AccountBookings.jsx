import Link from 'next/link';
import { bookingRef } from '../../lib/booking-ref';

const fmt = (s) => new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
const eur = (n) => `${n} €`;

const STATUS_LABELS = {
  pending:   'Ожидает',
  confirmed: 'Подтверждена',
  cancelled: 'Отменена',
  completed: 'Завершена',
};
const PAY_LABELS = {
  unpaid:    'Не оплачен',
  initiated: 'Ожидает оплаты',
  pending:   'В обработке',
  paid:      'Оплачен',
  failed:    'Ошибка',
  abandoned: 'Брошен',
  refunded:  'Возврат',
  voided:    'Отменён',
};

export default function AccountBookings({ bookings }) {
  if (!bookings.length) {
    return <div className="account-empty">У тебя пока нет броней. <Link href="/" className="account-link">К домикам →</Link></div>;
  }
  return (
    <ul className="account-bookings">
      {bookings.map((b) => {
        const ref = bookingRef(b.id);
        return (
          <li key={b.id} className="account-booking">
            <div className="account-booking-head">
              <span className="account-booking-ref" title="Номер брони — пришли менеджеру для быстрого поиска">{ref}</span>
              <span className={`account-status account-status-${b.status}`}>
                {STATUS_LABELS[b.status] || b.status}
              </span>
            </div>
            <div className="account-booking-cottage-line">
              <span className="account-booking-cottage">{b.cottage_id}</span>
            </div>
            <div className="account-booking-dates">
              <strong>{fmt(b.check_in)}</strong>
              <span className="account-arrow">→</span>
              <strong>{fmt(b.check_out)}</strong>
              <span className="account-booking-nights">
                · {Math.round((new Date(b.check_out) - new Date(b.check_in)) / 86400000)} ноч.
              </span>
            </div>
            <div className="account-booking-meta">
              <span>{b.guests} {b.guests === 1 ? 'гость' : 'гостей'}</span>
              <span>{eur(b.total_price)}</span>
              <span className={`account-pay account-pay-${b.payment_state || 'unpaid'}`}>
                {PAY_LABELS[b.payment_state] || '—'}
              </span>
              {b.payment_state !== 'paid' && b.payment_link && (
                <a href={b.payment_link} className="account-link" rel="noreferrer">Оплатить →</a>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
