-- ============================================================
-- Forest Retreat — Lodgify channel-manager sync
-- Idempotent: safe to re-run.  Run in Supabase SQL Editor.
-- ============================================================

-- 1. Provenance + external ID on bookings
alter table public.bookings
  add column if not exists source     text not null default 'direct',
  add column if not exists lodgify_id text;

-- Unique constraint over lodgify_id (NULLs are distinct in Postgres,
-- so multiple direct bookings without a Lodgify mirror are fine).
do $$ begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'bookings_lodgify_id_unique' and conrelid = 'public.bookings'::regclass
  ) then
    alter table public.bookings
      add constraint bookings_lodgify_id_unique unique (lodgify_id);
  end if;
end $$;

create index if not exists bookings_source_idx on public.bookings (source);

-- 2. Backfill: any existing rows are direct (default already handles this,
-- but be explicit for clarity on re-runs of older data).
update public.bookings set source = 'direct' where source is null;
