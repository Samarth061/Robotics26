#!/usr/bin/env node
/**
 * reset-meetings.mjs — replace ALL rows in the Supabase `meetings` table with
 * the real club meetings. Run LOCALLY once, when the schedule needs to be reset
 * to the true state (e.g. clearing the sample/seed data before going live):
 *
 *     npm run reset:meetings
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY from .env.local (writes
 * need the secret key — the publishable key is blocked by RLS). This DELETES
 * every existing row, then inserts the meetings defined in MEETINGS below.
 * Destructive by design — edit MEETINGS, then run.
 *
 * Dates are stored with the explicit Eastern offset (EDT = -04:00) so they
 * render as the intended wall-clock time via lib/datetime.ts. Going forward,
 * meetings are managed from /admin/schedule; this script is just the reset.
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Minimal .env.local loader (standalone scripts don't get Next's env handling).
function loadEnvLocal() {
  const path = join(ROOT, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local — see docs/supabase.md.",
  );
  process.exit(1);
}

// The real club meetings. parent_group "general" = lab-wide track. Join info is
// left null (the schedule is public; the professor can add a Zoom link later
// via /admin/schedule).
const MEETINGS = [
  {
    id: "m-2026-05-15",
    date: "2026-05-15T16:00:00-04:00",
    presenter: "Khaled Abdel Harfoush",
    topic: "Robotics Interest Meeting",
    location: "Online (Zoom)",
    parent_group: "general",
    paper_url: null,
    zoom_url: null,
    zoom_meeting_id: null,
    zoom_passcode: null,
    subgroup_slug: null,
    slides_url: null,
    recording_url: null,
  },
  {
    id: "m-2026-06-05",
    date: "2026-06-05T16:00:00-04:00",
    presenter: "Khaled Abdel Harfoush",
    topic: "Robotics Interest Meeting",
    location: "Online (Zoom)",
    parent_group: "general",
    paper_url: null,
    zoom_url: null,
    zoom_meeting_id: null,
    zoom_passcode: null,
    subgroup_slug: null,
    slides_url: null,
    recording_url: null,
  },
];

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Delete every existing row. `id` is the primary key (never null), so this
// filter matches all rows while satisfying Supabase's required-filter rule.
const { error: delError } = await supabase
  .from("meetings")
  .delete()
  .not("id", "is", null);

if (delError) {
  console.error(`Reset failed (delete): ${delError.message}`);
  process.exit(1);
}

const { error: insError } = await supabase.from("meetings").insert(MEETINGS);

if (insError) {
  console.error(`Reset failed (insert): ${insError.message}`);
  process.exit(1);
}

console.log(`Reset complete — meetings table now holds ${MEETINGS.length} rows:`);
for (const m of MEETINGS) {
  console.log(`  ${m.date}  ${m.topic} (${m.presenter})`);
}
console.log("Verify them in the Supabase table editor or on /schedule.");
