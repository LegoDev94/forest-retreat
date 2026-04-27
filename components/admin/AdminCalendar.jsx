'use client';
import { useMemo, useState, useRef, useEffect } from 'react';

const fromISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const toISO   = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const COTTAGE_LABELS = { dragon: 'Dragon', viking: 'Viking', farm: 'Farm', black: 'Black' };

const RANGES = [
  { value: 30,  label: '30 д' },
  { value: 60,  label: '60 д' },
  { value: 90,  label: '90 д' },
  { value: 180, label: '6 м' },
];

const fmtFull = (s) => new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });

export default function AdminCalendar({ cottages, fromISO: fromStr, toISO: toStr, bookings, blocks }) {
  const [rangeDays, setRangeDays] = useState(60);
  const [offset, setOffset]       = useState(0); // months relative to today
  const [tip, setTip]             = useState(null);
  const wrapRef = useRef(null);

  // Recompute window from current offset + range
  const window = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setMonth(start.getMonth() + offset);
    const end = new Date(start);
    end.setDate(end.getDate() + rangeDays);
    return { start, end };
  }, [offset, rangeDays]);

  const days = useMemo(() => {
    const out = [];
    for (let d = new Date(window.start); d < window.end; d.setDate(d.getDate() + 1)) out.push(new Date(d));
    return out;
  }, [window]);

  // Filter incoming data into our window. Server fetches a fixed range — we
  // operate on what we have and silently show fewer marks if window extends.
  const cells = useMemo(() => {
    const m = Object.fromEntries(cottages.map((c) => [c, {}]));
    for (const b of bookings) {
      const start = fromISO(b.check_in);
      const end   = fromISO(b.check_out);
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        if (d < window.start || d >= window.end) continue;
        if (!m[b.cottage_id]) continue;
        m[b.cottage_id][toISO(d)] = {
          kind: b.status === 'confirmed' ? 'confirmed' : 'pending',
          booking: b,
        };
      }
    }
    for (const blk of blocks) {
      const d = fromISO(blk.date);
      if (d < window.start || d >= window.end) continue;
      if (!m[blk.cottage_id]) continue;
      // Don't overwrite a booking; price overrides are signaled separately
      const existing = m[blk.cottage_id][blk.date];
      if (blk.blocked && !existing) {
        m[blk.cottage_id][blk.date] = { kind: 'block', block: blk };
      } else if (!blk.blocked && blk.price_override && !existing) {
        m[blk.cottage_id][blk.date] = { kind: 'priced', block: blk };
      }
    }
    return m;
  }, [cottages, bookings, blocks, window]);

  const monthHeaders = useMemo(() => {
    const groups = [];
    let cur = null;
    for (const d of days) {
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!cur || cur.key !== key) {
        cur = {
          key,
          label: d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }),
          span: 1,
        };
        groups.push(cur);
      } else {
        cur.span += 1;
      }
    }
    return groups;
  }, [days]);

  function handleEnter(e, cottage, iso, cell) {
    if (!wrapRef.current) return;
    const wrapBox = wrapRef.current.getBoundingClientRect();
    const cellBox = e.currentTarget.getBoundingClientRect();
    setTip({
      cottage,
      iso,
      cell,
      x: cellBox.left + cellBox.width / 2 - wrapBox.left,
      y: cellBox.top - wrapBox.top,
    });
  }
  function handleLeave() { setTip(null); }

  // Close tooltip on scroll
  useEffect(() => {
    if (!tip) return;
    const onScroll = () => setTip(null);
    window.addEventListener('scroll', onScroll, true);
    return () => window.removeEventListener('scroll', onScroll, true);
  }, [tip]);

  return (
    <div className="cal-wrap" ref={wrapRef}>
      <div className="cal-toolbar">
        <div className="cal-toolbar-group">
          <button className="admin-btn admin-btn-sm admin-btn-ghost" onClick={() => setOffset(o => o - 1)}>‹ Назад</button>
          <button className="admin-btn admin-btn-sm admin-btn-ghost" onClick={() => setOffset(0)} disabled={offset === 0}>Сегодня</button>
          <button className="admin-btn admin-btn-sm admin-btn-ghost" onClick={() => setOffset(o => o + 1)}>Вперёд ›</button>
        </div>
        <div className="cal-toolbar-group">
          {RANGES.map((r) => (
            <button
              key={r.value}
              className={`admin-btn admin-btn-sm ${r.value === rangeDays ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              onClick={() => setRangeDays(r.value)}
            >{r.label}</button>
          ))}
        </div>
        <div className="cal-legend">
          <span className="cal-key cal-key-pending">Ожидает</span>
          <span className="cal-key cal-key-confirmed">Подтверждена</span>
          <span className="cal-key cal-key-block">Блок</span>
          <span className="cal-key cal-key-priced">Цена</span>
          <span className="cal-key cal-key-free">Свободно</span>
        </div>
      </div>

      <div className="cal-scroll">
        <div className="cal" style={{ gridTemplateColumns: `160px repeat(${days.length}, 30px)` }}>
          <div className="cal-corner" />
          {monthHeaders.map((g) => (
            <div key={g.key} className="cal-month" style={{ gridColumn: `span ${g.span}` }}>{g.label}</div>
          ))}

          <div className="cal-corner" />
          {days.map((d) => {
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            const isToday = d.toDateString() === new Date().toDateString();
            return (
              <div key={toISO(d)} className={`cal-daynum${isWeekend ? ' weekend' : ''}${isToday ? ' today' : ''}`}>
                {d.getDate()}
              </div>
            );
          })}

          {cottages.map((c) => (
            <RowFragment
              key={c}
              cottage={c}
              days={days}
              cells={cells[c]}
              onEnter={handleEnter}
              onLeave={handleLeave}
            />
          ))}
        </div>
      </div>

      {tip && <Tooltip tip={tip} />}
    </div>
  );
}

function RowFragment({ cottage, days, cells, onEnter, onLeave }) {
  return (
    <>
      <div className="cal-cottage">{COTTAGE_LABELS[cottage] || cottage}</div>
      {days.map((d) => {
        const iso = toISO(d);
        const cell = cells[iso];
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const isToday = d.toDateString() === new Date().toDateString();
        const cls = cell
          ? `cal-${cell.kind}`
          : `cal-free${isWeekend ? ' weekend' : ''}`;
        return (
          <div
            key={iso}
            className={`cal-cell ${cls}${isToday ? ' today' : ''}`}
            onMouseEnter={(e) => onEnter(e, cottage, iso, cell)}
            onMouseLeave={onLeave}
          >
            {cell?.kind === 'block' && <span aria-hidden="true">×</span>}
            {cell?.kind === 'priced' && <span aria-hidden="true">€</span>}
          </div>
        );
      })}
    </>
  );
}

function Tooltip({ tip }) {
  const { cottage, iso, cell, x, y } = tip;
  const date = fmtFull(iso);
  return (
    <div className="cal-tooltip" style={{ left: x, top: y }} role="tooltip">
      <div className="cal-tooltip-head">
        <span className="admin-pill">{cottage}</span>
        <span>{date}</span>
      </div>
      {!cell && <div className="cal-tooltip-empty">— свободно</div>}
      {cell?.kind === 'pending' && <BookingTip b={cell.booking} />}
      {cell?.kind === 'confirmed' && <BookingTip b={cell.booking} />}
      {cell?.kind === 'block' && (
        <div className="cal-tooltip-row">
          <span className="cal-tip-label">Блок</span>
          <span>{cell.block.note || '—'}</span>
        </div>
      )}
      {cell?.kind === 'priced' && (
        <div className="cal-tooltip-row">
          <span className="cal-tip-label">Цена</span>
          <span>{cell.block.price_override} € / ночь {cell.block.note ? ` · ${cell.block.note}` : ''}</span>
        </div>
      )}
    </div>
  );
}

function BookingTip({ b }) {
  return (
    <>
      <div className="cal-tooltip-row">
        <span className="cal-tip-label">Гость</span>
        <span><strong>{b.guest_name}</strong> · {b.guests} {b.guests === 1 ? 'гость' : 'гостей'}</span>
      </div>
      <div className="cal-tooltip-row">
        <span className="cal-tip-label">Заезд → Выезд</span>
        <span>{fmtFull(b.check_in)} → {fmtFull(b.check_out)}</span>
      </div>
      <div className="cal-tooltip-row">
        <span className="cal-tip-label">Статус</span>
        <span className={`admin-status admin-status-${b.status}`}>
          {b.status === 'pending' ? 'Ожидает' : b.status === 'confirmed' ? 'Подтверждена' : b.status}
        </span>
      </div>
    </>
  );
}
