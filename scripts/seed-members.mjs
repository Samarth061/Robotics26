#!/usr/bin/env node
/**
 * seed-members.mjs — one-time migration of data/members.json into Supabase.
 *
 * Run LOCALLY once, after creating the `members` table (see docs/supabase.md):
 *
 *     npm run seed:members
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY from .env.local.
 * Upserts each member by `slug`, so re-running is safe (idempotent).
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

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

const membersPath = join(ROOT, "data", "members.json");
if (!existsSync(membersPath)) {
  console.error("data/members.json not found — nothing to seed.");
  process.exit(1);
}

const members = JSON.parse(readFileSync(membersPath, "utf8"));

const orNull = (v) => (v !== undefined && v !== null && String(v).trim() !== "" ? v : null);

const rows = members.map((m) => ({
  slug: m.slug,
  name: m.name,
  email: orNull(m.email),
  photo: orNull(m.photo),
  status: orNull(m.status),
  groups: m.groups ?? [],
  subgroups: m.subgroups ?? [],
  interests: m.interests ?? [],
  is_admin: m.isAdmin ?? false,
  admin_role: orNull(m.adminRole),
  link_website: orNull(m.links?.website),
  link_linkedin: orNull(m.links?.linkedin),
  link_github: orNull(m.links?.github),
}));

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await supabase.from("members").upsert(rows, { onConflict: "slug" });

if (error) {
  console.error(`Seed failed: ${error.message}`);
  process.exit(1);
}

console.log(`Seeded ${rows.length} members into Supabase.`);
console.log(
  "Verify them in the Supabase table editor, then you can delete data/members.json.",
);
