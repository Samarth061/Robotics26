import { PageHeader } from "@/components/PageHeader";
import { MemberCard } from "@/components/MemberCard";
import {
  members,
  membersInGroup,
  membersInBothGroups,
} from "@/lib/data";

export const metadata = { title: "Members" };

export default function MembersPage() {
  const ai = membersInGroup("ai");
  const mech = membersInGroup("mechatronics");
  const both = membersInBothGroups();

  return (
    <>
      <PageHeader
        eyebrow="N° 02 · Directory"
        number={`${members.length} active`}
        title={<>Who&apos;s in <span className="italic">the lab</span>.</>}
        lead={
          <>
            Three buckets — AI, Mechatronics, and members active in both. Each
            person appears once. Emails are kept internal; reach anyone through
            the contact form.
          </>
        }
      />

      <div className="mx-auto max-w-[1240px] px-6 md:px-10 py-12 md:py-16 space-y-20">
        <Section
          number="01"
          name="AI Group"
          subtitle={`${ai.length} ${ai.length === 1 ? "member" : "members"}`}
        >
          {ai.map((m) => <MemberCard key={m.slug} member={m} />)}
        </Section>

        <Section
          number="02"
          name="Mechatronics Group"
          subtitle={`${mech.length} ${mech.length === 1 ? "member" : "members"}`}
        >
          {mech.map((m) => <MemberCard key={m.slug} member={m} />)}
        </Section>

        <Section
          number="03"
          name="Members in both groups"
          subtitle={`${both.length} cross-listed`}
        >
          {both.map((m) => <MemberCard key={m.slug} member={m} />)}
        </Section>

        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mute max-w-[60ch]">
          ⌬ Group assignments are placeholder for the Phase 1 draft. Admins to confirm
          before the site goes public.
        </p>
      </div>
    </>
  );
}

function Section({
  number,
  name,
  subtitle,
  children,
}: {
  number: string;
  name: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-4 mb-6 hairline-b pb-3">
        <div className="flex items-baseline gap-4">
          <span className="kicker">§ {number}</span>
          <h2 className="font-display text-[26px] md:text-[30px] tracking-tight">
            {name}
          </h2>
        </div>
        <span className="kicker">{subtitle}</span>
      </div>
      <div>{children}</div>
    </section>
  );
}
