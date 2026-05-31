import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ResourceCard } from "@/components/ResourceCard";
import {
  groups,
  subgroupsByGroup,
  allResources,
  allResourcesForSubgroup,
  allResourcesGeneral,
} from "@/lib/data";

export const metadata = { title: "Resources" };

// Reads live from Supabase; render per request so admin changes show instantly.
export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  // Fetch everything up-front — allResources() is cached per-request so
  // allResourcesForSubgroup / allResourcesGeneral share the same query.
  const all = await allResources();
  const general = await allResourcesGeneral();

  // Pre-fetch per-subgroup slices for every group so JSX stays sync.
  const groupSections = await Promise.all(
    groups.map(async (g, gi) => {
      const subgroupItems = await Promise.all(
        subgroupsByGroup(g.slug).map(async (sg) => ({
          sg,
          items: await allResourcesForSubgroup(sg.slug),
        })),
      );
      return { g, gi, subgroupItems };
    }),
  );

  return (
    <>
      <PageHeader
        eyebrow="N° 04 · Library"
        number={`${all.length} curated`}
        title={<>The <span className="italic">reading</span> list.</>}
        lead={
          <>
            Papers, projects, tutorials, and datasets that the club actually
            uses. Organized by subgroup. New here? Look for the{" "}
            <span className="text-red">Beginner</span> tags.
          </>
        }
      />

      <div className="mx-auto max-w-[1240px] px-6 md:px-10 py-12 md:py-16">
        <div className="mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mute max-w-[60ch]">
            ⌬ Browse resources by subgroup.
          </p>
          {/* Submit a resource button hidden — admins add resources directly via /admin/resources. */}
          {/* <Button href={submitHref} variant="outline" external={Boolean(submitUrl)}>
            Submit a resource →
          </Button> */}
        </div>

        {general.length > 0 && (
          <section className="mb-20">
            <div className="flex items-baseline justify-between gap-4 mb-8">
              <div className="flex items-baseline gap-4">
                <span className="kicker">General</span>
                <h2 className="font-display text-[32px] md:text-[40px] leading-tight tracking-[-0.01em]">
                  Club-wide
                </h2>
              </div>
              <span className="kicker">
                {general.length} {general.length === 1 ? "entry" : "entries"}
              </span>
            </div>
            <div>
              {general.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          </section>
        )}

        {groupSections.map(({ g, gi, subgroupItems }) => (
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
              {subgroupItems.map(({ sg, items }) => (
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
                      No resources yet for this subgroup — check back soon.
                    </p>
                  ) : (
                    <div>
                      {items.map((r) => (
                        <ResourceCard key={r.id} resource={r} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
