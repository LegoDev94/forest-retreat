'use client';
import { useMemo } from 'react';

const fromISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const toISO   = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const COTTAGE_LABELS = { dragon: 'Dragon', viking: 'Viking', farm: 'Farm', black: 'Black' };

export default function AdminCalendar({ cottages, fromISO: fromStr, toISO: toStr, bookings, blocks }) {
  const days = useMemo(() => {
    const out = [];
    const start = fromISO(fromStr);
    const end = fromISO(toStr);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      out.push(new Date(d));
    }
    return out;
  }, [fromStr, toStr]);

  // Build per-cottage day maps: { 'dragon': { '2026-05-01': {kind:'booking', ...} } }
  const byCottage = useMemo(() => {
    const m = Object.fromEntries(cottages.map((c) => [c, {}]));
    for (const b of bookings) {
      const start = fromISO(b.check_in);
      const end   = fromISO(b.check_out);
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        if (!m[b.cottage_id]) continue;
        m[b.cottage_id][toISO(d)] = {
          kind: b.status === 'confirmed' ? 'confirmed' : 'pending',
          label: `${b.guest_name} (${b.guests})`,
          id: b.id,
        };
      }
    }
    for (const blk of blocks) {
      if (!blk.blocked) continue;
      if (!m[blk.cottage_id]) continue;
      m[blk.cottage_id][blk.date] = m[blk.cottage_id][blk.date] || { kind: 'block', label: blk.note || 'Заблокировано' };
    }
    return m;
  }, [cottages, bookings, blocks]);

  // Group days by month for headers
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

  return (
    <div className="admin-cal-wrap">
      <div className="admin-cal-legend">
        <span className="admin-cal-key admin-cal-pending">Ожидает</span>
        <span className="admin-cal-key admin-cal-confirmed">Подтверждена</span>
        <span className="admin-cal-key admin-cal-block">Блок</span>
        <span className="admin-cal-key admin-cal-free">Свободно</span>
      </div>
      <div className="admin-cal" style={{ gridTemplateColumns: `160px repeat(${days.length}, 32px)` }}>
        {/* Month headers row */}
        <div className="admin-cal-head admin-cal-corner"></div>
        {monthHeaders.map((g, i) => (
          <div
            key={g.key}
            className="admin-cal-head admin-cal-month"
            style={{ gridColumn: `span ${g.span}` }}
          >
            {g.label}
          </div>
        ))}

        {/* Day numbers row */}
        <div className="admin-cal-corner"></div>
        {days.map((d) => {
          const isWeekend = d.getDay() === 0 || d.getDay() === 6;
          return (
            <div key={toISO(d)} className={`admin-cal-day-num${isWeekend ? ' weekend' : ''}`}>
              {d.getDate()}
            </div>
          );
        })}

        {/* Cottage rows */}
        {cottages.map((c) => (
          <RowFragment
            key={c}
            cottage={c}
            days={days}
            cells={byCottage[c]}
          />
        ))}
      </div>
    </div>
  );
}

function RowFragment({ cottage, days, cells }) {
  return (
    <>
      <div className="admin-cal-cottage">
        <div className="admin-cal-cottage-label">{COTTAGE_LABELS[cottage] || cottage}</div>
      </div>
      {days.map((d) => {
        const iso = toISO(d);
        const cell = cells[iso];
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const cls = cell
          ? `admin-cal-${cell.kind}`
          : `admin-cal-free${isWeekend ? ' weekend' : ''}`;
        const tooltip = cell ? `${iso} · ${cell.label}` : iso;
        return (
          <div key={iso} className={`admin-cal-cell ${cls}`} title={tooltip}>
            {cell?.kind === 'block' && <span aria-hidden="true">×</span>}
          </div>
        );
      })}
    </>
  );
}
