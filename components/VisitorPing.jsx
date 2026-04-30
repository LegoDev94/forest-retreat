'use client';
// Lightweight visitor heartbeat. Sends POST to /api/presence every 25s
// while the page is visible. Stores the visitor id in sessionStorage so
// reloads keep the same id, but a new tab gets a new one.
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const PING_INTERVAL_MS = 25_000;
const STORAGE_KEY = 'fr_visitor_id';

function getVisitorId() {
  if (typeof crypto === 'undefined') return null;
  let id = null;
  try { id = sessionStorage.getItem(STORAGE_KEY); } catch {}
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    try { sessionStorage.setItem(STORAGE_KEY, id); } catch {}
  }
  return id;
}

async function uaHash() {
  if (typeof crypto === 'undefined' || !crypto.subtle) return null;
  try {
    const enc = new TextEncoder().encode(navigator.userAgent || '');
    const buf = await crypto.subtle.digest('SHA-1', enc);
    return Array.from(new Uint8Array(buf))
      .slice(0, 8)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch { return null; }
}

export default function VisitorPing({ locale = 'ru' }) {
  const pathname = usePathname();

  useEffect(() => {
    const id = getVisitorId();
    if (!id) return;
    let cancelled = false;
    let timer = null;

    async function send() {
      if (cancelled) return;
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      const hash = await uaHash();
      try {
        await fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, page: pathname || '/', locale, uaHash: hash }),
          keepalive: true,
        });
      } catch {}
    }

    send();
    timer = setInterval(send, PING_INTERVAL_MS);
    const onVis = () => { if (document.visibilityState === 'visible') send(); };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [pathname, locale]);

  return null;
}
