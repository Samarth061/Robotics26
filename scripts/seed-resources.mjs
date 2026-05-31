#!/usr/bin/env node
/**
 * seed-resources.mjs — one-time migration of data/resources.json into Supabase.
 *
 * Run LOCALLY once, after creating the `resources` table (see docs/supabase.md):
 *
 *     npm run seed:resources
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY from .env.local (writes
 * need the secret key — the publishable key is blocked by RLS). Upserts each
 * resource by `id`, so re-running is safe (idempotent). After verifying the rows
 * in the Supabase table editor, data/resources.json can be deleted — Supabase is
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

const resourcesPath = join(ROOT, "data", "resources.json");
if (!existsSync(resourcesPath)) {
  console.error("data/resources.json not found — nothing to seed.");
  process.exit(1);
}

const resources = JSON.parse(readFileSync(resourcesPath, "utf8"));

const orNull = (v) => (v && String(v).trim() !== "" ? v : null);

const rows = resources.map((r) => ({
  id: r.id,
  title: r.title,
  type: r.type,
  url: r.url,
  description: r.description ?? "",
  tags: r.tags ?? [],
  recommended_by: r.recommendedBy ?? "Anonymous",
  date_added: r.dateAdded,
  subgroup_slug: orNull(r.subgroupSlug),
  beginner_friendly: r.beginnerFriendly ?? false,
}));

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await supabase.from("resources").upsert(rows, { onConflict: "id" });

if (error) {
  console.error(`Seed failed: ${error.message}`);
  process.exit(1);
}

console.log(`Seeded ${rows.length} resources into Supabase.`);
console.log(
  "Verify them in the Supabase table editor, then you can delete data/resources.json.",
);
