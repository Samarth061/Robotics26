import { PageHeader } from "@/components/PageHeader";
import { SubgroupCard } from "@/components/SubgroupCard";
import { groups, subgroupsByGroup, subgroups } from "@/lib/data";

export const metadata = { title: "Groups & Subgroups" };

export default function GroupsPage() {
  return (
    <>
      <PageHeader
        eyebrow="N° 03 · Groups"
        number={`${groups.length} tracks · ${subgroups.length} subgroups`}
        title={<>What we're <span className="italic">working on</span>.</>}
        lead={
          <>
            Two umbrella groups — AI and Mechatronics — each split into focused
            subgroups. Pick the subgroup that matches your interest, or join
            both umbrellas if you want breadth.
          </>
        }
      />

      <div className="mx-auto max-w-[1240px] px-6 md:px-10 py-12 md:py-16 space-y-20">
        {groups.map((g, gi) => {
          const subs = subgroupsByGroup(g.slug);
          return (
            <section key={g.slug}>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 items-start">
                <div>
                  <p className="kicker">Track {String(gi + 1).padStart(2, "0")}</p>
                  <h2 className="mt-3 font-display text-[44px] md:text-[56px] leading-[0.95] tracking-[-0.015em]">
                    {g.name}
                  </h2>
                  <p className="mt-4 text-[15px] text-mute leading-relaxed max-w-[44ch]">
                    {g.description}
                  </p>
                  <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
                    {subs.length} {subs.length === 1 ? "subgroup" : "subgroups"}
                  </p>
                </div>

                <div className="hairline-t">
                  {subs.map((s, i) => (
                    <SubgroupCard key={s.slug} subgroup={s} index={i} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
