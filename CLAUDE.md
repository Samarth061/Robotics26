# CLAUDE.md

Project context for Claude Code sessions in this directory. Read this first.

## What this is

The internal website for the NC State Robotics Lab — Next.js 16 + TypeScript + Tailwind v4, JSON-backed, static-first. The repo is a working **Phase 1** build of a three-phase plan.

## Read first (in order)

When the task touches structure, content, or design decisions, read these before editing. They live at the repo root.

1. **`pages.md`** — per-page spec, canonical subgroup names, website-vs-Discord responsibility split. Most authoritative doc.
2. **`phase.md`** — three-phase rollout. Tells you whether a feature belongs to Phase 1 (now), Phase 2 (later), or Phase 3 (much later).
3. **`webflow.html`** — visual sitemap. Open in a browser to see how pages connect; has a light/dark toggle.
4. **`README.md`** — how to run, where to drop real Google Form / Calendar URLs, repo layout.
5. **`admin.md`** — only when the task touches the gated `/admin/*` area: the Basic Auth gate (`proxy.ts`), env vars, Vercel deploy, the group mailer, and the meeting scheduler.
6. **`supabase.md`** — only when the task touches the Supabase backend (meetings): project setup, the `meetings` table schema + RLS, env vars, `lib/supabase.ts` clients, and the seed script.
7. **`resources-submission.md`** — only when the task touches the resource submission flow: the Google Form, the routing Apps Script, the `npm run import:resources` script, and the "approve = commit" publishing model.

If the task is a one-line content edit (e.g. add a member), you can skip 2–7 and go straight to `data/*.json`.

## Current stage

- **Phase 1 — shipped.** All 7 pages live, 20 routes statically generated, `npm run build` clean. Form / Calendar embeds render styled placeholders until URLs are filled into `data/lab.json`.
- **Phase 2 — not started.** Adds the full Projects section with status / help-wanted, paper presentation archive, beginner onboarding page, search/filter across Members and Resources, standalone resource submission form.
- **Phase 3 — backend started.** Supabase (Postgres) is now stood up for one feature (the meeting scheduler, below); member self-serve profiles, the broader admin dashboard, Supabase **Auth**, and Discord role sync remain unbuilt.

- **Admin area (out of phase).** Two gated tools live under `/admin/*`, behind a shared-password Basic Auth gate (`proxy.ts`, `ADMIN_USER`/`ADMIN_PASS`), reachable via a discreet footer link → `/admin` landing page (not in nav): the **group mailer** (`/admin/email`, built on `lib/mailto.ts` + `components/ComposeLinks.tsx`) and the **meeting scheduler** (`/admin/schedule`, below). This is a deliberate narrow exception to the "no auth in Phase 1" rule — full per-user auth remains unbuilt. See `admin.md`.

- **Meeting scheduler + Supabase (Phase 3 pulled forward).** `/admin/schedule` lets the faculty lead add/edit/delete meetings; they persist in a **Supabase** `meetings` table — now the source of truth, replacing `data/meetings.json`. The public `/schedule` page (next-meeting hero + upcoming + past; the Google Calendar embed was dropped) and home next-meeting card read from Supabase (meeting accessors in `lib/data.ts` are async; those pages are `force-dynamic`). Writes use a secret-key client (`lib/supabase.ts`) from gated server actions. A meeting's track is `MeetingTrack` = `general` (lab-wide, default) | `ai` | `mechatronics` — **"general" is meeting-only, not a real group** (keeps `GroupSlug`/membership/mailer untouched). Join info (Zoom link / meeting ID / passcode) is optional and public; meetings can repeat weekly/biweekly. See `supabase.md` and `admin.md`.

- **Resource submission (pulled forward from Phase 2).** A submit flow now exists: a `/resources` CTA links out to a Google Form; an admin reviews and publishes by running `npm run import:resources <csv>` (exported from the responses Sheet) and committing the new `data/resources.json` entries. No backend — "approve" = a git commit. See `resources-submission.md`.

Before building a new feature, check `phase.md` to confirm which phase it belongs to. Do not silently pull Phase 2/3 work into the codebase — flag it to the user and ask.

