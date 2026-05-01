-- ============================================================
-- 0003 — payment columns on bookings (EveryPay integration)
-- Run in Supabase SQL Editor. Idempotent.
-- ============================================================

-- payment_state mirrors EveryPay's lifecycle (subset we care about)
do $$ begin
  if not exists (select 1 from pg_type where typname = 'payment_state') then
    create type payment_state as enum (
      'unpaid',         -- nothing initiated yet
      'initiated',      -- payment row created on EveryPay, waiting for customer
      'pending',        -- customer interacting (3DS / OB)
      'paid',           -- 'settled' on EveryPay side
      'failed',         -- declined / failed
      'abandoned',      -- timed out, customer did not finish
      'refunded',       -- refunded after paid
      'voided'          -- cancelled before settle
    );
  end if;
end $$;

alter table public.bookings
  add column if not exists payment_state         payment_state not null default 'unpaid',
  add column if not exists payment_reference     text,                     -- EveryPay's id
  add column if not exists payment_provider      text default 'everypay',
  add column if not exists payment_link          text,                     -- redirect URL
  add column if not exists payment_initiated_at  timestamptz,
  add column if not exists payment_paid_at       timestamptz,
  add column if not exists payment_raw           jsonb;                    -- last full response (debug)

create unique index if not exists bookings_payment_reference_key
  on public.bookings (payment_reference)
  where payment_reference is not null;

-- ------------------------------------------------------------
-- Helper RPC: try_create_booking_v2 — returns booking, also stores
-- 'unpaid' payment_state by default. (No behavioural change yet, the
-- server action will call this and then init payment in a 2nd step.)
-- ------------------------------------------------------------
-- We just keep using the existing try_create_booking; payment is
-- set up by the server action AFTER booking insert succeeds.

-- Convenience view for admin
create or replace view public.bookings_with_payment as
  select b.*,
         (b.payment_state = 'paid')                                     as is_paid,
         extract(epoch from (now() - b.payment_initiated_at))::int      as seconds_since_init
    from public.bookings b;

grant select on public.bookings_with_payment to authenticated;
