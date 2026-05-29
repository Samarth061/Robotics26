# Admin area

Reference for the gated `/admin/*` section of the site. Its landing page is `/admin` — a
small dashboard that lists the available tools. Today there are two: the **group mailer** at
`/admin/email` and the **meeting scheduler** at `/admin/schedule`. This doc covers how the area
is protected, how to run and deploy it, how each tool works, and the shared pieces future tools
should reuse.

The admin area is **not linked from the site nav**. The only in-site entry point is a
discreet, muted **"Admin" link in the footer bottom bar** (`components/Footer.tsx`, styled
like the `©` line) that points to the `/admin` landing page. That link is intentionally
visible-but-quiet: the Basic Auth gate below — not secrecy — is what protects the area, so a
findable link is safe and keeps access simple for the faculty lead. To add a future tool,
append a tile to the `tools` array in `app/admin/page.tsx`. The area is still reachable by
typing the URL directly, but no one needs to.

---

## Access / auth model

`/admin/*` is protected by HTTP Basic Auth in `proxy.ts` (Next.js 16's middleware
convention). It checks one shared credential pair from environment variables:

```
ADMIN_USER=...
ADMIN_PASS=...
```

- **Shared credential, not per-user.** Anyone given these values can use the area; the gate
  does not identify *who* is signing in. Today that is intended for the faculty lead.
- **Fail-closed.** If either variable is unset, `/admin/*` returns `503` (locked) — it never
  falls open to the public.
- **Needs a server.** Because it relies on middleware, the admin area only works when the
  site runs as a Node server (`next start`, or a platform like Vercel). It does not work
  under a static export.

> Never commit real credentials. `.env.local` is gitignored; `.env.example` holds placeholders
> only. Treat the password like any other secret.

---

## Local setup

```bash
cp .env.example .env.local   # then edit the two values
npm run dev
```

Visit `/admin/email` and the browser will prompt for the Basic Auth credentials.

---

## Deploy (Vercel)

`.env.local` is not committed, so the host needs the variables set explicitly:

1. Project → **Settings → Environment Variables**.
2. Add `ADMIN_USER` and `ADMIN_PASS` (select **Production**, **Preview**, and **Development**
   as needed — Preview deploys without them will simply return `503` on `/admin/*`).
3. **Redeploy** — env-var changes take effect only on a new deployment.

---

## The group mailer — `/admin/email`

Lets the faculty lead email a chosen audience:

- **Entire org** — all members with an email.
- **A group** (AI / Mechatronics) — `membersInGroup(slug)` **plus** `membersInBothGroups()`,
  so dual-group members are included (note `membersInGroup` excludes them by design).
- **A single subgroup** — `membersInSubgroup(slug)`.

All audience resolution uses the existing accessors in `lib/data.ts`; the "From" address is
`lab.professor.email` from `data/lab.json`.

**The site sends nothing itself.** The page builds a pre-filled draft and opens it in the
sender's own mail app (`mailto:`) or browser Gmail, with the audience in **Bcc** (hidden from
each other) and the professor in **To**. The sender reviews and sends it from their own
account, so the message genuinely originates from a real `@ncsu.edu` address — something a
server-side API (Resend, SES, …) cannot do, since it can't authenticate as `ncsu.edu`.

---

## The meeting scheduler — `/admin/schedule`

Lets the faculty lead **add, edit, and delete club meetings** from the website. Changes show on
the public `/schedule` page (and the home next-meeting card) immediately — no code edit, no
redeploy.

Unlike the mailer (which sends nothing and writes nothing), this tool **persists data**. It is
backed by **Supabase** — the first slice of the Phase 3 backend. Meetings used to live in
`data/meetings.json`; they now live in a Supabase `meetings` table, which is the single source
of truth. Full backend setup (project, table SQL, RLS, env vars, seed script) is in
**`supabase.md`** — read that to stand the database up.

How it fits together:

- **`/admin/schedule`** (`app/admin/schedule/page.tsx`) — an "Add meeting" form plus a list of
  upcoming and past meetings, each with **Edit** (`/admin/schedule/[id]`) and **Delete**.
- **`components/MeetingForm.tsx`** — the reused add/edit form: presenter, topic, date & time,
  **group** (defaults to **General / club-wide**; AI or Mechatronics optionally narrow to a
  subgroup), a **How to join** section (location + Zoom link + Zoom meeting ID + passcode — all
  optional and **shown publicly**, so the form says so), and paper URL. When *creating*, a
  **Repeat** control (none / weekly / every-2-weeks × N times) generates that many independent
  meetings (kept at the same wall-clock time across DST); it's hidden when editing.
- **`app/admin/schedule/actions.ts`** — `saveMeeting` (insert or update) and `deleteMeeting`
  server actions. They validate input, write via the **secret-key** Supabase client
  (`supabaseWrite()` in `lib/supabase.ts`), and `revalidatePath` `/schedule`, `/`, and
  `/admin/schedule`. They run under `/admin/schedule`, so the Basic Auth gate fronts them — **and**
  each action independently re-checks the Basic Auth header (`assertAdmin()`) before writing, since
  the secret key bypasses RLS and Next.js server actions are effectively public POST endpoints.
- The public pages read with the **publishable-key** client (`supabaseRead()`); RLS allows public
  SELECT. Read failures degrade gracefully (the accessors return an empty list and log), so a
  Supabase outage never 500s the public Schedule page or home card.

A `datetime-local` value is interpreted as NC State wall-clock time (America/New_York) and stored
with that zone's explicit offset (e.g. `…T16:00:00-04:00`), matching the original data format.

## Reusable compose layer

The mailer is built on two dependency-free pieces meant to be shared:

- **`lib/mailto.ts`** — pure URL builders: `buildMailtoUrl`, `buildGmailComposeUrl`
  (Gmail uses `su` for the subject), and `dedupeEmails`.
- **`components/ComposeLinks.tsx`** — the *Open in Gmail · Open in mail app · Copy addresses*
  buttons. Props: `{ to?, cc?, bcc?, subject?, body? }`.

Any future mailer — e.g. a "mail the admins" feature, wherever it ends up living — should
reuse these rather than re-implement. It only needs to pass a recipient array.

---

## Current behavior & open access-model

As built, the area is a **shared-password gate** and the mailer hardcodes the professor as the
draft's From/To. That is neither enforced "only the professor" nor "any admin sends as
themselves." If the access model needs to change, the likely options are:

- **Any admin, sends as themselves** — keep the shared gate but drop the hardcoded From/To so
  each admin's own account is the sender.
- **Only a specific person** — replace the shared password with real per-user auth (e.g.
  Google sign-in allow-listing a specific address). This would slot in behind the same
  `/admin/*` routes without changing the pages.

This is recorded as the current state, not a committed decision.

---

## Security caveats

- The gate uses a single shared secret with no per-user audit trail.
- Member emails live in `data/members.json`, which is bundled into any page that imports it.
  The gate protects the **tool**, not the email addresses globally — those may be reachable
  elsewhere in the client bundle regardless. Worth a separate pass if email privacy becomes a
  requirement.
