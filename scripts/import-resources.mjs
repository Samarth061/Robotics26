#!/usr/bin/env node
/**
 * import-resources.mjs — semi-automated resource publish.
 *
 * Turns approved rows from the "Submit a Resource" Google Form responses Sheet
 * into entries in data/resources.json. Runs LOCALLY on an admin's machine — it
 * never talks to Google. The admin downloads the Sheet as CSV
 * (File -> Download -> Comma-separated values), then:
 *
 *     npm run import:resources ~/Downloads/responses.csv
 *
 * Only rows whose "Approved?" column is yes/true are imported. The admin then
 * reviews `git diff data/resources.json` and commits. See docs/resources-submission.md.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const RESOURCES_PATH = join(ROOT, "data", "resources.json");
const SUBGROUPS_PATH = join(ROOT, "data", "subgroups.json");

const RESOURCE_TYPES = ["Paper", "Video", "Project", "Tutorial", "Dataset"];

// Exact Google Form question titles -> the field we read from them.
const COL = {
  timestamp: "Timestamp",
  name: "Your name",
  title: "Resource title",
  type: "Resource type",
  belongs: "Where does this resource belong?",
  url: "Link (shareable URL)",
  description: "Short description",
  tags: "Tags",
  beginner: "Beginner friendly?",
  approved: "Approved?",
};

/** Minimal RFC-4180 CSV parser: handles quoted fields, embedded commas/newlines, "" escapes. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  // Strip a leading UTF-8 BOM if present.
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      rows.push(row); row = [];
    } else field += c;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  // Drop fully-empty trailing rows.
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

// ── Load inputs ────────────────────────────────────────────────────────────
const csvPath = process.argv[2];
if (!csvPath) fail("Usage: npm run import:resources <path-to-responses.csv>");

let csvText;
try {
  csvText = readFileSync(csvPath, "utf8");
} catch {
  fail(`Could not read CSV at: ${csvPath}`);
}

const rows = parseCsv(csvText);
if (rows.length < 2) fail("CSV has no data rows.");

// Google sometimes folds a question's help text into the column header on a
// second line, so match on the first line of each header only.
const firstLine = (h) => h.split(/\r?\n/)[0].trim();
const header = rows[0].map(firstLine);
const idx = {};
for (const [key, title] of Object.entries(COL)) {
  idx[key] = header.findIndex((h) => h.toLowerCase() === title.toLowerCase());
}
for (const required of ["title", "type", "belongs", "url", "description", "approved"]) {
  if (idx[required] === -1) {
    fail(`CSV is missing the "${COL[required]}" column. Found headers: ${header.join(" | ")}`);
  }
}

const subgroups = JSON.parse(readFileSync(SUBGROUPS_PATH, "utf8"));
// Match the form's Q4 option (a subgroup display name) back to its slug.
const nameToSlug = new Map(subgroups.map((s) => [s.name.toLowerCase(), s.slug]));

const resources = JSON.parse(readFileSync(RESOURCES_PATH, "utf8"));
const existingUrls = new Set(resources.map((r) => r.url.trim().toLowerCase()));

// Next r-0NN id after the current max.
let maxId = 0;
for (const r of resources) {
  const m = /^r-(\d+)$/.exec(r.id);
  if (m) maxId = Math.max(maxId, Number(m[1]));
}
const nextId = () => `r-${String(++maxId).padStart(3, "0")}`;

const isYes = (v) => ["yes", "y", "true", "1", "✓"].includes((v || "").trim().toLowerCase());

function toDate(timestamp) {
  const d = new Date((timestamp || "").trim());
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return new Date().toISOString().slice(0, 10); // fallback: today
}

// ── Build entries ────────────────────────────────────────────────────────────
const added = [];
const skipped = [];
let approvedCount = 0;

for (let i = 1; i < rows.length; i++) {
  const get = (key) => (idx[key] === -1 ? "" : (rows[i][idx[key]] || "").trim());
  if (!isYes(get("approved"))) continue;
  approvedCount++;

  const title = get("title");
  const url = get("url");
  const belongs = get("belongs");

  if (!title || !url) {
    skipped.push(`row ${i + 1}: missing title or URL`);
    continue;
  }
  if (existingUrls.has(url.toLowerCase())) {
    skipped.push(`row ${i + 1}: duplicate URL already in resources.json (${url})`);
    continue;
  }

  const type = get("type");
  if (!RESOURCE_TYPES.includes(type)) {
    skipped.push(`row ${i + 1}: unknown type "${type}" (expected ${RESOURCE_TYPES.join("/")})`);
    continue;
  }

  // Resolve subgroup. "General …" (or blank) → lab-wide, no subgroupSlug.
  let subgroupSlug;
  const isGeneral = belongs === "" || belongs.toLowerCase().startsWith("general");
  if (!isGeneral) {
    subgroupSlug = nameToSlug.get(belongs.toLowerCase());
    if (!subgroupSlug) {
      skipped.push(`row ${i + 1}: subgroup "${belongs}" not found in subgroups.json`);
      continue;
    }
  }

  const tags = get("tags")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const entry = {
    id: nextId(),
    title,
    type,
    url,
    description: get("description"),
    tags,
    recommendedBy: get("name") || "Anonymous",
    dateAdded: toDate(get("timestamp")),
  };
  if (subgroupSlug) entry.subgroupSlug = subgroupSlug;
  if (isYes(get("beginner"))) entry.beginnerFriendly = true;

  resources.push(entry);
  existingUrls.add(url.toLowerCase());
  added.push(entry);
}

// ── Write + report ────────────────────────────────────────────────────────────
/** Pretty-print 2-space, but keep `tags` arrays on one line to match the existing
 *  file style — so the git diff shows only the appended entries, not a reformat. */
function serialize(list) {
  const json = JSON.stringify(list, null, 2);
  const collapsed = json.replace(/("tags": )\[\n([\s\S]*?)\n\s*\]/g, (_, key, body) => {
    const items = body
      .split("\n")
      .map((l) => l.trim().replace(/,$/, ""))
      .filter(Boolean);
    return `${key}[${items.join(", ")}]`;
  });
  return collapsed + "\n";
}

if (added.length > 0) {
  writeFileSync(RESOURCES_PATH, serialize(resources));
}

console.log(`\nApproved rows scanned : ${approvedCount}`);
console.log(`Added to resources.json: ${added.length}`);
for (const e of added) {
  console.log(`  + ${e.id}  ${e.title}  [${e.subgroupSlug || "general"}]`);
}
if (skipped.length > 0) {
  console.log(`\nSkipped: ${skipped.length}`);
  for (const s of skipped) console.log(`  - ${s}`);
}
console.log(
  added.length > 0
    ? `\n✓ Done. Review with: git diff data/resources.json — then commit & push to publish.`
    : `\nNothing added.`
);
