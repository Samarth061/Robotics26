# Build Plan — Robotics Lab Website

Three phases. Ship Phase 1 before starting Phase 2.

---

## Phase 1 — Static functional draft

Goal: clean, professor-ready site, shareable in days.

**Pages**
- Home · Members · Groups & Subgroups · Resources · Schedule · Join / Manage · Contact

**Features**
- AI + Mechatronics member directories (cross-listed for dual-group members), with interest tags on each card
- Subgroup pages: description · members · current projects (basic list) · resources · Discord link
- Resources organized by interest area (mirrors the Groups taxonomy 1:1 — one section per subgroup)
- Home: next-meeting card + Discord invite + Join / Contact CTAs
- Meeting schedule via Google Calendar embed
- Google Form / Airtable for: mailing list subscribe-unsubscribe, AI/Mech/subgroup join, contact admins

**Tech**
- Next.js + Tailwind
- JSON files for member/group/resource data (no DB)
- Google Forms or Airtable for all submissions

**Out of scope**
- Auth, admin dashboard, profile editing, custom mailing-list backend, chat

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
