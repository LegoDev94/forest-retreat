import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '../../../lib/admin-auth';
import { getServerSupabase, isSupabaseConfigured } from '../../../lib/supabase/server';
import AdminShell from '../../../components/admin/AdminShell';
import PricingManager from '../../../components/admin/PricingManager';

export const dynamic = 'force-dynamic';

async function loadData() {
  if (!isSupabaseConfigured()) return null;
  const sb = getServerSupabase();
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: cottages }, { data: overrides }] = await Promise.all([
    sb.from('cottages').select('id, name_ru, price_per_night, sleeps, active').order('id'),
    sb.from('date_overrides')
      .select('*')
      .eq('blocked', false)
      .not('price_override', 'is', null)
      .gte('date', today)
      .order('cottage_id').order('date'),
  ]);
  return { cottages: cottages ?? [], overrides: overrides ?? [] };
}

export default async function PricingPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');
  const data = await loadData();
  return (
    <AdminShell>
      <header className="admin-header">
        <h1>Цены</h1>
        <p className="admin-sub">Базовая цена за ночь и сезонные надбавки.</p>
      </header>
      {!data ? (
        <div className="admin-warn">Supabase env vars не настроены.</div>
      ) : (
        <PricingManager cottages={data.cottages} overrides={data.overrides} />
      )}
    </AdminShell>
  );
}
