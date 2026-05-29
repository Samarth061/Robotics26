# Robotics Lab — Website

Internal website for the NC State Robotics Lab. Next.js 16 + TypeScript + Tailwind CSS v4, JSON-backed. Currently shipping **Phase 1** of a three-phase rollout.

---

## New collaborator? Start here.

Before touching code, read the four planning docs **in this order**. They live at the repo root and add up to about ten minutes of reading.

| # | File              | What it answers                                                    |
|---|-------------------|--------------------------------------------------------------------|
| 1 | `phase.md`        | The three-phase plan. **When** each feature lands.                 |
| 2 | `pages.md`        | The per-page spec. **What** each page contains and how it behaves. Also: the website-vs-Discord responsibility split. |
| 3 | `webflow.html`    | Visual sitemap. Open it in a browser — light/dark toggle in the corner. **How** the pages connect to each other. |
| 4 | This README       | **How** to run it and where to make changes.                       |

If you only have time for one, read **`pages.md`**. It encodes the canonical names, the data shapes, and the design feel.

### The plan in one screen

**Phase 1 — Static functional draft (this codebase).**
Goal: shareable site in days, no backend. Pages: Home · Members · Groups & Subgroups · Resources · Schedule · Join / Manage · Contact. Data lives in `data/*.json`. Submissions are Google Forms; meetings are a Google Calendar embed. No search/filter, no member-facing auth, no admin dashboard — with one narrow exception: a single password-gated admin tool, the group mailer at `/admin/email` (see `admin.md`).

**Phase 2 — Active internal hub.**
Adds: full Projects section with status / help-wanted cards, standalone resource submission form, paper presentation archive, beginner onboarding page, and search/filter across Members / Resources / Projects / Subgroups. Still no auth.

**Phase 3 — Self-service member platform.**
Adds: Supabase (Postgres + auth + storage), member profiles, admin dashboard, mailing-list export, Discord role sync.

**Core principle (from `pages.md`):** Website = source of truth (group structure, members, resources, schedule). Discord = daily activity (chat, debugging, polls, quick announcements). **Do not rebuild Discord inside the website.**

### Where to find what

| Looking for…                          | Look in                          |
|---------------------------------------|----------------------------------|
| The list of canonical subgroup names  | `pages.md` (Groups section) — those strings are authoritative for `data/subgroups.json` |
| What goes on each page                | `pages.md`                       |
| Phase boundaries (is this Phase 1 or Phase 2?) | `phase.md`              |
| The visual sitemap                    | `webflow.html`                   |
| What field a JSON file expects        | `types/index.ts`                 |
| The data accessors (used by every page) | `lib/data.ts`                  |
| The admin area (auth, deploy, mailer, scheduler) | `admin.md`            |
| The Supabase backend (meetings: setup, schema, RLS, env) | `supabase.md`    |

