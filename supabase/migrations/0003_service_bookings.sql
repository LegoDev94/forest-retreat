-- ============================================================
-- Forest Retreat — ancillary services (deer-park ticket, picnic
-- kit, tent, jacuzzi, sauna). Idempotent: safe to re-run.
-- ============================================================

create table if not exists public.service_bookings (
  id                   uuid primary key default gen_random_uuid(),
  service_kind         text not null check (service_kind in (
    'deer_ticket', 'picnic_kit', 'tent', 'jacuzzi', 'sauna'
  )),
  service_date         date not null,                   -- the day of service
  start_time           time,                            -- nullable: only for slot-based (jacuzzi/sauna/picnic-hour)
  end_time             time,                            -- nullable
  duration_hours       integer,                         -- for picnic kit hourly (1..24)
  quantity             integer not null default 1 check (quantity >= 1 and quantity <= 200),
  guest_name           text not null,
  guest_email          text not null,
  guest_phone          text not null,
  notes                text,
  status               booking_status not null default 'pending',
  total_price          integer not null check (total_price >= 0),
  locale               text default 'ru',
  payment_state        text,
  payment_reference    text,
  payment_link         text,
  payment_initiated_at timestamptz,
  payment_paid_at      timestamptz,
  payment_raw          jsonb,
  user_id              uuid references auth.users(id),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists service_bookings_kind_date_idx
  on public.service_bookings (service_kind, service_date)
  where status in ('pending', 'confirmed');

create index if not exists service_bookings_created_at_idx
  on public.service_bookings (created_at desc);

create index if not exists service_bookings_payment_ref_idx
  on public.service_bookings (payment_reference);

-- updated_at trigger reuses the same touch_updated_at() from 0001
drop trigger if exists service_bookings_updated_at on public.service_bookings;
create trigger service_bookings_updated_at
  before update on public.service_bookings
  for each row execute function public.touch_updated_at();

-- RLS — admin or service_role only
alter table public.service_bookings enable row level security;

drop policy if exists service_bookings_admin_all on public.service_bookings;
create policy service_bookings_admin_all on public.service_bookings
  for all using (
    auth.jwt() ->> 'role' = 'service_role'
    or exists (select 1 from public.admin_users where user_id = auth.uid())
  );
