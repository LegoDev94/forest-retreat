import './admin.css';

export const metadata = {
  title: 'Admin · Forest Retreat',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

// Note: auth check happens per-page (not in layout) so /admin/login can render
// for unauthenticated users. Each protected page calls isAdminAuthenticated()
// and redirects if needed.
export default function AdminLayout({ children }) {
  return <>{children}</>;
}
