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
One page, multiple actions:
- Subscribe / unsubscribe to mailing list
- Join AI / Mechatronics / both
- Join any subgroup
- Switch groups · update interests
- Request Discord channel access

A **"Unsubscribe from the mailing list" quick-action banner** sits at the top of the page so it is immediately visible without reading the form action list. It links directly to the Contact page for emailing an admin.

**MVP:** back this with a Google Form or Airtable form. Responses → spreadsheet → admins review. Design the page as if member self-serve already exists.

### Contact / Admins — routing hub
Single contact form with a category dropdown:
- Join the group
- Update my group / subgroup
- Submit a resource
- Submit a project
- Ask an admin question
- Report a website issue

Also list: admin name · role · email (shown as clickable mailto link) · Discord handle.

### Admin — Group mailer (gated, not in public nav)
`/admin/email`. Behind HTTP Basic Auth (`proxy.ts`, `ADMIN_USER` / `ADMIN_PASS`) — not
linked from the header. Lets the faculty lead pick an audience (entire org · a group · a
single subgroup) and open a **pre-filled draft** in their own mail app or Gmail, recipients
in Bcc. The site sends nothing itself; the message goes out from the sender's real `@ncsu.edu`
account. Built on the reusable `lib/mailto.ts` + `components/ComposeLinks.tsx` primitives, so
any future mailer (e.g. mail-to-admins) can reuse the same compose buttons.

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
