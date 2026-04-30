-- ============================================================
-- 0002 — seasonal pricing in try_create_booking + live visitor presence
-- Run in Supabase SQL Editor on top of 0001_init.sql
-- ============================================================

-- ------------------------------------------------------------
-- 1. Update try_create_booking to honor per-night price_override
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
  v_cottage  public.cottages;
  v_nights   integer;
  v_base     integer;
  v_service  integer;
  v_total    integer;
  v_blocked  integer;
  v_overlap  integer;
  v_booking  public.bookings;
begin
  if p_check_out <= p_check_in then raise exception 'INVALID_DATES'; end if;
  if p_check_in  < current_date  then raise exception 'PAST_DATE'; end if;

  select * into v_cottage from public.cottages where id = p_cottage_id and active;
  if not found then raise exception 'COTTAGE_NOT_FOUND'; end if;

  v_nights := p_check_out - p_check_in;

  -- Lock conflicting bookings (race-safe)
  perform 1
    from public.bookings
    where cottage_id = p_cottage_id
      and status in ('pending', 'confirmed')
      and tstzrange(check_in::timestamptz, check_out::timestamptz, '[)')
        && tstzrange(p_check_in::timestamptz, p_check_out::timestamptz, '[)')
    for update;
  get diagnostics v_overlap = row_count;
  if v_overlap > 0 then raise exception 'BOOKING_CONFLICT'; end if;

  -- Block check
  select count(*) into v_blocked
    from public.date_overrides
    where cottage_id = p_cottage_id
      and blocked = true
      and date >= p_check_in and date < p_check_out;
  if v_blocked > 0 then raise exception 'DATES_BLOCKED'; end if;

  -- Per-night price = override if any, else cottage default
  select coalesce(sum(coalesce(o.price_override, v_cottage.price_per_night)), 0)::int
    into v_base
    from generate_series(p_check_in, p_check_out - interval '1 day', interval '1 day') as gs(d)
    left join public.date_overrides o
      on o.cottage_id = p_cottage_id and o.date = gs.d::date;

  v_service := round(v_base * 0.06)::integer;
  v_total   := v_base + 30 + v_service;

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
-- 2. Public quote function — used for accurate price preview
-- ------------------------------------------------------------
create or replace function public.get_quote(
  p_cottage_id text,
  p_check_in   date,
  p_check_out  date
) returns table (nights int, base_price int, service_fee int, cleaning_fee int, total_price int)
language sql stable security definer set search_path = public as $$
  with c as (select price_per_night from public.cottages where id = p_cottage_id and active),
  per_night as (
    select coalesce(o.price_override, (select price_per_night from c)) as price
    from generate_series(p_check_in, p_check_out - interval '1 day', interval '1 day') as gs(d)
    left join public.date_overrides o
      on o.cottage_id = p_cottage_id and o.date = gs.d::date
  ),
  agg as (
    select count(*)::int as nights, coalesce(sum(price), 0)::int as base
    from per_night
  )
  select nights,
         base as base_price,
         round(base * 0.06)::int as service_fee,
         30::int as cleaning_fee,
         (base + 30 + round(base * 0.06))::int as total_price
  from agg;
$$;
grant execute on function public.get_quote(text, date, date) to anon, authenticated;

-- ------------------------------------------------------------
-- 3. Visitor presence — lightweight live tracking (no PII, no IP)
-- ------------------------------------------------------------
create table if not exists public.visitor_pings (
  visitor_id uuid primary key,
  page       text not null,
  locale     text,
  user_agent_hash text, -- short hash to dedupe tabs without storing UA
  seen_at    timestamptz not null default now()
);
create index if not exists visitor_pings_seen_at_idx on public.visitor_pings (seen_at desc);

alter table public.visitor_pings enable row level security;

drop policy if exists visitor_pings_admin_read on public.visitor_pings;
create policy visitor_pings_admin_read on public.visitor_pings
  for select using (auth.jwt() ->> 'role' = 'service_role'
                 or exists (select 1 from public.admin_users where user_id = auth.uid()));

-- RPC to upsert a ping (called from API route via service role anyway, but
-- declared SECURITY DEFINER so the public anon role could call it directly
-- if we ever want to skip the API route)
create or replace function public.upsert_visitor_ping(
  p_visitor_id uuid,
  p_page       text,
  p_locale     text,
  p_ua_hash    text
) returns void
language plpgsql security definer set search_path = public as $$
begin
  insert into public.visitor_pings (visitor_id, page, locale, user_agent_hash, seen_at)
  values (p_visitor_id, left(p_page, 500), left(p_locale, 8), left(p_ua_hash, 32), now())
  on conflict (visitor_id) do update
    set page = excluded.page, locale = excluded.locale,
        user_agent_hash = excluded.user_agent_hash, seen_at = now();
end $$;
grant execute on function public.upsert_visitor_ping(uuid, text, text, text) to anon, authenticated;

-- Admin read of currently-active visitors (last 60s by default)
create or replace function public.active_visitors(p_seconds int default 60)
returns table (visitor_id uuid, page text, locale text, seen_at timestamptz)
language sql stable security definer set search_path = public as $$
  select visitor_id, page, locale, seen_at
    from public.visitor_pings
    where seen_at > now() - make_interval(secs => p_seconds)
    order by seen_at desc
$$;

-- Periodically prune (admin / cron / called inline from active_visitors)
create or replace function public.prune_visitor_pings()
returns void
language sql security definer set search_path = public as $$
  delete from public.visitor_pings where seen_at < now() - interval '1 hour';
$$;

-- ------------------------------------------------------------
-- 4. Daily booking aggregates (for charts) — convenient view
-- ------------------------------------------------------------
create or replace view public.booking_daily as
  select
    date_trunc('day', created_at)::date as day,
    cottage_id,
    status,
    count(*)::int                         as count,
    sum(total_price)::int                 as revenue,
    sum(check_out - check_in)::int        as nights
  from public.bookings
  group by 1, 2, 3
  order by 1 desc;

grant select on public.booking_daily to anon, authenticated;
