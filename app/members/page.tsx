import { PageHeader } from "@/components/PageHeader";
import { MemberCard } from "@/components/MemberCard";
import {
  allMembers,
  allFaculty,
  allMembersInGroup,
  allMembersInBothGroups,
} from "@/lib/data";

export const metadata = { title: "Members" };

// Reads live from Supabase; render per request so admin changes show instantly.
export const dynamic = "force-dynamic";

export default async function MembersPage() {
  // allMembers() is cached per-request — the four derived queries share one DB call.
  const all = await allMembers();
  const fac = await allFaculty();
  const ai = await allMembersInGroup("ai");
  const mech = await allMembersInGroup("mechatronics");
  const both = await allMembersInBothGroups();

  return (
    <>
      <PageHeader
        eyebrow="N° 02 · Directory"
        number={`${all.length} listed`}
        title={<>Who&apos;s in <span className="italic">the club</span>.</>}
        lead={
          <>
            Faculty first, then AI, Mechatronics, and members active in both.
            Each person appears once. Reach anyone by their listed email or
            through the contact form.
          </>
        }
      />

      <div className="mx-auto max-w-[1240px] px-6 md:px-10 py-12 md:py-16 space-y-20">
        {fac.length > 0 && (
          <Section
            number="01"
            name="Faculty"
            subtitle={`${fac.length} ${fac.length === 1 ? "advisor" : "faculty"}`}
          >
            {fac.map((m) => (
              <MemberCard key={m.slug} member={m} />
            ))}
          </Section>
        )}

        <Section
          number="02"
          name="AI Group"
          subtitle={`${ai.length} ${ai.length === 1 ? "member" : "members"}`}
        >
          {ai.map((m) => (
            <MemberCard key={m.slug} member={m} />
          ))}
        </Section>

        <Section
          number="03"
          name="Mechatronics Group"
          subtitle={`${mech.length} ${mech.length === 1 ? "member" : "members"}`}
        >
          {mech.map((m) => (
            <MemberCard key={m.slug} member={m} />
          ))}
        </Section>

        <Section
          number="04"
          name="Members in both groups"
          subtitle={`${both.length} cross-listed`}
        >
          {both.map((m) => (
            <MemberCard key={m.slug} member={m} />
          ))}
        </Section>
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
