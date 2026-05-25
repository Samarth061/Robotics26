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
Mirrors the Groups taxonomy **1:1** — one resources section per subgroup, all nine Mechatronics subgroups and both AI subgroups represented.

Each resource card:
- Title · Type (Paper / Video / Project / Tutorial / Dataset) · Link
- Short description · Tags
- Recommended by · Date added
- "Beginner friendly" flag

### Schedule — meetings and presentations
**Embed Google Calendar.** Do not hand-roll an events system.

Three sections on the Schedule page:
- **§ 01 Calendar** — Google Calendar embed (placeholder shown until URL is set in `data/lab.json`)
- **§ 02 Upcoming meetings** — rendered from `data/meetings.json`; always visible even before the calendar is live
- **§ 03 Past meetings archive** — rendered from `data/meetings.json`

Per meeting row: date · presenter · paper/topic · subgroup · location or Zoom link

Cadence: Friday 4:00 PM, biweekly.

### Join / Manage Preferences — actions
Primary action: **mailing list subscribe / unsubscribe** via a live form.

The form collects: action (Subscribe / Unsubscribe) · full name · email · group interest (for subscribe) · optional note. On submit, clicking "Open in Gmail" or "Open in mail app" opens a pre-filled draft in the student's own email client:
- **To:** professor (`data/lab.json → professor.email`)
- **Bcc:** all admins with an email in `data/admins.json`

The site never sends mail itself. The student reviews the pre-filled draft and hits Send from their own `@ncsu.edu` account.

A **"Unsubscribe from the mailing list" quick-action banner** sits at the top of the page, anchored to the form, so it is immediately visible.

Other membership actions (join a group, switch groups, request Discord access) are listed in the sidebar and route to the Contact page for now. Phase 3 replaces this with a self-serve profile.

### Contact / Admins — routing hub
Single contact form with a category dropdown:
- Join the group
- Update my group / subgroup
- Submit a resource
- Submit a project
- Ask an admin question
- Report a website issue

Also list: admin name · role · email (shown as clickable mailto link) · Discord handle.

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
