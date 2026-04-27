import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '../../../lib/admin-auth';
import { getServerSupabase, isSupabaseConfigured } from '../../../lib/supabase/server';
import AdminShell from '../../../components/admin/AdminShell';
import BlocksManager from '../../../components/admin/BlocksManager';
import { COTTAGES } from '../../../lib/data';

export const dynamic = 'force-dynamic';

async function loadBlocks() {
  if (!isSupabaseConfigured()) return [];
  const sb = getServerSupabase();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await sb
    .from('date_overrides')
    .select('*')
    .eq('blocked', true)
    .gte('date', today)
    .order('cottage_id', { ascending: true })
    .order('date', { ascending: true });
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export default async function BlocksPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');
  const blocks = await loadBlocks();
  const cottages = COTTAGES.map((c) => ({ id: c.id, name: c.name?.ru || c.id }));
  return (
    <AdminShell>
      <header className="admin-header">
        <h1>Блокировки</h1>
        <p className="admin-sub">Закрой даты на ремонт, личное проживание или премиум-сезон.</p>
      </header>
      <BlocksManager cottages={cottages} initialBlocks={blocks} />
    </AdminShell>
  );
}
