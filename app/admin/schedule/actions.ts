"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { supabaseWrite } from "@/lib/supabase";
import { subgroupsByGroup } from "@/lib/data";
import type { MeetingTrack } from "@/types";

// These actions write with the secret key, which BYPASSES RLS — so the database
// won't stop an unauthenticated write. The proxy.ts matcher ("/admin/:path*")
// gates the page they're posted from, but Next.js Server Actions are effectively
// public POST endpoints, so we re-check the Basic Auth credential *inside* each
// action too (defense in depth, mirroring proxy.ts). The browser sends the
// Authorization header on these POSTs because they're under the /admin realm.
async function assertAdmin(): Promise<boolean> {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;
  if (!user || !pass) return false; // fail closed, like proxy.ts
  const header = (await headers()).get("authorization");
  if (!header) return false;
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return false;
  let decoded: string;
  try {
    decoded = atob(encoded);
  } catch {
    return false;
  }
  const sep = decoded.indexOf(":");
  return decoded.slice(0, sep) === user && decoded.slice(sep + 1) === pass;
}

export interface SaveState {
  error?: string;
}

const GROUPS: MeetingTrack[] = ["general", "ai", "mechatronics"];

function str(form: FormData, key: string): string {
  return (form.get(key) as string | null)?.trim() ?? "";
}

// A datetime-local value ("YYYY-MM-DDTHH:mm") is wall-clock time at NC State
// (America/New_York). Store it with that zone's explicit UTC offset for the
// given date — matching the existing data format (e.g. ...T16:00:00-04:00) and
// avoiding a UTC conversion that would shift the displayed time.
function nyOffsetMinutes(at: Date): number {
  const tz = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    timeZoneName: "shortOffset",
  })
    .formatToParts(at)
    .find((p) => p.type === "timeZoneName")?.value ?? "GMT-5";
  const m = tz.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);
  if (!m) return -300;
  const h = parseInt(m[1], 10);
  const mm = m[2] ? parseInt(m[2], 10) : 0;
  return h * 60 + Math.sign(h) * mm;
}

function toEasternISO(local: string): string {
  const [datePart, timePart] = local.split("T");
  const [y, mo, d] = datePart.split("-").map(Number);
  const [hh, mi] = timePart.split(":").map(Number);
  const approx = new Date(Date.UTC(y, mo - 1, d, hh, mi));
  const off = nyOffsetMinutes(approx);
  const sign = off <= 0 ? "-" : "+";
  const abs = Math.abs(off);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${datePart}T${p(hh)}:${p(mi)}:00${sign}${p(Math.floor(abs / 60))}:${p(abs % 60)}`;
}

function orNull(v: string): string | null {
  return v === "" ? null : v;
}

// Add N calendar days to a datetime-local string, keeping the HH:mm wall-clock.
// Used for recurrence: feeding each result through toEasternISO recomputes the
// Eastern offset per date, so a 4:00 PM series stays 4:00 PM across a DST change.
function addDaysLocal(local: string, days: number): string {
  const [datePart, timePart] = local.split("T");
  const [y, mo, d] = datePart.split("-").map(Number);
  const base = new Date(Date.UTC(y, mo - 1, d));
  base.setUTCDate(base.getUTCDate() + days);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${base.getUTCFullYear()}-${p(base.getUTCMonth() + 1)}-${p(base.getUTCDate())}T${timePart}`;
}

export async function saveMeeting(
  _prev: SaveState,
  form: FormData,
): Promise<SaveState> {
  if (!(await assertAdmin())) return { error: "Not authorized." };

  const id = str(form, "id");
  const presenter = str(form, "presenter");
  const topic = str(form, "topic");
  const dateLocal = str(form, "date");
  const location = str(form, "location");
  const parentGroup = str(form, "parentGroup") as MeetingTrack;
  const isTrack = parentGroup === "ai" || parentGroup === "mechatronics";
  // General meetings have no subgroup, so only read it for real tracks.
  const subgroupSlug = isTrack ? str(form, "subgroupSlug") : "";
  const paperUrl = str(form, "paperUrl");
  const zoomUrl = str(form, "zoomUrl");
  const zoomMeetingId = str(form, "zoomMeetingId");
  const zoomPasscode = str(form, "zoomPasscode");

  // Validate
  if (!presenter) return { error: "Presenter is required." };
  if (!topic) return { error: "Topic is required." };
  if (!dateLocal) return { error: "Date & time is required." };
  if (!location) return { error: "Location is required." };
  if (!GROUPS.includes(parentGroup)) {
    return { error: "Pick a valid group (General, AI, or Mechatronics)." };
  }
  if (subgroupSlug && isTrack) {
    const valid = subgroupsByGroup(parentGroup).some((s) => s.slug === subgroupSlug);
    if (!valid) {
      return { error: "That subgroup doesn't belong to the selected group." };
    }
  }

  const baseRow = {
    presenter,
    topic,
    location,
    parent_group: parentGroup,
    subgroup_slug: orNull(subgroupSlug),
    paper_url: orNull(paperUrl),
    zoom_url: orNull(zoomUrl),
    zoom_meeting_id: orNull(zoomMeetingId),
    zoom_passcode: orNull(zoomPasscode),
  };

  const db = supabaseWrite();

  if (id) {
    // Editing one meeting — repeat is ignored.
    const { error } = await db
      .from("meetings")
      .update({ ...baseRow, date: toEasternISO(dateLocal) })
      .eq("id", id);
    if (error) return { error: `Could not save: ${error.message}` };
  } else {
    // Creating — optionally repeat weekly/biweekly, generating independent rows.
    const repeat = str(form, "repeat");
    const intervalDays = repeat === "weekly" ? 7 : repeat === "biweekly" ? 14 : 0;
    let times = intervalDays ? parseInt(str(form, "times"), 10) || 1 : 1;
    times = Math.min(Math.max(times, 1), 52);
    const rows = Array.from({ length: times }, (_, k) => ({
      ...baseRow,
      date: toEasternISO(addDaysLocal(dateLocal, k * intervalDays)),
    }));
    const { error } = await db.from("meetings").insert(rows);
    if (error) return { error: `Could not save: ${error.message}` };
  }

  revalidatePath("/schedule");
  revalidatePath("/");
  revalidatePath("/admin/schedule");
  redirect("/admin/schedule");
}

export async function deleteMeeting(form: FormData): Promise<void> {
  if (!(await assertAdmin())) throw new Error("Not authorized.");

  const id = str(form, "id");
  if (!id) return;
  const { error } = await supabaseWrite().from("meetings").delete().eq("id", id);
  if (error) throw new Error(`Could not delete meeting: ${error.message}`);
  revalidatePath("/schedule");
  revalidatePath("/");
  revalidatePath("/admin/schedule");
}
