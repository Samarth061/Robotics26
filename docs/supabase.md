# Supabase backend

The backend stores two things: **meetings** (public Schedule page + home next-meeting card, managed from `/admin/schedule`) and **resources** (public Resources page, managed from `/admin/resources`). Both are managed from the gated `/admin/*` tools and written via server actions using the secret key.

Why a database at all: the site is static-first and on Vercel the filesystem is read-only at
runtime, so an admin form **cannot** write `data/meetings.json` and have it persist. "Add a
meeting on the site → it shows on the site" needs storage outside git. See `phase.md` (Phase 3
names Supabase for exactly this) and `admin.md` (the scheduler tool).

> Supabase **Auth** is not used yet. `/admin/*` is still protected by the shared-password Basic
> Auth gate in `proxy.ts`. Replacing that with per-user Supabase Auth (e.g. Google sign-in
> allow-listing the professor) is a later Phase 3 step.

---

## One-time setup

### 1. Create the project
Create a project at supabase.com. We use Supabase's **current key system** (`sb_publishable_…`
/ `sb_secret_…`), not the legacy `anon`/`service_role` JWTs. From **Project Settings → API**:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **Publishable key** (`sb_publishable_…`) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. RLS-bound,
  safe to expose; powers public reads. (This is the new "anon" key.)
- **Secret key** (`sb_secret_…`, under "Secret keys" — reveal/create) → `SUPABASE_SECRET_KEY`.
  Bypasses RLS; server-only, never shipped to the browser. (This is the new "service_role" key.)

### 2. Create the `meetings` table + RLS
In the Supabase **SQL Editor**, run:

```sql
create table public.meetings (
  id              text primary key default gen_random_uuid()::text,
  date            timestamptz not null,
  presenter       text not null,
  topic           text not null,
  location        text not null,
  parent_group    text not null check (parent_group in ('general', 'ai', 'mechatronics')),
  paper_url       text,
  zoom_url        text,
  zoom_meeting_id text,
  zoom_passcode   text,
  subgroup_slug   text,
  slides_url      text,
  recording_url   text,
  created_at      timestamptz not null default now()
);

-- Row Level Security: the public site reads with the anon key; writes only ever
-- happen through the gated /admin/schedule server actions using the service-role
-- key, which bypasses RLS. So: allow anon SELECT, nothing else.
alter table public.meetings enable row level security;

create policy "public read meetings"
  on public.meetings for select
  to anon
  using (true);
```

Columns are snake_case (Postgres convention); they are mapped to the camelCase `Meeting` type
in `lib/data.ts` (`rowToMeeting`). `id` is `text` so the existing `m-2026-…` ids survive the
seed and new rows get a uuid.

**Already created the table from an earlier version?** Run this migration to add the Zoom
ID/passcode columns and allow the `general` track:

```sql
alter table public.meetings
  add column if not exists zoom_meeting_id text,
  add column if not exists zoom_passcode  text;

alter table public.meetings drop constraint if exists meetings_parent_group_check;
alter table public.meetings
  add constraint meetings_parent_group_check
  check (parent_group in ('general', 'ai', 'mechatronics'));
```

`general` is a club-wide meeting track — it's a meeting-only category (see `MeetingTrack` in
`types/index.ts`), **not** a real group, so it does not appear in `data/groups.json`, the
`/groups` pages, or the email mailer's audiences.

### 3. Set env vars
Locally, add to `.env.local` (gitignored — see `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

On **Vercel** → Settings → Environment Variables, add the same three for Production (and
Preview/Development as needed). The URL and publishable key are `NEXT_PUBLIC_` (safe to expose);
**`SUPABASE_SECRET_KEY` must stay non-public** (server-only). Redeploy after changing them.

### 4. Seed the existing meetings, then retire the JSON
```bash
npm run seed:meetings        # upserts data/meetings.json rows into Supabase (idempotent)
```
Verify the rows in the Supabase table editor, then **delete `data/meetings.json`** — Supabase
is the source of truth from then on. (`lib/data.ts` no longer imports it, so the file is already
inert; deleting it just removes the stale copy. It stays in git history.)

---

### 5. Create the `resources` table + RLS
In the Supabase **SQL Editor**, run:

```sql
create table public.resources (
  id                text primary key default gen_random_uuid()::text,
  title             text not null,
  type              text not null check (type in ('Paper','Video','Project','Tutorial','Dataset')),
  url               text not null,
  description       text not null default '',
  tags              text[] not null default '{}',
  recommended_by    text not null default '',
  date_added        date not null default current_date,
  subgroup_slug     text,
  beginner_friendly boolean not null default false,
  created_at        timestamptz not null default now()
);

-- Public reads; writes only via the gated /admin/resources server actions
-- using the secret key (which bypasses RLS).
alter table public.resources enable row level security;

create policy "public read resources"
  on public.resources for select
  to anon
  using (true);
```

Columns are snake_case; mapped to the camelCase `Resource` type in `lib/data.ts` (`rowToResource`).

### 6. Seed existing resources, then retire the JSON
```bash
npm run seed:resources       # upserts data/resources.json rows into Supabase (idempotent)
```
Verify in the Supabase table editor, then **delete `data/resources.json`** — Supabase is the
source of truth from then on.

## How the code uses it

- **`lib/supabase.ts`** (`server-only`) — two client factories. `supabaseRead()` (publishable
  key) for page reads, `supabaseWrite()` (secret key) for the admin write actions. Missing env
  vars throw immediately (fail-closed), mirroring the `proxy.ts` ethos.
- **`lib/data.ts`** — meetings: `allMeetings()`, `upcomingMeetings()`, `pastMeetings()`,
  `nextMeeting()`, `getMeeting(id)`. Resources: `allResources()`, `allResourcesForSubgroup(slug)`,
  `allResourcesGeneral()`, `getResource(id)`. All DB-backed and async; wrapped in React `cache()`
  so multiple page sections share one query per request.
- **Pages that read from Supabase** set `export const dynamic = "force-dynamic"` so they render
  per request and reflect changes immediately — no ISR/revalidation race.
- **Writes** live only in the respective `actions.ts` files under `/admin/schedule` and
  `/admin/resources`. They use `supabaseWrite()` (secret key) and call `revalidatePath` for the
  relevant public + admin paths after every change.

## Security notes
- The secret key (`SUPABASE_SECRET_KEY`) is server-only. `lib/supabase.ts` imports `server-only`,
  so any attempt to pull it into a client component fails the build. It is never in a
  `NEXT_PUBLIC_*` var.
- The publishable key is `NEXT_PUBLIC_` on purpose — it is RLS-bound and designed to be public.
  (In practice this app reads only server-side, so it never actually reaches the browser, but the
  prefix is harmless.)
- RLS allows only `SELECT` for the publishable/anon role. Even if the publishable key leaked, no
  one could write. Writes require the secret key, which lives only in the gated server actions.
- The write actions render/POST under `/admin/schedule`, covered by the `proxy.ts` matcher
  `"/admin/:path*"` — so the Basic Auth gate fronts them. They **also** re-verify the Basic Auth
  header inside the action (`assertAdmin()` in `actions.ts`): the secret key bypasses RLS and
  Next.js server actions are effectively public POST endpoints, so writes don't trust the path gate
  alone.
- Public reads degrade gracefully: `allMeetings()`, `allResources()`, and the single-row getters
  catch errors, log, and return empty/undefined rather than throwing — so a Supabase outage or the
  free-tier idle-pause can't 500 any public page.
