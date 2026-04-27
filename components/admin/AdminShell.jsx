'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { logoutAction } from '../../app/actions/admin';

const NAV = [
  { href: '/admin',          label: 'Дашборд',     icon: '◆' },
  { href: '/admin/bookings', label: 'Брони',       icon: '◉' },
  { href: '/admin/calendar', label: 'Календарь',   icon: '◇' },
  { href: '/admin/blocks',   label: 'Блокировки',  icon: '◍' },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark" />
          <div>
            <div className="admin-brand-name">Forest Retreat</div>
            <div className="admin-brand-sub">Admin</div>
          </div>
        </div>
        <nav className="admin-nav">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link${active ? ' active' : ''}`}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <form action={logoutAction} className="admin-logout">
          <button type="submit" className="admin-btn admin-btn-ghost">Выйти</button>
        </form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
