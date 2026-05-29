import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ResourceCard } from "@/components/ResourceCard";
import { Button } from "@/components/Button";
import { lab, groups, subgroupsByGroup, resourcesForSubgroup, resourcesGeneral, resources } from "@/lib/data";

export const metadata = { title: "Resources" };

export default function ResourcesPage() {
  const submitUrl = lab.formUrls.submitResource;
  const submitHref = submitUrl || "/contact";
  const general = resourcesGeneral();
  return (
    <>
      <PageHeader
        eyebrow="N° 04 · Library"
        number={`${resources.length} curated`}
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
        <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mute max-w-[60ch]">
            ⌬ Browse resources by subgroup.
          </p>
          <Button href={submitHref} variant="outline" external={Boolean(submitUrl)}>
            Submit a resource →
          </Button>
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
                        No resources yet for this subgroup:{" "}
                        {submitUrl ? (
                          <a
                            href={submitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-underline"
                          >
                            recommend one
                          </a>
                        ) : (
                          <Link href="/contact" className="link-underline">recommend one</Link>
                        )}.
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
