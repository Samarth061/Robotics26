# Page Spec — Robotics Lab Website

## Core principle

**Website = source of truth.** Group structure, members, resources, schedule, projects.
**Discord = daily activity.** Chat, debugging, polls, quick announcements, casual sharing.

Do not rebuild Discord inside the website.

---

## Pages

### Home — landing for everyone
Quick intro and routing.

- Lab/club name + one-line mission
- The two tracks: AI · Mechatronics
- **Next meeting card** (date, presenter, topic, link)
- Three CTAs: Join the lab · Discord invite · Contact admins

One landing page for both internal members and new visitors. Functional, not flashy.

### Members — directory
Three buckets:
- AI Group
- Mechatronics Group
- Members in both groups (cross-listed, **not duplicated**)

Each card: name · photo (or initials placeholder) · email (mailto link) · interest/subgroup tags · optional personal site, LinkedIn, GitHub · optional status tag (Graduated / High School).

Email policy: emails are shown on member cards to make it easy to reach people. Emails are not collected from visitors — outbound contact goes through the contact form.

### Groups & Subgroups — what each group does
Two top groups, each with subgroup pages.

> **Canonical names.** The subgroup strings below are the source of truth for the JSON data file. `webflow.html` uses display-shortened versions to fit its boxes — those are abbreviations only, not new names.

**AI:** Large Language Models / Transformers · Vision Language Models
**Mechatronics:** CNC · Space Mouse · RC Car · Drone · Self-balancing Hoverboard · Go-Kart · Robotic Arm 6DoF · Antenna Arrays for Obstacle Detection · Localization (laser / radio beams)

Every subgroup page uses the same layout:
- Description
- Members
- Current papers / resources
- Projects
- Discord channel link
- Join / manage button

### Resources — organized library
Mirrors the Groups taxonomy **1:1** — one resources section per subgroup, all nine Mechatronics subgroups and both AI subgroups represented. Resources not tied to a subgroup render in a **General · Lab-wide** section at the top (`Resource.subgroupSlug` is optional).

Each resource card:
- Title · Type (Paper / Video / Project / Tutorial / Dataset) · Link
- Short description · Tags
- Recommended by · Date added
- "Beginner friendly" flag

**Submitting a resource.** A "Submit a resource →" CTA links out to a Google Form (URL in `data/lab.json → formUrls.submitResource`). Submissions land in a Google Sheet and notify admins; an admin publishes an approved one by running `npm run import:resources <csv>` and committing the result. Full flow — form spec, routing Apps Script, import script, "approve = commit" model — lives in `resources-submission.md`.

### Schedule — meetings and presentations
Meetings are **stored in Supabase** and managed by the faculty lead from the gated
`/admin/schedule` tool (add / edit / delete) — see `admin.md` + `supabase.md`. They used to live
in `data/meetings.json`, which is now retired. The page renders dynamically so changes show
immediately. The Google Calendar embed has been **dropped** (it was an unused placeholder); the
page is now a focused "what's next + how to join" view.

Layout (top → bottom), reusing the existing visual language:
- **Next meeting (hero)** — the soonest meeting headlined with date/time, topic, presenter, and
  **how to join** (Zoom button and/or meeting ID + passcode). If a meeting has no public join info,
  a subtle fallback line points to Discord / Contact instead.
- **§ 01 Upcoming** — the remaining upcoming meetings (split against the real current time in `lib/data.ts`).
- **§ 02 Past meetings archive** — from Supabase.

Per meeting: date · presenter · topic · (subgroup, if any) · location · join affordance.

**Meeting track.** Each meeting is **General (lab-wide, the default)**, **AI**, or **Mechatronics**;
only AI/Mech meetings can name a subgroup. "General" is a *meeting-only* category (`MeetingTrack`),
**not** a real group — it never appears in the Groups pages or the email mailer.

**Join info is optional + public.** The site is public, so Zoom link / ID / passcode are shown
only when the professor fills them in (blank = nothing exposed). Recurring meetings: the add form
can repeat weekly or every-2-weeks for N times.