## Hard rules

1. **Website = source of truth. Discord = daily activity.** Do not add chat, polls, real-time announcements, role pickers, or anything that duplicates Discord. (See `pages.md` "Core principle".)
2. **Canonical names live in `pages.md`.** Match those strings exactly when editing `data/subgroups.json`, member subgroup affiliations, etc. `webflow.html` uses display abbreviations to fit boxes — don't copy from it as source of truth.
3. **Emails stay internal.** `Member.email` is intentionally not rendered on `MemberCard`. Don't add it to public pages. Public visitors reach members via the Contact form.
4. **Single source of truth = `data/*.json`** — **except meetings**, which now live in **Supabase** (managed via `/admin/schedule`; `data/meetings.json` is retired). Everything else (members, groups, subgroups, resources, lab, admins) is still JSON. Page components read all of it via `lib/data.ts`. Add JSON content by editing the files, not by hardcoding into components; add/change meetings through the admin tool, not by hand. See `supabase.md`.
5. **Phase discipline.** If a request fits Phase 2 or 3, name the phase and ask the user before proceeding. Useful Phase-2 features (filters, project status cards, submission forms) are tempting — resist building them inside Phase 1.
6. **Keep the planning docs in sync.** When code or content changes, update the matching doc in the *same* change so the docs don't drift from reality. Specifically:
   - Renaming or adding a subgroup → update `pages.md` (canonical names list), `data/subgroups.json`, any affected `data/members.json` entries, and consider whether `webflow.html` needs a redraw.
   - Adding, removing, or moving a page → update `pages.md` (per-page spec), `webflow.html` (sitemap), and the nav list in `components/Header.tsx`.
   - Pulling a feature forward into an earlier phase (or pushing one back) → update `phase.md` so the phase boundaries stay honest. Mention the move in the PR/commit.
   - Changing the website-vs-Discord split → update the "Core principle" + responsibility table in `pages.md`.
   - Changing the meeting cadence, mission, or institution → update `data/lab.json` (the rendered surface) **and** `pages.md` if the cadence is restated there.

   Rule of thumb: if you'd answer a question differently after your change than before, find which doc would have given the old answer and update it.

## Tech quick reference

- Next.js 16 (App Router), React 19, TypeScript strict, Tailwind v4. Theme tokens declared via `@theme` in `app/globals.css` — there is no `tailwind.config.ts`.
- Fonts via `next/font/google`: Fraunces (display), Geist (sans), JetBrains Mono (mono). CSS-var names: `--font-display`, `--font-sans`, `--font-mono`.
- Color tokens in `app/globals.css`: `--color-paper`, `--color-cream`, `--color-ink`, `--color-mute`, `--color-rule`, `--color-red` (#CC0000 — NC State accent, used sparingly), `--color-red-deep`, `--color-red-tint`.
- Data flow: `data/*.json` → typed accessors in `lib/data.ts` → page components. Types live in `types/index.ts`. **Meetings are the exception**: they come from Supabase via async accessors in `lib/data.ts` (`upcomingMeetings`/`pastMeetings`/`nextMeeting`/`getMeeting`) backed by `lib/supabase.ts`. Pages that read them (`/schedule`, `/`, `/admin/schedule`) are `force-dynamic`.
- Supabase backend (meetings only) — server-only clients in `lib/supabase.ts` (`supabaseRead` = publishable key, `supabaseWrite` = secret key), using the current key system. Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (RLS-bound, public-safe), `SUPABASE_SECRET_KEY` (never `NEXT_PUBLIC_`). Plain `@supabase/supabase-js`, not `@supabase/ssr` (no user-session auth). Full setup in `supabase.md`.
- The "now" cutoff that splits upcoming vs past meetings uses the real current time (`Date.now()`, read per call) inside `upcomingMeetings`/`pastMeetings` in `lib/data.ts` — same in dev and prod.

## When in doubt

Ask the user. Especially for: anything that looks like Phase 2/3, anything that touches member privacy (emails, photos), anything that would change canonical names or URL slugs.
