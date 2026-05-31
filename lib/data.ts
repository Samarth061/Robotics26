import labJson from "@/data/lab.json";
import groupsJson from "@/data/groups.json";
import subgroupsJson from "@/data/subgroups.json";
import membersJson from "@/data/members.json";
import resourcesJson from "@/data/resources.json";
import adminsJson from "@/data/admins.json";

import { cache } from "react";
import { supabaseRead } from "@/lib/supabase";
import type {
  Lab, Group, Subgroup, Member, Resource, Meeting, Admin, GroupSlug, MeetingTrack, ResourceType,
} from "@/types";

export const lab = labJson as Lab;
export const groups = groupsJson as Group[];
export const subgroups = subgroupsJson as Subgroup[];
export const members = membersJson as Member[];
export const resources = resourcesJson as Resource[];
export const admins = adminsJson as Admin[];

export function getGroup(slug: GroupSlug): Group {
  const g = groups.find((g) => g.slug === slug);
  if (!g) throw new Error(`Unknown group: ${slug}`);
  return g;
}

export function getSubgroup(slug: string): Subgroup | undefined {
  return subgroups.find((s) => s.slug === slug);
}

export function subgroupsByGroup(slug: GroupSlug): Subgroup[] {
  return subgroups.filter((s) => s.parentGroup === slug);
}

export function membersInGroup(slug: GroupSlug): Member[] {
  return members.filter((m) => m.groups.length === 1 && m.groups[0] === slug);
}

export function membersInBothGroups(): Member[] {
  return members.filter((m) => m.groups.length > 1);
}

/**
 * Faculty (status "faculty") — rendered in their own section at the top of the
 * Members page. They carry empty `groups`, so they never appear in the AI /
 * Mechatronics / both buckets or in the group/subgroup mailer audiences.
 */
export function faculty(): Member[] {
  return members.filter((m) => m.status === "faculty");
}

export function membersInSubgroup(slug: string): Member[] {
  return members.filter((m) => m.subgroups.includes(slug));
}

export function resourcesForSubgroup(slug: string): Resource[] {
  return resources
    .filter((r) => r.subgroupSlug === slug)
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
}

/** Lab-wide resources not tied to any subgroup (the form's "General" option). */
export function resourcesGeneral(): Resource[] {
  return resources
    .filter((r) => !r.subgroupSlug)
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
}

// ── Live Supabase resource helpers ─────────────────────────────────────────
// Mirrors the allMeetings() pattern: cached per-request fetch with graceful
// degrade on error, so a Supabase outage cannot 500 the public Resources page.

interface ResourceRow {
  id: string;
  title: string;
  type: string;
  url: string;
  description: string;
  tags: string[];
  recommended_by: string;
  date_added: string;
  subgroup_slug: string | null;
  beginner_friendly: boolean;
}

function rowToResource(r: ResourceRow): Resource {
  return {
    id: r.id,
    title: r.title,
    type: r.type as ResourceType,
    url: r.url,
    description: r.description,
    tags: r.tags ?? [],
    recommendedBy: r.recommended_by,
    dateAdded: r.date_added,
    subgroupSlug: r.subgroup_slug ?? undefined,
    beginnerFriendly: r.beginner_friendly ?? false,
  };
}

export const allResources = cache(async (): Promise<Resource[]> => {
  try {
    const { data, error } = await supabaseRead()
      .from("resources")
      .select("*")
      .order("date_added", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => rowToResource(r as ResourceRow));
  } catch (err) {
    console.error("[resources] Supabase read failed, returning empty list:", err);
    return [];
  }
});

export async function allResourcesForSubgroup(slug: string): Promise<Resource[]> {
  return (await allResources()).filter((r) => r.subgroupSlug === slug);
}

export async function allResourcesGeneral(): Promise<Resource[]> {
  return (await allResources()).filter((r) => !r.subgroupSlug);
}

/** Single resource by id — for the admin edit page. */
export async function getResource(id: string): Promise<Resource | undefined> {
  try {
    const { data, error } = await supabaseRead()
      .from("resources")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToResource(data as ResourceRow) : undefined;
  } catch (err) {
    console.error(`[resources] Supabase read failed for ${id}:`, err);
    return undefined;
  }
}