---

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static-export-friendly production build
npm start            # serve the built site (after npm run build)
```

Requires Node 20+.

### Admin area

There is a gated `/admin/*` section, protected by HTTP Basic Auth in `proxy.ts` and run from
`ADMIN_USER` / `ADMIN_PASS` env vars. It holds two tools: the **group mailer** (`/admin/email`)
and the **meeting scheduler** (`/admin/schedule`). To use it locally, copy `.env.example` to
`.env.local`, set the credentials, then `npm run dev`. The discreet entry point is a muted
"Admin" link in the site footer → `/admin`.

See **`admin.md`** for the full picture: the auth model, Vercel deploy steps, the mailer's
audience resolution + reusable compose layer, and the meeting scheduler.

### Supabase (meetings backend)

Meetings are stored in **Supabase** (the first slice of the Phase 3 backend), not in JSON. The
`/admin/schedule` tool reads and writes them. You need three server-side env vars:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   # reads (RLS-bound, safe to expose)
SUPABASE_SECRET_KEY=sb_secret_...                        # writes (admin actions) — never NEXT_PUBLIC_
```

(Uses Supabase's current key system — `sb_publishable_…` / `sb_secret_…` — and the plain
`@supabase/supabase-js` client, not `@supabase/ssr` since there's no user-session auth.)

One-time: create the project + `meetings` table + RLS, set the env vars, then migrate the
existing meetings and remove the stale JSON:

```bash
npm run seed:meetings        # imports data/meetings.json into Supabase (idempotent)
# verify in the Supabase table editor, then delete data/meetings.json
```

Full step-by-step (SQL, RLS policy, Vercel env, security model) is in **`supabase.md`**.

---

## Repo layout

```
rb-page/
├── app/                  Next.js App Router pages
│   ├── page.tsx          Home
│   ├── members/          Directory
│   ├── groups/           Groups index + [slug] subgroup detail
│   ├── resources/        Curated library
│   ├── schedule/         Calendar embed + upcoming + past meetings
│   ├── join/             Form-backed Join / Manage
│   ├── contact/          Form-backed Contact / Admins
│   ├── admin/            Gated tools (not in nav) — landing page + tools
│   │   ├── email/        Group mailer
│   │   └── schedule/     Meeting scheduler (Supabase CRUD: page, [id] edit, actions)
│   ├── layout.tsx        Header / Footer / fonts
│   └── globals.css       Tailwind + CSS variables (design tokens)
├── components/           Header, Footer, PageHeader, cards, embeds
│   ├── MailingListForm.tsx  Student-side subscribe/unsubscribe form
│   ├── MeetingForm.tsx      Admin add/edit meeting form (/admin/schedule)
│   └── ComposeLinks.tsx    Shared mailto/Gmail compose buttons (also used by /admin/email)
├── data/                 JSON source of truth (members, groups, resources…); meetings are in Supabase
├── lib/data.ts           Typed accessors (meeting accessors are async — read Supabase)
├── lib/mailto.ts         Compose-link builders (mailto / Gmail)
├── lib/supabase.ts       Supabase clients — server-only (read = anon, write = service-role)
├── proxy.ts              Basic Auth gate over /admin/*
├── scripts/seed-meetings.mjs  One-time meetings.json → Supabase migration
├── types/index.ts        Member, Group, Subgroup, Resource, Meeting…
├── .env.example          Admin credentials template (copy to .env.local)
├── admin.md              Admin area: auth, deploy, mailer, scheduler
├── supabase.md           Supabase backend: setup, schema, RLS, env, security
├── phase.md              Three-phase build plan
├── pages.md              Per-page spec + website/Discord split
└── webflow.html          Visual sitemap (open in browser)
```

---

## How to edit content

All site content lives in `data/*.json`. No code changes needed for routine updates.

### Add a member
Append a record to `data/members.json`. Required fields: `slug` (kebab-case), `name`, `groups` (`["ai"]`, `["mechatronics"]`, or both), `subgroups` (slugs from `data/subgroups.json`), `interests`. Optional: `email` (shown as a mailto link on the member card), `photo` (absolute URL — LinkedIn headshot, GitHub avatar, etc.; initials box shown when absent), `status` (`"graduated"` or `"high-school"` — renders a subtle tag), `links.{website,linkedin,github}`, `isAdmin`, `adminRole`.

### Add a resource
Append to `data/resources.json`. Set `subgroupSlug` to a valid slug — it then auto-appears on `/resources` (subgroup-grouped, newest first) **and** on `/groups/[that-slug]`. Flip `beginnerFriendly: true` to render the red "Beginner" tag.

### Add or move a meeting
Meetings now live in **Supabase**, not JSON. Add / edit / delete them from the gated
**`/admin/schedule`** tool — changes show on `/schedule` immediately. Each meeting has a track
(General / AI / Mechatronics), optional subgroup, and optional public join info (Zoom link and/or
meeting ID + passcode); the add form can repeat a meeting weekly or every two weeks. The Schedule
page leads with the next meeting + how to join, then Upcoming, then the Past archive, split by the
real current time in `lib/data.ts` (`Date.now()`, same in dev and prod). Backend setup is in
`supabase.md`; the tool itself in `admin.md`.

### Rename a subgroup
Edit `data/subgroups.json` (and the matching `subgroups` field in any affected `data/members.json` records). The `slug` is used in URLs (`/groups/<slug>`) — if you change a slug, prior links break, so prefer renaming the `name` only.

---

## Going live — drop real URLs

`data/lab.json` is the only file you should need to touch:

| field                   | what to put in                                        |
| ----------------------- | ----------------------------------------------------- |
| `discordInviteUrl`      | Permanent Discord invite (the "Discord →" button; also the join-info fallback on meetings) |
| `formUrls.contact`      | Google Form embed URL for the multi-category Contact  |
| `formUrls.submitResource` | Google Form URL the `/resources` "Submit a resource →" CTA links out to (see `resources-submission.md`) |
| `professor.name` / `professor.email` | Faculty lead — To: address on student mailing drafts and From: for `/admin/email` |

While `formUrls.contact` is empty, `FormEmbed` renders a styled placeholder — no rebuild needed when you add the URL. While `formUrls.submitResource` is empty, the Resources CTA falls back to linking the Contact page. The Join page (`/join`) uses a live `mailto:` form — no URL needed there. (`calendarEmbedUrl` is no longer rendered — the Schedule page was reworked to a next-meeting + upcoming + past view; `components/CalendarEmbed.tsx` is retained but unused.)

The upcoming/past split in `lib/data.ts` uses the real current time — no manual edit needed.

### Mailing list — how it works (student side)

The Join page hosts a live subscribe/unsubscribe form. **The site never sends mail.** When a student submits:

1. The page builds a pre-filled draft using `lib/mailto.ts`.
2. Clicking **"Open in Gmail"** or **"Open in mail app"** opens the draft in the student’s own email client.
3. The draft is addressed `To: professor email` and `Bcc: all 4 admin emails` (from `data/admins.json`).
4. The student reviews and hits Send — it arrives from their real `@ncsu.edu` address.

Admin emails are read from `data/admins.json` automatically. To add/change recipients, update that file — no code changes needed.

---

## Design tokens

CSS variables in `app/globals.css`, consumed by Tailwind v4 via `@theme`. Change them in one place, the whole site updates.

- `--color-paper` `--color-cream` — backgrounds (white-first, with a warm off-white surface)
- `--color-ink` `--color-mute` `--color-mute-light` — text
- `--color-rule` `--color-rule-strong` — hairlines
- `--color-red` (NC State #CC0000) `--color-red-deep` `--color-red-tint` — the one accent
- `--font-display` Fraunces · `--font-sans` Geist · `--font-mono` JetBrains Mono

Aesthetic notes: editorial / academic, hairline borders instead of shadows, monospace for kickers and metadata, one stagger-on-load animation, no scroll animations. See `pages.md` ("Design feel") for the full intent.

---

## Keep the planning docs in sync

The site has four docs that describe what *should* exist: `phase.md`, `pages.md`, `webflow.html`, and this README. They drift the moment someone ships a code change without also touching the matching doc — and once they drift, future contributors get conflicting answers depending on which file they read first.

**Rule:** when you change the site, update the doc in the same commit.

| If you change…                                | Update                                                                          |
|-----------------------------------------------|---------------------------------------------------------------------------------|
| Subgroup names or list                        | `pages.md` (canonical names), `data/subgroups.json`, affected `data/members.json` entries; redraw `webflow.html` if labels visibly changed |
| Pages added / removed / reordered             | `pages.md` (per-page spec), `webflow.html` (sitemap), `components/Header.tsx` (nav order) |
| Feature moved between phases                  | `phase.md` — restate which phase owns it, mention the move in the PR             |
| Website-vs-Discord split                      | `pages.md` "Core principle" + responsibility table                              |
| Meeting cadence, mission, institution name    | `data/lab.json` and any restatement in `pages.md`                               |
| New data field on Member / Resource / etc.    | `types/index.ts` + the matching component + a one-line note in `README.md` *Editing content* |
| Mobile nav changes                            | `components/Header.tsx` + note in `README.md` if the pattern changes                        |
| Admin area: auth gate, env vars, compose layer | `admin.md` (+ the `README.md` pointer); reflect a new gated page in `webflow.html` |
| Supabase: schema, RLS, env, a new table/feature | `supabase.md` (+ the `README.md` pointer) |
| Where meetings live (now Supabase, not JSON)  | `admin.md` / `supabase.md`; the `/admin/schedule` tool, not `data/*.json` |

Rule of thumb: **if you'd answer a question differently after your change than before, find the doc that gave the old answer and update it.**

## Out of scope for Phase 1

Member-facing auth · profile editing · admin dashboard · custom backend · search / filter UI · full Projects section with status cards · beginner onboarding page · paper presentation archive. Those are Phase 2 or Phase 3 — see `phase.md` and **resist building them now**, even if a member asks.

The one deliberate exception is the **gated group mailer** (`/admin/email`): a shared-password Basic Auth gate over a single admin tool, documented in `admin.md`. That is intentionally minimal — it is *not* the full per-user auth or admin dashboard, which remain out of scope.

---

## Quick contributor checklist

- [ ] Read `pages.md` and `phase.md`.
- [ ] Run `npm install && npm run dev`, click through every nav link.
- [ ] Edit content via `data/*.json` whenever possible — only touch components for genuine UI work.
- [ ] Match canonical subgroup names from `pages.md`.
- [ ] If you're adding a feature, confirm with the lab coordinator that it belongs in the current phase before opening a PR.
- [ ] **Update the planning docs in the same commit** if your change affects something they describe (see *Keep the planning docs in sync* above).
- [ ] `npm run build` and `npm run lint` must pass. (Lint uses ESLint flat config in `eslint.config.mjs` — Next 16 removed the built-in `next lint`.)
