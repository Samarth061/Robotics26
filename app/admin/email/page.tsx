import { PageHeader } from "@/components/PageHeader";
import {
  lab,
  groups,
  subgroups,
  allMembers,
  allMembersInGroup,
  allMembersInBothGroups,
  allMembersInSubgroup,
} from "@/lib/data";
import type { Member } from "@/types";
import { EmailComposer, type Audience } from "./EmailComposer";

export const metadata = {
  title: "Admin · Group mailer",
  robots: { index: false, follow: false },
};

// Force dynamic so the page always fetches fresh member data from Supabase
// instead of being baked into the static build.
export const dynamic = "force-dynamic";

// Collapse members to {name, email}, dropping those without an email and
// de-duplicating by address (dual-group members appear in two source lists).
function peopleOf(list: Member[]): { name: string; email: string }[] {
  const seen = new Set<string>();
  const out: { name: string; email: string }[] = [];
  for (const m of list) {
    const email = m.email?.trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    out.push({ name: m.name, email });
  }
  return out;
}

export default async function AdminEmailPage() {
  // Fetch all member data live from Supabase so members added via the admin
  // panel are included in every audience — the static members.json is only a
  // fallback seed and won't reflect newly-added members.
  const [allM, bothGroups, ...groupMembers] = await Promise.all([
    allMembers(),
    allMembersInBothGroups(),
    ...groups.map((g) => allMembersInGroup(g.slug)),
  ]);

  const subgroupMembers = await Promise.all(
    subgroups.map((s) => allMembersInSubgroup(s.slug))
  );

  const audiences: Audience[] = [
    {
      id: "org",
      kind: "Org",
      label: "Entire org (all members)",
      // Exclude faculty: the professor is the draft's From/To, not a Bcc recipient.
      people: peopleOf(allM.filter((m) => m.status !== "faculty")),
    },
    // membersInGroup() excludes dual-group members by design, so add them back
    // explicitly — an "AI Group" blast should reach everyone in AI.
    ...groups.map<Audience>((g, i) => ({
      id: `group:${g.slug}`,
      kind: "Group",
      label: g.name,
      people: peopleOf([...groupMembers[i], ...bothGroups]),
    })),
    ...subgroups.map<Audience>((s, i) => ({
      id: `subgroup:${s.slug}`,
      kind: "Subgroup",
      label: s.name,
      people: peopleOf(subgroupMembers[i]),
    })),
  ];

  return (
    <>
      <PageHeader
        eyebrow="Admin · Group mailer"
        number="Gated"
        title={
          <>
            <span className="italic">Email</span> a group.
          </>
        }
        lead={
          <>
            Pick an audience and open a pre-filled draft in your own mail app or
            Gmail. Nothing is sent from this site. You send it from your NC
            State address, with recipients hidden in Bcc.
          </>
        }
      />

      <div className="mx-auto max-w-[1240px] px-6 md:px-10 py-12 md:py-16">
        <EmailComposer audiences={audiences} from={lab.professor.email} />
      </div>
    </>
  );
}
