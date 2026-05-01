'use client';
import { useMemo, useState } from 'react';

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const WEEKDAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

const fromISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const toISO   = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const sameDay = (a, b) => a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);
  const start = (first.getDay() + 6) % 7;
  const days = [];
  for (let i = start; i > 0; i--) days.push(new Date(year, month, 1 - i));
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(new Date(year, month + 1, days.length - last.getDate() - start + 1));
  return days;
}

export default function AccountCalendar({ bookings }) {
  const [offset, setOffset] = useState(0);
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);

  // Map every day in any booking range → status (pending/confirmed/etc.)
  const dayMap = useMemo(() => {
    const m = {};
    for (const b of bookings) {
      if (b.status === 'cancelled') continue;
      const s = fromISO(b.check_in);
      const e = fromISO(b.check_out);
      for (let d = new Date(s); d < e; d.setDate(d.getDate() + 1)) {
        m[toISO(d)] = b;
      }
    }
    return m;
  }, [bookings]);

  const view = useMemo(() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + offset);
    return { year: d.getFullYear(), month: d.getMonth() };
  }, [offset, today]);

  const days = buildMonthGrid(view.year, view.month);

  return (
    <div className="acc-cal">
      <div className="acc-cal-head">
        <button type="button" onClick={() => setOffset(o => o - 1)} className="acc-cal-nav" aria-label="Назад">‹</button>
        <span className="acc-cal-title">{MONTHS[view.month]} <em>{view.year}</em></span>
        <button type="button" onClick={() => setOffset(o => o + 1)} className="acc-cal-nav" aria-label="Вперёд">›</button>
      </div>
      <div className="acc-cal-week">
        {WEEKDAYS.map(w => <span key={w}>{w}</span>)}
      </div>
      <div className="acc-cal-grid">
        {days.map((d) => {
          const iso = toISO(d);
          const otherMonth = d.getMonth() !== view.month;
          const isToday = sameDay(d, today);
          const booking = dayMap[iso];
          const cls = [
            'acc-cal-day',
            otherMonth && 'acc-cal-other',
            isToday && 'acc-cal-today',
            booking && `acc-cal-booked acc-cal-${booking.status}`,
          ].filter(Boolean).join(' ');
          return (
            <div
              key={iso}
              className={cls}
              title={booking ? `${booking.cottage_id} · ${booking.status}` : ''}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>
      {bookings.length === 0 && <div className="acc-cal-empty">Дни твоих заездов появятся здесь.</div>}
    </div>
  );
}
