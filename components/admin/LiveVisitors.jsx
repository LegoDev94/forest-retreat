'use client';
import { useEffect, useState } from 'react';

const REFRESH_MS = 8_000;
const STALE_SECONDS = 60;

function shortPath(p) {
  if (!p || p === '/') return '/';
  // strip trailing slashes, leading locale segment for cleaner display
  const s = p.replace(/\/+$/, '');
  return s.replace(/^\/(ru|lv|en)(?=\/|$)/, '') || '/';
}

export default function LiveVisitors() {
  const [data, setData] = useState({ visitors: [], loading: true, error: null });

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const r = await fetch(`/api/presence/active?seconds=${STALE_SECONDS}`, { cache: 'no-store' });
        if (!alive) return;
        if (!r.ok) {
          setData((d) => ({ ...d, loading: false, error: r.status === 401 ? 'unauthorized' : 'error' }));
          return;
        }
        const j = await r.json();
        if (!alive) return;
        setData({ visitors: j.visitors ?? [], loading: false, error: null });
      } catch (err) {
        if (!alive) return;
        setData((d) => ({ ...d, loading: false, error: 'network' }));
      }
    }

    load();
    const id = setInterval(load, REFRESH_MS);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const count = data.visitors.length;

  // Group by page for the breakdown
  const byPage = data.visitors.reduce((acc, v) => {
    const k = shortPath(v.page);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const pages = Object.entries(byPage).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="admin-stat live-stat">
      <div className="admin-stat-label">
        <span className="live-pulse" /> На сайте сейчас
      </div>
      <div className="admin-stat-value">{data.loading ? '—' : count}</div>
      {!data.loading && pages.length > 0 && (
        <ul className="live-pages">
          {pages.map(([page, n]) => (
            <li key={page}>
              <span className="live-pages-path">{page}</span>
              <span className="live-pages-count">{n}</span>
            </li>
          ))}
        </ul>
      )}
      {!data.loading && pages.length === 0 && (
        <div className="live-empty">Никого. Тишина.</div>
      )}
    </div>
  );
}
