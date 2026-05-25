# Build Plan — Robotics Lab Website

Three phases. Ship Phase 1 before starting Phase 2.

---

## Phase 1 — Static functional draft

Goal: clean, professor-ready site, shareable in days.

**Pages**
- Home · Members · Groups & Subgroups · Resources · Schedule · Join / Manage · Contact

**Features**
- AI + Mechatronics member directories (cross-listed for dual-group members), with interest tags on each card
- Member cards show: name, email (mailto link), photo (or initials fallback), interests, links, status tag (Graduated / High School)
- Subgroup pages: description · members · current projects (basic list) · resources · Discord link
- Resources organized by interest area (mirrors the Groups taxonomy 1:1 — one section per subgroup)
- Home: next-meeting card + Discord invite + Join / Contact CTAs
- Schedule page: § 01 Google Calendar embed · § 02 Upcoming meetings from JSON (visible before calendar is live) · § 03 Past meetings archive
- Join page: mailing list subscribe/unsubscribe via a live `MailingListForm` — opens a pre-filled draft in the student's own email (To: professor, Bcc: admins); unsubscribe quick-action banner anchored at top of page
- Contact page: admin name, role, email (clickable mailto), Discord handle
- Mobile hamburger nav — all six nav links in a slide-down menu on small screens

**Tech**
- Next.js + Tailwind
- JSON files for member/group/resource data (no DB)
- Mailing list: `mailto:` / Gmail compose links via `lib/mailto.ts` + `components/ComposeLinks.tsx` (shared with admin group-mailer)
- `data/lab.json → professor.email` and `data/admins.json → email[]` drive the compose recipients — no hardcoded addresses in code

**Out of scope for Phase 1**
- Auth, admin dashboard, profile editing, server-side mail sending (Resend/SES), chat
- Self-serve group/subgroup join (routed to Contact page for now — Phase 3)

---

## Phase 2 — Active internal hub

Goal: a site members actually come back to.

**Add**
- Full Projects section — status cards (Idea / Active / Completed / Paused), help-wanted labels, GitHub & demo links. (Phase 1 has only a basic project list on subgroup pages.)
- Standalone resource submission form (replaces the "Submit a resource" route through the contact form)
- Paper presentation archive
- Beginner onboarding page
- Search / filter across Members, Resources, Projects, Subgroups

**Split of responsibility**
- Site: official project list, curated resources, schedule, archives, onboarding
- Discord: daily discussion, announcements, event reminders

---

## Phase 3 — Self-service member platform

Goal: members and admins manage everything themselves.

**Backend**
- Supabase (recommended) — or Firebase, or Postgres behind Next.js API routes

**Member accounts**
- Log in · edit profile (photo, website, GitHub, LinkedIn) · join/leave AI & Mech · subscribe to subgroups · update interests · manage mailing list

**Admin tools**
- Approve members · edit group/subgroup info · add resources/meetings/projects · export mailing lists · review submissions

**Automation (future)**
- Sync subgroup membership ↔ Discord roles
- Auto-generate mailing lists by subgroup
- Meeting reminders + paper-presentation RSVPs
- Archive slides & recordings
- Activity feed
