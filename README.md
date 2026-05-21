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
Goal: shareable site in days, no backend. Pages: Home · Members · Groups & Subgroups · Resources · Schedule · Join / Manage · Contact. Data lives in `data/*.json`. Submissions are Google Forms; meetings are a Google Calendar embed. No auth, no admin dashboard, no search/filter.

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

---

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static-export-friendly production build
npm start            # serve the built site (after npm run build)
```

Requires Node 20+.

---

## Repo layout

```
rb-page/
├── app/                  Next.js App Router pages
│   ├── page.tsx          Home
│   ├── members/          Directory
│   ├── groups/           Groups index + [slug] subgroup detail
│   ├── resources/        Curated library
│   ├── schedule/         Calendar embed + past meetings
│   ├── join/             Form-backed Join / Manage
│   ├── contact/          Form-backed Contact / Admins
│   ├── layout.tsx        Header / Footer / fonts
│   └── globals.css       Tailwind + CSS variables (design tokens)
├── components/           Header, Footer, PageHeader, cards, embeds
├── data/                 Single source of truth (JSON, edit by PR)
├── lib/data.ts           Typed accessors
├── types/index.ts        Member, Group, Subgroup, Resource, Meeting…
├── phase.md              Three-phase build plan
├── pages.md              Per-page spec + website/Discord split
└── webflow.html          Visual sitemap (open in browser)
```

---

## How to edit content

All site content lives in `data/*.json`. No code changes needed for routine updates.

### Add a member
Append a record to `data/members.json`. Required fields: `slug` (kebab-case), `name`, `groups` (`["ai"]`, `["mechatronics"]`, or both), `subgroups` (slugs from `data/subgroups.json`), `interests`. Optional: `links.{website,linkedin,github}`, `isAdmin`, `adminRole`.

### Add a resource
Append to `data/resources.json`. Set `subgroupSlug` to a valid slug — it then auto-appears on `/resources` (subgroup-grouped, newest first) **and** on `/groups/[that-slug]`. Flip `beginnerFriendly: true` to render the red "Beginner" tag.

### Add or move a meeting
`data/meetings.json`. The list auto-splits into "Upcoming" (Schedule page) and "Past meetings archive" based on a fixed "now" of `2026-05-21` set in `lib/data.ts` as `NOW_ISO`. **When the site goes live, replace `NOW_ISO` with `new Date()` in `lib/data.ts`** so the cutoff tracks real time.

### Rename a subgroup
Edit `data/subgroups.json` (and the matching `subgroups` field in any affected `data/members.json` records). The `slug` is used in URLs (`/groups/<slug>`) — if you change a slug, prior links break, so prefer renaming the `name` only.

---

## Going live — drop real URLs

`data/lab.json` is the only file you should need to touch:

| field                   | what to put in                                        |
| ----------------------- | ----------------------------------------------------- |
| `discordInviteUrl`      | Permanent Discord invite (the "Discord →" button)     |
| `calendarEmbedUrl`      | Google Calendar `embed` URL (Schedule page)           |
| `formUrls.join`         | Google Form embed URL for the Join / Manage page      |
| `formUrls.contact`      | Google Form embed URL for the multi-category Contact  |

While any of these are empty, `FormEmbed` and `CalendarEmbed` render a styled placeholder card so the layout doesn't break. Swap in the URL and the iframe replaces the placeholder — no rebuild logic to change.

Also: flip `NOW_ISO` in `lib/data.ts` to `new Date()` (see *Add or move a meeting* above).

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

Rule of thumb: **if you'd answer a question differently after your change than before, find the doc that gave the old answer and update it.**

## Out of scope for Phase 1

Auth · profile editing · admin dashboard · custom backend · search / filter UI · full Projects section with status cards · beginner onboarding page · paper presentation archive. Those are Phase 2 or Phase 3 — see `phase.md` and **resist building them now**, even if a member asks.

---

## Quick contributor checklist

- [ ] Read `pages.md` and `phase.md`.
- [ ] Run `npm install && npm run dev`, click through every nav link.
- [ ] Edit content via `data/*.json` whenever possible — only touch components for genuine UI work.
- [ ] Match canonical subgroup names from `pages.md`.
- [ ] If you're adding a feature, confirm with the lab coordinator that it belongs in the current phase before opening a PR.
- [ ] **Update the planning docs in the same commit** if your change affects something they describe (see *Keep the planning docs in sync* above).
- [ ] `npm run build` must pass.
