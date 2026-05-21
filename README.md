# Robotics Lab — Website (Phase 1)

Static Next.js draft for the NC State robotics lab. Phase 1 of the three-phase rollout in `phase.md`.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export-friendly production build
```

Requires Node 20+.

## What's in here

- `app/` — App-Router pages: Home, Members, Groups (+ `[slug]`), Resources, Schedule, Join, Contact.
- `components/` — shared shell (Header, Footer, PageHeader) + cards (MemberCard, SubgroupCard, ResourceCard, MeetingRow, NextMeetingCard) + embed wrappers (FormEmbed, CalendarEmbed).
- `data/*.json` — single source of truth for members, groups, subgroups, resources, meetings, admins, and lab metadata. Edit these to update the site.
- `lib/data.ts` — typed accessors.
- `types/index.ts` — every data shape.

## Where to drop real URLs

`data/lab.json` is the only file you should need to touch for go-live:

| field                   | what to put in                                        |
| ----------------------- | ----------------------------------------------------- |
| `discordInviteUrl`      | Permanent Discord invite                              |
| `calendarEmbedUrl`      | Google Calendar `embed` URL                           |
| `formUrls.join`         | Google Form embed URL for Join / Manage Preferences   |
| `formUrls.contact`      | Google Form embed URL for the multi-category contact  |

While these are empty, `FormEmbed` and `CalendarEmbed` render styled placeholders so the layout doesn't break.

## Editing members / subgroups / resources

- **Members:** `data/members.json` — group affiliations are placeholder for the draft; admins confirm before public launch.
- **Subgroups:** canonical names live in `pages.md` and `data/subgroups.json`.
- **Resources:** add a new entry to `data/resources.json`, set `subgroupSlug` to one of the slugs in `subgroups.json`, and it appears under that subgroup automatically on `/resources` and on the subgroup detail page.
- **Meetings:** `data/meetings.json` — `nextMeeting()` and the schedule page use a fixed "now" of 2026-05-21 for Phase 1. Replace `NOW_ISO` in `lib/data.ts` with `new Date()` once we go live.

## Design tokens

CSS variables defined in `app/globals.css`:

- `--color-paper`, `--color-cream` (backgrounds)
- `--color-ink`, `--color-mute` (text)
- `--color-rule`, `--color-rule-strong` (hairlines)
- `--color-red` (NC State accent), `--color-red-deep`, `--color-red-tint`
- `--font-display` (Fraunces), `--font-sans` (Geist), `--font-mono` (JetBrains Mono)

Tailwind v4 reads these via `@theme` — change them in one place and the whole site updates.

## Out of scope for Phase 1

Auth, profile editing, admin dashboard, custom backend, search/filter, full Projects section with status cards, beginner onboarding page, paper presentation archive. See `phase.md` for the Phase 2 and Phase 3 plans.
