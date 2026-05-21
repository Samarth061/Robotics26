import labJson from "@/data/lab.json";
import groupsJson from "@/data/groups.json";
import subgroupsJson from "@/data/subgroups.json";
import membersJson from "@/data/members.json";
import resourcesJson from "@/data/resources.json";
import meetingsJson from "@/data/meetings.json";
import adminsJson from "@/data/admins.json";

import type {
  Lab, Group, Subgroup, Member, Resource, Meeting, Admin, GroupSlug,
} from "@/types";

export const lab = labJson as Lab;
export const groups = groupsJson as Group[];
export const subgroups = subgroupsJson as Subgroup[];
export const members = membersJson as Member[];
export const resources = resourcesJson as Resource[];
export const meetings = meetingsJson as Meeting[];
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

export function membersInSubgroup(slug: string): Member[] {
  return members.filter((m) => m.subgroups.includes(slug));
}

export function resourcesForSubgroup(slug: string): Resource[] {
  return resources
    .filter((r) => r.subgroupSlug === slug)
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
}

const NOW_ISO = "2026-05-21T12:00:00-04:00";

export function upcomingMeetings(): Meeting[] {
  const now = new Date(NOW_ISO).getTime();
  return meetings
    .filter((m) => new Date(m.date).getTime() >= now)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function pastMeetings(): Meeting[] {
  const now = new Date(NOW_ISO).getTime();
  return meetings
    .filter((m) => new Date(m.date).getTime() < now)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function nextMeeting(): Meeting | undefined {
  return upcomingMeetings()[0];
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
