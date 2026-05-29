#!/usr/bin/env node
/**
 * seed-meetings.mjs — one-time migration of data/meetings.json into Supabase.
 *
 * Run LOCALLY once, after creating the `meetings` table (see docs/supabase.md):
 *
 *     npm run seed:meetings
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY from .env.local (writes
 * need the secret key — the publishable key is blocked by RLS). Upserts each
 * meeting by `id`, so re-running is safe (idempotent). After verifying the rows
 * in the Supabase table editor, data/meetings.json can be deleted — Supabase is
 * the source of truth from then on.
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

const meetingsPath = join(ROOT, "data", "meetings.json");
if (!existsSync(meetingsPath)) {
  console.error("data/meetings.json not found — nothing to seed.");
  process.exit(1);
}

const meetings = JSON.parse(readFileSync(meetingsPath, "utf8"));

const orNull = (v) => (v && String(v).trim() !== "" ? v : null);

const rows = meetings.map((m) => ({
  id: m.id,
  date: m.date,
  presenter: m.presenter,
  topic: m.topic,
  location: m.location,
  parent_group: m.parentGroup,
  paper_url: orNull(m.paperUrl),
  zoom_url: orNull(m.zoomUrl),
  subgroup_slug: orNull(m.subgroupSlug),
  slides_url: orNull(m.slidesUrl),
  recording_url: orNull(m.recordingUrl),
}));

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await supabase.from("meetings").upsert(rows, { onConflict: "id" });

if (error) {
  console.error(`Seed failed: ${error.message}`);
  process.exit(1);
}

console.log(`Seeded ${rows.length} meetings into Supabase.`);
console.log(
  "Verify them in the Supabase table editor, then you can delete data/meetings.json.",
);
