-- ============================================================
-- 0004 — guest user accounts (auto-created on booking)
-- Login with phone + auto-generated password.
-- Run in Supabase SQL Editor. Idempotent.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Profiles — extra columns linked to auth.users
-- ------------------------------------------------------------
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  phone      text unique,                 -- normalized: digits only, with country code
  full_name  text,
  email      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_phone_idx on public.profiles (phone);

-- updated_at trigger (touch_updated_at exists from 0001)
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- 2. Link bookings → users
-- ------------------------------------------------------------
alter table public.bookings
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists bookings_user_id_idx on public.bookings (user_id);

-- ------------------------------------------------------------
-- 3. RLS — guests can read their own profile + their own bookings
-- ------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists profiles_self_read   on public.profiles;
drop policy if exists profiles_self_update on public.profiles;
drop policy if exists profiles_admin_all   on public.profiles;

create policy profiles_self_read on public.profiles
  for select using (user_id = auth.uid());
create policy profiles_self_update on public.profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy profiles_admin_all on public.profiles
  for all using (auth.jwt() ->> 'role' = 'service_role'
              or exists (select 1 from public.admin_users where user_id = auth.uid()));

-- bookings already has admin policy. Add a per-user read policy.
drop policy if exists bookings_self_read on public.bookings;
create policy bookings_self_read on public.bookings
  for select using (user_id = auth.uid());

-- ------------------------------------------------------------
-- 4. Helper: lookup email by phone (used by login flow)
-- ------------------------------------------------------------
create or replace function public.email_for_phone(p_phone text)
returns text language sql stable security definer set search_path = public as $$
  select u.email
    from public.profiles p
    join auth.users u on u.id = p.user_id
    where p.phone = p_phone
    limit 1
$$;
grant execute on function public.email_for_phone(text) to anon, authenticated;

-- ------------------------------------------------------------
-- 5. RPC: link an existing user to a booking by phone (best-effort)
-- ------------------------------------------------------------
create or replace function public.attach_booking_to_user(
  p_booking_id uuid,
  p_user_id    uuid
) returns void
language sql security definer set search_path = public as $$
  update public.bookings set user_id = p_user_id where id = p_booking_id;
$$;
