import { PageHeader } from "@/components/PageHeader";
import {
  lab,
  groups,
  subgroups,
  members,
  membersInGroup,
  membersInBothGroups,
  membersInSubgroup,
} from "@/lib/data";
import type { Member } from "@/types";
import { EmailComposer, type Audience } from "./EmailComposer";

export const metadata = {
  title: "Admin — Group mailer",
  robots: { index: false, follow: false },
};

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

export default function AdminEmailPage() {
  const audiences: Audience[] = [
    {
      id: "org",
      kind: "Org",
      label: "Entire org — all members",
      people: peopleOf(members),
    },
    // membersInGroup() excludes dual-group members by design, so add them back
    // explicitly — a "AI Group" blast should reach everyone in AI.
    ...groups.map<Audience>((g) => ({
      id: `group:${g.slug}`,
      kind: "Group",
      label: g.name,
      people: peopleOf([...membersInGroup(g.slug), ...membersInBothGroups()]),
    })),
    ...subgroups.map<Audience>((s) => ({
      id: `subgroup:${s.slug}`,
      kind: "Subgroup",
      label: s.name,
      people: peopleOf(membersInSubgroup(s.slug)),
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
            Gmail. Nothing is sent from this site — you send it from your NC
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
