# Resource submission

How members submit resources and how an approved one reaches the live site. Read this
before touching the submission flow, the import script, or the routing.

## The loop, end to end

```
CTA on /resources  ──►  Google Form  ──►  responses Google Sheet
   (links out)          (NCSU sign-in)         │
                                               ├─► Apps Script emails admins (review)
                                               │
   admin ticks "Approved?" ◄────────────────────┘
        │
        ├─ File → Download → CSV   (a file on the admin's laptop)
        ├─ npm run import:resources file.csv   (edits data/resources.json locally)
        └─ git commit + push  ──►  Vercel redeploys  ──►  live on /resources
```

**There is no automatic pipe between Google and the repo.** Google holds the submissions;
the repo holds the code. A *person* carries one CSV across the gap and runs a local command.
The manual hop is deliberate — it keeps a human reviewing the diff before anything goes live,
and means no GitHub token has to live inside Google. Two distinct scripts are involved, and
they never touch each other:

| | Apps Script (routing) | `scripts/import-resources.mjs` |
|---|---|---|
| Lives | In Google, bound to the Sheet | In the repo |
| Runs | Automatically, on each submit | Manually, on an admin's laptop |
| Does | Sends a notification email | Reads a CSV → writes `data/resources.json` |
| Touches the repo? | Never | Yes (local working copy only) |

This is a **trust-based, no-database** design. "Approve" literally means "an admin commits the
entry." The professor "doesn't need permission" rule is **policy, not enforced** — anyone with
the form link can submit, and anyone with repo access can commit.

---

## NOW — what's implemented

### Website (this repo)
- **CTA**: `/resources` "Submit a resource →" links out (new tab) to the form URL in
  `data/lab.json → formUrls.submitResource`. Falls back to `/contact` if that field is blank.
- **General resources**: `Resource.subgroupSlug` is optional. Resources without it render in a
  "General · Club-wide" section at the top of `/resources` (`resourcesGeneral()` in `lib/data.ts`).
- **Member tag (data model only, unused)**: `Member.subgroupAdminOf?: string[]` + the
  `adminEmailForSubgroup(slug)` helper in `lib/data.ts`. No members carry values yet — the shape
  ships now so per-subgroup routing has a documented home later.
- **Import script**: `scripts/import-resources.mjs`, run via `npm run import:resources <csv>`.

### Google Form
Title: **Submit a Resource — NC State Robotics Club**. Settings: *Collect email addresses =
Verified* (forces NCSU sign-in), allow multiple submissions. Live URL is in `data/lab.json`.

Questions — the titles must stay **exactly** as below; the import script matches columns by title:

| # | Question title | Type | Req | → `Resource` field |
|---|---|---|---|---|
| 1 | `Your name` | Short answer | ✓ | `recommendedBy` |
| 2 | `Resource title` | Short answer | ✓ | `title` |
| 3 | `Resource type` | Choice: Paper / Video / Project / Tutorial / Dataset | ✓ | `type` |
| 4 | `Where does this resource belong?` | Choice: the 11 subgroup names + "General (club-wide / not subgroup-specific)" | ✓ | `subgroupSlug` (or none) |
| 5 | `Link (shareable URL)` | Short answer, URL validation | ✓ | `url` |
| 6 | `Short description` | Paragraph | ✓ | `description` |
| 7 | `Tags` | Short answer, comma-separated | | `tags` |
| 8 | `Beginner friendly?` | Choice: Yes / No | | `beginnerFriendly` |

Q4's subgroup options must match `data/subgroups.json` `name` values **exactly** — that string is
how the import script maps a submission back to a slug. For now, submitters paste a **shareable
link** (Drive set to "anyone with the link", arXiv, GitHub, etc.); no file upload.

### Responses Sheet
Form → Responses → **Link to Sheets**. Add a manual trailing column **`Approved?`**; type `yes`
in it to mark a row for import.

### Apps Script (routing)
Sheet → Extensions → Apps Script. Add an installable trigger: *From form → On form submit*.
**Current routing: every submission emails the professor + all 4 admins**, regardless of subgroup.
The `ROUTING` map is a stub for future per-subgroup routing.

```js
// Notified on every submission. (Per-subgroup routing comes later via ROUTING.)
const RECIPIENTS = [
  "kaharfou@ncsu.edu",  // Prof. Harfoush
  "sdshah5@ncsu.edu",   // Samarth
  "vpatel34@ncsu.edu",  // Vaishvi
  "pkoppal@ncsu.edu",   // Praneetha
  "sfeng9@ncsu.edu",    // Edward
];
const ROUTING = {};  // future: "<Q4 subgroup option>": "<that admin's email>"

function onResourceSubmit(e) {
  const v = e.namedValues, get = k => (v[k] && v[k][0]) ? v[k][0] : "—";
  const belongs = get("Where does this resource belong?");
  const lead = ROUTING[belongs];                 // empty for now
  const to  = lead || RECIPIENTS[0];
  const cc  = RECIPIENTS.filter(x => x !== to).join(",");
  const subject = `[Resource submission] ${get("Resource title")} — ${belongs}`;
  const body = [
    "New resource submitted for review:", "",
    `Title       : ${get("Resource title")}`,
    `Type        : ${get("Resource type")}`,
    `Belongs to  : ${belongs}`,
    `Link        : ${get("Link (shareable URL)")}`,
    `Description : ${get("Short description")}`,
    `Tags        : ${get("Tags")}`,
    `Beginner    : ${get("Beginner friendly?")}`,
    `Submitted by: ${get("Your name")} <${get("Email Address")}>`, "",
    'To publish: tick "Approved?" in the Sheet, download it as CSV, then run the import script.',
  ].join("\n");
  MailApp.sendEmail({ to, cc, subject, body });
}
```

### Publishing an approved resource
1. In the Sheet, type `yes` in `Approved?` for rows to publish.
2. **File → Download → Comma-separated values (.csv)**.
3. In a local clone of this repo: `npm run import:resources ~/Downloads/responses.csv`.
4. The script imports only `Approved? = yes` rows: maps Q4 → slug (General → no slug), splits
   tags, sets `beginnerFriendly`, derives `dateAdded` from the Timestamp, assigns the next
   `r-0NN` id, and **skips rows whose URL is already in `resources.json`**. It prints a summary.
5. `git diff data/resources.json` to review, then commit & push. Vercel redeploys.

---

## FUTURE — not built yet

- **Own the files**: once the club has a shared Workspace account, switch Q5 to a Form
  **file-upload** question so PDFs/images land in *our* Drive folder (no link-rot), instead of
  asking submitters to host and link.
- **Per-subgroup routing**: when Discord subgroups get admins, set `Member.subgroupAdminOf` in
  `data/members.json` and fill the Apps Script `ROUTING` map so each submission notifies that
  subgroup's admin (the `adminEmailForSubgroup` helper already encodes the fallback logic).
- **Auto-pull**: replace the CSV download with a Sheets-API read in the import script (needs a
  service-account credential) so the admin skips the manual export.
- **Real backend** (Supabase et al.): approve → instantly live with no commit, enforced
  per-user roles instead of trust-based policy, and submission status tracking. This is the
  point at which the static-first model is intentionally abandoned.