/**
 * Email of the admin responsible for a subgroup's resources. Returns the member
 * tagged with this subgroup in `subgroupAdminOf`, else falls back to the first
 * admin. Reserved for future per-subgroup submission routing — no members carry
 * `subgroupAdminOf` yet. See docs/resources-submission.md.
 */
export function adminEmailForSubgroup(slug: string): string | undefined {
  const lead = members.find((m) => m.subgroupAdminOf?.includes(slug));
  if (lead?.email) return lead.email;
  return admins[0]?.email;
}

// DB row (snake_case columns) → app Meeting (camelCase, null → undefined).
// Column shape and RLS are defined in docs/supabase.md.
interface MeetingRow {
  id: string;
  date: string;
  presenter: string;
  topic: string;
  location: string;
  parent_group: MeetingTrack;
  paper_url: string | null;
  zoom_url: string | null;
  zoom_meeting_id: string | null;
  zoom_passcode: string | null;
  subgroup_slug: string | null;
  slides_url: string | null;
  recording_url: string | null;
}

function rowToMeeting(r: MeetingRow): Meeting {
  return {
    id: r.id,
    date: r.date,
    presenter: r.presenter,
    topic: r.topic,
    location: r.location,
    parentGroup: r.parent_group,
    paperUrl: r.paper_url ?? undefined,
    zoomUrl: r.zoom_url ?? undefined,
    zoomMeetingId: r.zoom_meeting_id ?? undefined,
    zoomPasscode: r.zoom_passcode ?? undefined,
    subgroupSlug: r.subgroup_slug ?? undefined,
    slidesUrl: r.slides_url ?? undefined,
    recordingUrl: r.recording_url ?? undefined,
  };
}

// Single source of truth for meetings = the Supabase `meetings` table (migrated
// from the old data/meetings.json). Fetch all once; the dataset is small, so
// upcoming/past/next just filter in JS against the current time.
// Wrapped in React cache() so multiple accessors within a single request/render
// (e.g. /schedule calls both upcomingMeetings + pastMeetings) share ONE query
// instead of issuing duplicate SELECTs. The cache is per-request, not global —
// it does not stale across requests, so force-dynamic pages stay fresh.
export const allMeetings = cache(async (): Promise<Meeting[]> => {
  // Degrade gracefully: the public home + schedule pages render dynamically and
  // call this, so a Supabase outage (incl. the free-tier 7-day idle pause) or a
  // missing/bad env var must NOT 500 the landing page. Log and return [] — the
  // pages then show "no meetings" instead of crashing.
  try {
    const { data, error } = await supabaseRead().from("meetings").select("*");
    if (error) throw error;
    return (data ?? []).map((r) => rowToMeeting(r as MeetingRow));
  } catch (err) {
    console.error("[meetings] Supabase read failed, returning empty list:", err);
    return [];
  }
});

// Split upcoming vs past against the real current time, read per call (not a
// module-level constant) so a long-running server never drifts.
export async function upcomingMeetings(): Promise<Meeting[]> {
  const now = Date.now();
  return (await allMeetings())
    .filter((m) => new Date(m.date).getTime() >= now)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function pastMeetings(): Promise<Meeting[]> {
  const now = Date.now();
  return (await allMeetings())
    .filter((m) => new Date(m.date).getTime() < now)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function nextMeeting(): Promise<Meeting | undefined> {
  return (await upcomingMeetings())[0];
}

/** Single meeting by id — for the admin edit page. */
export async function getMeeting(id: string): Promise<Meeting | undefined> {
  try {
    const { data, error } = await supabaseRead()
      .from("meetings")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToMeeting(data as MeetingRow) : undefined;
  } catch (err) {
    console.error(`[meetings] Supabase read failed for ${id}:`, err);
    return undefined;
  }
}

export function getMember(slug: string): Member | undefined {
  return members.find((m) => m.slug === slug);
}

export function adminWithMember(): { admin: Admin; member: Member }[] {
  return admins
    .map((a) => {
      const m = getMember(a.memberSlug);
      return m ? { admin: a, member: m } : null;
    })
    .filter((x): x is { admin: Admin; member: Member } => x !== null);
}
