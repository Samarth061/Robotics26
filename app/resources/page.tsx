import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ResourceCard } from "@/components/ResourceCard";
import { Button } from "@/components/Button";
import { groups, subgroupsByGroup, resourcesForSubgroup, resources } from "@/lib/data";

export const metadata = { title: "Resources" };

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="N° 04 · Library"
        number={`${resources.length} curated`}
        title={<>The <span className="italic">reading</span> list.</>}
        lead={
          <>
            Papers, projects, tutorials, and datasets that the lab actually
            uses. Organized by subgroup. New here? Look for the{" "}
            <span className="text-red">Beginner</span> tags.
          </>
        }
      />

      <div className="mx-auto max-w-[1240px] px-6 md:px-10 py-12 md:py-16">
        <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mute max-w-[60ch]">
            ⌬ Search and filtering arrives in Phase 2. For now, browse by subgroup.
          </p>
          <Button href="/contact" variant="outline">Submit a resource →</Button>
        </div>

        {groups.map((g, gi) => (
          <section key={g.slug} className="mb-20">
            <div className="flex items-baseline justify-between gap-4 mb-8">
              <div className="flex items-baseline gap-4">
                <span className="kicker">Track {String(gi + 1).padStart(2, "0")}</span>
                <h2 className="font-display text-[32px] md:text-[40px] leading-tight tracking-[-0.01em]">
                  {g.name}
                </h2>
              </div>
            </div>

            <div className="space-y-12">
              {subgroupsByGroup(g.slug).map((sg) => {
                const items = resourcesForSubgroup(sg.slug);
                return (
                  <div key={sg.slug}>
                    <div className="flex items-baseline justify-between gap-4 mb-1.5 hairline-b pb-2">
                      <Link
                        href={`/groups/${sg.slug}`}
                        className="font-display text-[20px] md:text-[22px] tracking-tight link-underline"
                      >
                        {sg.name}
                      </Link>
                      <span className="kicker">
                        {items.length} {items.length === 1 ? "entry" : "entries"}
                      </span>
                    </div>
                    {items.length === 0 ? (
                      <p className="py-6 text-[13.5px] text-mute italic">
                        No resources yet for this subgroup —{" "}
                        <Link href="/contact" className="link-underline">recommend one</Link>.
                      </p>
                    ) : (
                      <div>
                        {items.map((r) => (
                          <ResourceCard key={r.id} resource={r} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
