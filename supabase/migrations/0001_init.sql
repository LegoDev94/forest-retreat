-- ============================================================
-- Forest Retreat — booking schema
-- Idempotent: safe to re-run.  Run in Supabase SQL Editor.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Tables (created BEFORE any policies / triggers reference them)
-- ------------------------------------------------------------

-- Booking status enum (idempotent)
do $$ begin
  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
  end if;
end $$;

-- Cottages: mirror of static data, allows admin to edit price/active
create table if not exists public.cottages (
  id              text primary key,
  slug            text not null unique,
  name_ru         text not null,
  name_lv         text not null,
  name_en         text not null,
  price_per_night integer not null check (price_per_night > 0),
  sleeps          integer not null default 4 check (sleeps > 0),
  active          boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Bookings
create table if not exists public.bookings (
  id              uuid primary key default gen_random_uuid(),
  cottage_id      text not null references public.cottages(id) on delete restrict,
  check_in        date not null,
  check_out       date not null,
  guests          integer not null check (guests between 1 and 10),
  guest_name      text not null,
  guest_email     text not null,
  guest_phone     text not null,
  notes           text,
  status          booking_status not null default 'pending',
  base_price      integer not null check (base_price >= 0),
  cleaning_fee    integer not null default 30,
  service_fee     integer not null default 0,
  total_price     integer not null,
  locale          text default 'ru',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint valid_dates check (check_out > check_in)
);

create index if not exists bookings_cottage_dates_idx
  on public.bookings (cottage_id, check_in, check_out)
  where status in ('pending', 'confirmed');

create index if not exists bookings_status_idx     on public.bookings (status);
create index if not exists bookings_created_at_idx on public.bookings (created_at desc);

-- Manual blocks / price overrides per date
create table if not exists public.date_overrides (
  id             uuid primary key default gen_random_uuid(),
  cottage_id     text not null references public.cottages(id) on delete cascade,
  date           date not null,
  blocked        boolean not null default false,
  price_override integer,
  note           text,
  created_at     timestamptz not null default now(),
  unique (cottage_id, date)
);

-- Admin users (must exist before RLS policies reference it)
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  role       text not null default 'admin',
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. Triggers (updated_at)
-- ------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists bookings_updated_at on public.bookings;
create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.touch_updated_at();

drop trigger if exists cottages_updated_at on public.cottages;
create trigger cottages_updated_at
  before update on public.cottages
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- 3. RPC: try_create_booking (concurrency-safe)
-- ------------------------------------------------------------
create or replace function public.try_create_booking(
  p_cottage_id   text,
  p_check_in     date,
  p_check_out    date,
  p_guests       integer,
  p_guest_name   text,
  p_guest_email  text,
  p_guest_phone  text,
  p_notes        text default null,
  p_locale       text default 'ru'
) returns public.bookings
language plpgsql security definer set search_path = public as $$
declare
  v_cottage     public.cottages;
  v_nights      integer;
  v_base        integer;
  v_service     integer;
  v_total       integer;
  v_blocked     integer;
  v_overlap     integer;
  v_booking     public.bookings;
begin
  if p_check_out <= p_check_in then
    raise exception 'INVALID_DATES';
  end if;
  if p_check_in < current_date then
    raise exception 'PAST_DATE';
  end if;

  select * into v_cottage from public.cottages where id = p_cottage_id and active;
  if not found then
    raise exception 'COTTAGE_NOT_FOUND';
  end if;

  v_nights := p_check_out - p_check_in;
  v_base   := v_cottage.price_per_night * v_nights;
  v_service := round(v_base * 0.06)::integer;
  v_total  := v_base + 30 + v_service;

  -- Lock conflicting bookings to prevent races
  perform 1
    from public.bookings
    where cottage_id = p_cottage_id
      and status in ('pending', 'confirmed')
      and tstzrange(check_in::timestamptz, check_out::timestamptz, '[)')
        && tstzrange(p_check_in::timestamptz, p_check_out::timestamptz, '[)')
    for update;
  get diagnostics v_overlap = row_count;
  if v_overlap > 0 then
    raise exception 'BOOKING_CONFLICT';
  end if;

  select count(*) into v_blocked
    from public.date_overrides
    where cottage_id = p_cottage_id
      and blocked = true
      and date >= p_check_in
      and date <  p_check_out;
  if v_blocked > 0 then
    raise exception 'DATES_BLOCKED';
  end if;

  insert into public.bookings (
    cottage_id, check_in, check_out, guests,
    guest_name, guest_email, guest_phone, notes,
    base_price, service_fee, total_price, locale
  ) values (
    p_cottage_id, p_check_in, p_check_out, p_guests,
    p_guest_name, p_guest_email, p_guest_phone, p_notes,
    v_base, v_service, v_total, p_locale
  )
  returning * into v_booking;

  return v_booking;
end $$;

-- ------------------------------------------------------------
-- 4. RPC: get_unavailable_ranges (public, no PII)
-- ------------------------------------------------------------
create or replace function public.get_unavailable_ranges(
  p_cottage_id text,
  p_from       date default current_date,
  p_to         date default (current_date + interval '12 months')::date
) returns table (check_in date, check_out date, source text)
language sql stable security definer set search_path = public as $$
  select check_in, check_out, 'booking'::text as source
    from public.bookings
    where cottage_id = p_cottage_id
      and status in ('pending', 'confirmed')
      and check_out > p_from
      and check_in  < p_to
  union all
  select date as check_in, (date + 1) as check_out, 'override'::text
    from public.date_overrides
    where cottage_id = p_cottage_id
      and blocked = true
      and date >= p_from
      and date <  p_to
$$;

grant execute on function public.get_unavailable_ranges(text, date, date) to anon, authenticated;
grant execute on function public.try_create_booking(text, date, date, integer, text, text, text, text, text) to anon, authenticated;

-- ------------------------------------------------------------
-- 5. RLS (admin_users now exists, safe to reference)
-- ------------------------------------------------------------
alter table public.cottages       enable row level security;
alter table public.bookings       enable row level security;
alter table public.date_overrides enable row level security;
alter table public.admin_users    enable row level security;

drop policy if exists cottages_public_read on public.cottages;
create policy cottages_public_read on public.cottages
  for select using (active = true);

drop policy if exists bookings_admin_all on public.bookings;
create policy bookings_admin_all on public.bookings
  for all using (auth.jwt() ->> 'role' = 'service_role'
              or exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists overrides_admin_all on public.date_overrides;
create policy overrides_admin_all on public.date_overrides
  for all using (auth.jwt() ->> 'role' = 'service_role'
              or exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists admin_self_read on public.admin_users;
create policy admin_self_read on public.admin_users for select using (user_id = auth.uid());

-- ------------------------------------------------------------
-- 6. Seed cottages
-- ------------------------------------------------------------
insert into public.cottages (id, slug, name_ru, name_lv, name_en, price_per_night) values
  ('dragon', 'dragon-house', 'Dragon House на дереве', 'Pūķu māja kokā',     'Dragon Tree House',         145),
  ('viking', 'viking-house', 'Viking House на дереве', 'Vikingu māja kokā',  'Viking Tree House',         135),
  ('farm',   'farm-lodge',   'Private Farm Lodge',     'Privātā saimniecība','Private Farm Lodge',        125),
  ('black',  'black-house',  'Black House в лесу',     'Melnā māja mežā',    'Black House in the Forest', 110)
on conflict (id) do update set
  price_per_night = excluded.price_per_night,
  updated_at = now();
