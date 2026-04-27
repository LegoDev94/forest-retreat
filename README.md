# Forest Retreat

Booking site for the only deer park in Latvia. Next.js 14 (App Router) + Supabase + Vercel.

## Stack
- **Next.js 14** App Router, React 18, framer-motion, Lenis smooth scroll
- **Supabase** Postgres + RPC + RLS (booking + admin)
- **Resend** for email notifications (optional)
- **Vercel** hosting

## Local development

```bash
npm install
cp .env.local.example .env.local
# fill in Supabase URL / keys (see "First-time Supabase setup" below)
npm run dev
```

Open <http://localhost:3000>.

## First-time Supabase setup (5 min)

1. Go to <https://app.supabase.com> and create a new project.
2. After it's ready, **Project Settings → API** — copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret)
3. **SQL Editor** → New query → paste the contents of [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql) → **Run**.
   This creates the `cottages`, `bookings`, `date_overrides`, `admin_users` tables, the booking RPC, and RLS policies.
4. Add the three env vars to **Vercel → Project Settings → Environment Variables** (Production + Preview + Development).
5. Redeploy.

## Granting admin access

After someone signs up via Supabase Auth (email/password or magic link), promote them to admin:

```sql
insert into public.admin_users (user_id, email, role)
select id, email, 'admin'
from auth.users
where email = 'you@yourdomain.com';
```

## Resend (optional)

To send real emails on booking:

1. <https://resend.com> → create account → **API Keys** → new key → set `RESEND_API_KEY`.
2. (Optional) Verify your sending domain → set `RESEND_FROM` to a `you@yourdomain.com` address.
3. Without an API key, the app falls back to logging email content to the server console — useful for dev.

## Project structure

```
app/
├── layout.jsx                 root html/body, fonts
├── page.jsx                   redirects / → /[locale]
├── [locale]/
│   ├── layout.jsx             provider, atmosphere, nav, footer
│   ├── page.jsx               home (server) — generateMetadata + JSON-LD
│   └── cottage/[id]/
│       └── page.jsx           cottage detail (SSG, 12 prerendered pages)
├── api/
│   └── availability/[id]/
│       └── route.js           GET disabled date ranges
└── actions/
    └── booking.js             createBooking server action

components/                    all React components
lib/
├── data.js                    static cottage data
├── dict.js                    i18n dictionary (no React, server-importable)
├── i18n.jsx                   LocaleProvider, useT, LocaleLink
├── availability.js            date helpers, quote calc
├── email.js                   Resend wrapper
└── supabase/
    ├── server.js              service-role client (server only)
    └── browser.js             anon-key client (RLS-protected)

supabase/
└── migrations/
    └── 0001_init.sql          schema + RPC + RLS
```

## Locales

- URL pattern: `/[locale]/...` where locale ∈ `ru`, `lv`, `en`
- Default locale: detected from `Accept-Language` header, then defaults to `ru`
- Persisted in `NEXT_LOCALE` cookie

## Booking flow

1. User picks dates in `<DateField>` — booked dates are visually disabled (red strikethrough).
2. Form submit calls `createBooking` server action.
3. Server action calls Postgres RPC `try_create_booking` which:
   - Locks overlapping bookings (`SELECT … FOR UPDATE`)
   - Re-checks for conflicts atomically
   - Inserts the booking or raises `BOOKING_CONFLICT`
4. On success, fires email notifications (guest + host) via Resend.
5. Frontend re-fetches availability so the calendar updates.

## Deploy

Pushed to GitHub → Vercel auto-builds. Make sure all `NEXT_PUBLIC_*` and server env vars are set in Vercel project settings, then redeploy.
