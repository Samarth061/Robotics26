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

Each card: name · picture placeholder · interest/subgroup tags · optional personal site, LinkedIn, GitHub.

Email policy: keep emails internal-only by default. Public visitors go through the contact form.

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

Show:
- Upcoming meetings (cadence: Friday 4:00 PM, biweekly)
- Per meeting: presenter · paper/topic · group/subgroup · location or Zoom/Discord link
- Archive of past meetings

### Join / Manage Preferences — actions
One page, multiple actions:
- Subscribe / unsubscribe to mailing list
- Join AI / Mechatronics / both
- Join any subgroup
- Switch groups · update interests
- Request Discord channel access

**MVP:** back this with a Google Form or Airtable form. Responses → spreadsheet → admins review. Design the page as if member self-serve already exists.

### Contact / Admins — routing hub
Single contact form with a category dropdown:
- Join the group
- Update my group / subgroup
- Submit a resource
- Submit a project
- Ask an admin question
- Report a website issue

Also list: admin emails · Discord admin handles.

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
- Minimal animations
- Cards and tables where useful
- Mobile friendly
- Homepage routes people quickly — does not decorate
- Search / filter on Members and Resources arrives in Phase 2; Phase 1 ships with simple grouped listings