Cadence: Friday 4:00 PM, biweekly.

### Join / Manage Preferences — actions
Primary action: **mailing list subscribe / unsubscribe** via a live form.

The form (`components/MailingListForm.tsx`) collects: action (Subscribe / Unsubscribe) · full name · email · group interest (subscribe only) · optional note. On submit, clicking "Open in Gmail" or "Open in mail app" opens a pre-filled draft in the student’s own email client:
- **To:** professor (`data/lab.json → professor.email`)
- **Bcc:** all admins with an email in `data/admins.json`

The site never sends mail itself. Student reviews the draft and hits Send from their own `@ncsu.edu` account.

A **"Unsubscribe" quick-action banner** at the top of the page anchors directly to the form.

Other membership actions (join a group, switch groups, request Discord access) are listed in the sidebar and route to the Contact page for now. Phase 3 replaces this with a self-serve profile.

### Contact / Admins — routing hub
Single contact form with a category dropdown:
- Join the group
- Update my group / subgroup
- Submit a resource *(now has its own Google Form — see Resources; this category remains as a fallback)*
- Submit a project
- Ask an admin question
- Report a website issue

Also list: admin name · email (shown as clickable mailto link) · Discord handle. All four are equal admins — no per-category routing yet, so every submission reaches all of them.

### Admin (gated, not in public nav)
`/admin` is the landing page for the gated admin area — a simple dashboard listing the
available tools (today just the group mailer; future tools get added as tiles). The whole
`/admin/*` subtree sits behind HTTP Basic Auth (`proxy.ts`, `ADMIN_USER` / `ADMIN_PASS`).
It is **not** in the header nav; the only in-site entry point is a discreet, muted **"Admin"
link in the footer bottom bar** (styled like the `©` line) pointing to `/admin`. Visibility
is harmless — the password gate, not secrecy, is what protects the area.

`/admin/email` — **Group mailer.** Lets the faculty lead pick an audience (entire org · a
group · a single subgroup) and open a **pre-filled draft** in their own mail app or Gmail,
recipients in Bcc. The site sends nothing itself; the message goes out from the sender's real
`@ncsu.edu` account. Built on the reusable `lib/mailto.ts` + `components/ComposeLinks.tsx`
primitives, so any future mailer (e.g. mail-to-admins) can reuse the same compose buttons.

`/admin/schedule` — **Meeting scheduler.** Add / edit / delete lab meetings; changes appear on
the public Schedule page immediately. This is the first **Supabase**-backed feature (the meetings
table is the source of truth, replacing `data/meetings.json`) and the first slice of the Phase 3
backend pulled forward. Full details — auth model, deploy, security caveats, Supabase setup —
live in `admin.md` and `supabase.md`.

---

## Website vs Discord — responsibility split

| Belongs on Website                | Belongs on Discord                      |
|-----------------------------------|-----------------------------------------|
| Official group structure          | Daily chat                              |
| Member directory                  | Project / subgroup channels             |
| Subgroup descriptions             | Quick announcements                     |
| Curated resource library          | Debugging help                          |
| Meeting schedule                  | Polls                                   |
| Project archive                   | Casual discussion                       |
| Join / manage preferences         | Sharing links before they're curated    |
| Past presentation archive         | Role selection for channels             |
| Onboarding guide                  | Event reminders                         |

**Both:** announcements (Discord first → archive on site) · resources (shared on Discord → curated to site) · meetings (site = official schedule, Discord = reminders).

---

## Design feel

Internal lab portal, not a marketing site.

- Clean · academic · functional · scannable
- Minimal animations (stagger on hero load, animated underlines on links)
- Cards and tables where useful
- Mobile friendly — hamburger nav on small screens (all six nav links in a slide-down menu)
- Homepage routes people quickly — does not decorate
- Search / filter on Members and Resources arrives in Phase 2; Phase 1 ships with simple grouped listings
