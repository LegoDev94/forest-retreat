// Pure-SVG charts. Server-renderable, no chart lib dependency.

const COLORS = {
  pending:   '#c9a86a',
  confirmed: '#5aa276',
  cancelled: '#e16060',
  completed: '#7d8fa8',
};

const COTTAGE_COLORS = {
  dragon: '#c9a86a',
  viking: '#5aa276',
  farm:   '#9c7ed3',
  black:  '#7d8fa8',
};

const DAY = 86400000;

function lastNDays(n) {
  const out = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY);
    out.push({
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      day: d.getDate(),
      isMonthStart: d.getDate() === 1,
    });
  }
  return out;
}

// ============================================================
// Bookings by day — vertical bars
// ============================================================
export function BookingsByDayChart({ bookings, days = 30 }) {
  const range = lastNDays(days);
  const byDay = Object.fromEntries(range.map((d) => [d.iso, { pending: 0, confirmed: 0, cancelled: 0, completed: 0 }]));
  for (const b of bookings) {
    const day = b.created_at?.slice(0, 10);
    if (byDay[day]) byDay[day][b.status] = (byDay[day][b.status] || 0) + 1;
  }
  const max = Math.max(1, ...range.map((d) => Object.values(byDay[d.iso]).reduce((a, x) => a + x, 0)));

  const W = 700, H = 220, P = { l: 32, r: 8, t: 12, b: 28 };
  const innerW = W - P.l - P.r;
  const innerH = H - P.t - P.b;
  const barW = innerW / range.length;

  const yTicks = niceTicks(max, 4);

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="xMidYMid meet">
        {/* Y grid */}
        {yTicks.map((t) => {
          const y = P.t + innerH - (t / max) * innerH;
          return (
            <g key={t}>
              <line x1={P.l} y1={y} x2={W - P.r} y2={y} className="chart-grid" />
              <text x={P.l - 6} y={y + 3} textAnchor="end" className="chart-axis-label">{t}</text>
            </g>
          );
        })}
        {/* Bars */}
        {range.map((d, i) => {
          const counts = byDay[d.iso];
          const total = counts.pending + counts.confirmed + counts.cancelled + counts.completed;
          let yCursor = P.t + innerH;
          const x = P.l + i * barW + 1;
          const barWidth = Math.max(1, barW - 2);
          const segs = ['confirmed', 'pending', 'completed', 'cancelled'].map((s) => {
            const v = counts[s];
            if (!v) return null;
            const h = (v / max) * innerH;
            yCursor -= h;
            return <rect key={s} x={x} y={yCursor} width={barWidth} height={h} fill={COLORS[s]} rx="1.5" />;
          });
          return (
            <g key={d.iso}>
              {segs}
              {(d.isMonthStart || i === 0 || i === range.length - 1) && (
                <text x={x + barWidth / 2} y={H - P.b + 14} textAnchor="middle" className="chart-axis-label">
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <Legend items={[
        { color: COLORS.confirmed, label: 'Подтверждены' },
        { color: COLORS.pending,   label: 'Ожидают' },
        { color: COLORS.completed, label: 'Завершены' },
        { color: COLORS.cancelled, label: 'Отменены' },
      ]} />
    </div>
  );
}

// ============================================================
// Revenue chart — line
// ============================================================
export function RevenueChart({ bookings, days = 30 }) {
  const range = lastNDays(days);
  const byDay = Object.fromEntries(range.map((d) => [d.iso, 0]));
  for (const b of bookings) {
    if (b.status === 'cancelled') continue;
    const day = b.created_at?.slice(0, 10);
    if (byDay[day] !== undefined) byDay[day] += b.total_price ?? 0;
  }
  const values = range.map((d) => byDay[d.iso]);
  const max = Math.max(1, ...values);
  const total = values.reduce((s, v) => s + v, 0);

  const W = 700, H = 220, P = { l: 44, r: 8, t: 12, b: 28 };
  const innerW = W - P.l - P.r;
  const innerH = H - P.t - P.b;
  const stepX = innerW / Math.max(1, range.length - 1);

  const points = values.map((v, i) => {
    const x = P.l + i * stepX;
    const y = P.t + innerH - (v / max) * innerH;
    return [x, y];
  });
  const pathLine = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const pathArea = `${pathLine} L${P.l + (range.length - 1) * stepX},${P.t + innerH} L${P.l},${P.t + innerH} Z`;
  const yTicks = niceTicks(max, 4);

  return (
    <div className="chart-wrap">
      <div className="chart-headline">{total.toLocaleString('ru-RU')} €</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a86a" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#c9a86a" stopOpacity="0" />
          </linearGradient>
        </defs>
        {yTicks.map((t) => {
          const y = P.t + innerH - (t / max) * innerH;
          return (
            <g key={t}>
              <line x1={P.l} y1={y} x2={W - P.r} y2={y} className="chart-grid" />
              <text x={P.l - 6} y={y + 3} textAnchor="end" className="chart-axis-label">
                {t.toLocaleString('ru-RU')}
              </text>
            </g>
          );
        })}
        <path d={pathArea} fill="url(#revGrad)" />
        <path d={pathLine} fill="none" stroke="#e0c585" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map(([x, y], i) => values[i] > 0 ? (
          <circle key={i} cx={x} cy={y} r="2.5" fill="#e0c585" />
        ) : null)}
        {range.map((d, i) => (d.isMonthStart || i === 0 || i === range.length - 1) ? (
          <text key={d.iso} x={P.l + i * stepX} y={H - P.b + 14} textAnchor="middle" className="chart-axis-label">
            {d.label}
          </text>
        ) : null)}
      </svg>
    </div>
  );
}

// ============================================================
// Occupancy by cottage — horizontal bars
// ============================================================
export function OccupancyByCottage({ upcoming, blocks, fromISO, days = 60 }) {
  const cottages = ['dragon', 'viking', 'farm', 'black'];
  const totalDays = days;
  const start = new Date(fromISO);
  const occupiedSets = Object.fromEntries(cottages.map((c) => [c, new Set()]));

  for (const b of upcoming) {
    if (!occupiedSets[b.cottage_id]) continue;
    const cIn  = new Date(b.check_in);
    const cOut = new Date(b.check_out);
    for (let d = new Date(Math.max(cIn, start)); d < cOut && (d - start) / DAY < totalDays; d.setDate(d.getDate() + 1)) {
      occupiedSets[b.cottage_id].add(d.toISOString().slice(0, 10));
    }
  }
  for (const blk of blocks) {
    if (!occupiedSets[blk.cottage_id]) continue;
    occupiedSets[blk.cottage_id].add(blk.date);
  }

  const W = 700, H = 200, P = { l: 80, r: 50, t: 10, b: 12 };
  const innerW = W - P.l - P.r;
  const rowH = (H - P.t - P.b) / cottages.length;

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="xMidYMid meet">
        {cottages.map((c, i) => {
          const occupied = occupiedSets[c].size;
          const pct = Math.round((occupied / totalDays) * 100);
          const y = P.t + i * rowH + 6;
          const barH = rowH - 14;
          const fillW = (occupied / totalDays) * innerW;
          return (
            <g key={c}>
              <text x={P.l - 8} y={y + barH / 2 + 4} textAnchor="end" className="chart-axis-label">{labelCottage(c)}</text>
              <rect x={P.l} y={y} width={innerW} height={barH} className="chart-grid" rx="4" />
              <rect x={P.l} y={y} width={fillW} height={barH} fill={COTTAGE_COLORS[c]} rx="4" />
              <text x={P.l + innerW + 8} y={y + barH / 2 + 4} className="chart-axis-label">
                {occupied}/{totalDays} · {pct}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ============================================================
// Status donut
// ============================================================
export function StatusDonut({ bookings }) {
  const counts = { pending: 0, confirmed: 0, cancelled: 0, completed: 0 };
  for (const b of bookings) counts[b.status] = (counts[b.status] || 0) + 1;
  const total = Object.values(counts).reduce((s, v) => s + v, 0);

  const cx = 110, cy = 110, r = 80, sw = 20;
  const C = 2 * Math.PI * r;
  let acc = 0;
  const arcs = ['confirmed', 'pending', 'completed', 'cancelled'].map((s) => {
    const v = counts[s];
    if (!v || !total) return null;
    const len = (v / total) * C;
    const offset = -acc;
    acc += len;
    return (
      <circle
        key={s}
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={COLORS[s]}
        strokeWidth={sw}
        strokeDasharray={`${len.toFixed(2)} ${(C - len).toFixed(2)}`}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    );
  });

  return (
    <div className="chart-wrap chart-donut">
      <svg viewBox="0 0 220 220" className="chart-svg-square" preserveAspectRatio="xMidYMid meet">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
        {arcs}
        <text x={cx} y={cy - 4} textAnchor="middle" className="chart-donut-num">{total}</text>
        <text x={cx} y={cy + 18} textAnchor="middle" className="chart-donut-label">всего</text>
      </svg>
      <Legend items={[
        { color: COLORS.confirmed, label: `Подтверждены · ${counts.confirmed}` },
        { color: COLORS.pending,   label: `Ожидают · ${counts.pending}` },
        { color: COLORS.completed, label: `Завершены · ${counts.completed}` },
        { color: COLORS.cancelled, label: `Отменены · ${counts.cancelled}` },
      ]} vertical />
    </div>
  );
}

// ============================================================
// Lead time histogram
// ============================================================
export function LeadTimeHistogram({ bookings }) {
  const buckets = [
    { label: '0-1', min: 0, max: 1 },
    { label: '2-7', min: 2, max: 7 },
    { label: '8-14', min: 8, max: 14 },
    { label: '15-30', min: 15, max: 30 },
    { label: '31-60', min: 31, max: 60 },
    { label: '61-90', min: 61, max: 90 },
    { label: '91+', min: 91, max: Infinity },
  ];
  for (const b of bookings) {
    if (b.status === 'cancelled') continue;
    const lead = Math.max(0, Math.round((new Date(b.check_in) - new Date(b.created_at)) / DAY));
    const bk = buckets.find((b) => lead >= b.min && lead <= b.max);
    if (bk) bk.count = (bk.count || 0) + 1;
  }
  const max = Math.max(1, ...buckets.map((b) => b.count || 0));

  const W = 700, H = 200, P = { l: 24, r: 8, t: 12, b: 36 };
  const innerW = W - P.l - P.r;
  const innerH = H - P.t - P.b;
  const barW = innerW / buckets.length;

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="xMidYMid meet">
        {buckets.map((b, i) => {
          const v = b.count || 0;
          const h = (v / max) * innerH;
          const x = P.l + i * barW + 4;
          const y = P.t + innerH - h;
          const w = barW - 8;
          return (
            <g key={b.label}>
              <rect x={x} y={y} width={w} height={h} fill={COLORS.pending} rx="3" />
              <text x={x + w / 2} y={y - 4} textAnchor="middle" className="chart-axis-label">{v || ''}</text>
              <text x={x + w / 2} y={H - P.b + 14} textAnchor="middle" className="chart-axis-label">{b.label}</text>
              <text x={x + w / 2} y={H - P.b + 28} textAnchor="middle" className="chart-axis-sublabel">дней</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ============================================================
// Helpers
// ============================================================
function Legend({ items, vertical = false }) {
  return (
    <div className={`chart-legend${vertical ? ' chart-legend-vertical' : ''}`}>
      {items.map((it) => (
        <span key={it.label} className="chart-legend-item">
          <span className="chart-legend-dot" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

function labelCottage(id) {
  return ({ dragon: 'Dragon', viking: 'Viking', farm: 'Farm', black: 'Black' })[id] || id;
}

function niceTicks(max, count = 4) {
  if (max <= 0) return [0];
  const step = niceStep(max / count);
  const top = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = 0; v <= top; v += step) ticks.push(v);
  return ticks;
}
function niceStep(raw) {
  const exp = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / exp;
  if (norm < 1.5) return exp;
  if (norm < 3)   return 2 * exp;
  if (norm < 7)   return 5 * exp;
  return 10 * exp;
}
