import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { ResourceCard } from "@/components/ResourceCard";
import { Tag } from "@/components/Tag";
import {
  subgroups,
  getSubgroup,
  membersInSubgroup,
  resourcesForSubgroup,
  getGroup,
} from "@/lib/data";

export function generateStaticParams() {
  return subgroups.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sg = getSubgroup(slug);
  return { title: sg?.name ?? "Subgroup" };
}

export default async function SubgroupDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sg = getSubgroup(slug);
  if (!sg) notFound();

  const group = getGroup(sg.parentGroup);
  const subMembers = membersInSubgroup(sg.slug);
  const subResources = resourcesForSubgroup(sg.slug);

  return (
    <>
      <PageHeader
        eyebrow={`N° 03 · ${group.name}`}
        number={`${subMembers.length} members · ${subResources.length} resources`}
        title={sg.name}
        lead={sg.description}
      />

      <div className="mx-auto max-w-[1240px] px-6 md:px-10 py-12 md:py-16 space-y-16">
        {/* Quick actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/join" variant="primary">Join this subgroup</Button>
          <Button href="#resources" variant="outline">Resources ↓</Button>
          <Tag variant="default">{sg.discordChannel}</Tag>
        </div>

        {/* Members */}
        <section>
          <SectionHeader number="01" name="Members" count={subMembers.length} />
          {subMembers.length === 0 ? (
            <p className="text-mute text-[14px]">No members listed yet. Be the first — head to <Link href="/join" className="link-underline">Join</Link>.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
              {subMembers.map((m) => (
                <li
                  key={m.slug}
                  className="py-3 hairline-b flex items-baseline justify-between gap-3"
                >
                  <span className="font-display text-[18px] leading-snug tracking-tight">{m.name}</span>
                  {m.isAdmin ? (
                    <Tag variant="accent">Admin</Tag>
                  ) : (
                    <span className="font-mono text-[10.5px] text-mute uppercase tracking-[0.1em]">
                      {m.interests[0] ?? ""}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Resources */}
        <section id="resources">
          <SectionHeader number="02" name="Resources" count={subResources.length} />
          {subResources.length === 0 ? (
            <p className="text-mute text-[14px]">
              No resources yet. Recommend one through the{" "}
              <Link href="/contact" className="link-underline">contact form</Link>.
            </p>
          ) : (
            <div>
              {subResources.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          )}
        </section>

        {/* Projects */}
        <section>
          <SectionHeader number="03" name="Current projects" count={sg.projects.length} />
          <ul>
            {sg.projects.map((p) => (
              <li
                key={p.name}
                className="grid grid-cols-[16px_1fr] gap-4 py-5 hairline-b items-baseline"
              >
                <span aria-hidden className="inline-block w-1.5 h-1.5 bg-red mt-2" />
                <div>
                  <p className="font-display text-[20px] leading-snug tracking-tight">
                    {p.name}
                  </p>
                  <p className="mt-1 text-[14px] text-mute leading-relaxed max-w-[68ch]">
                    {p.blurb}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.1em] text-mute">
            ⌬ Full project status, help-wanted labels, and GitHub links arrive in Phase 2.
          </p>
        </section>

        {/* Discord */}
        <section>
          <SectionHeader number="04" name="Discord" />
          <p className="text-[15px] text-mute leading-relaxed max-w-[68ch]">
            Daily chat, debugging, polls, and quick announcements happen in{" "}
            <span className="font-mono text-ink">{sg.discordChannel}</span>. The
            website is the source of truth for membership, resources, and
            schedule — Discord is the source of truth for what&apos;s happening today.
          </p>
        </section>
      </div>
    </>
  );
}

function SectionHeader({
  number,
  name,
  count,
}: {
  number: string;
  name: string;
  count?: number;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-5 hairline-b pb-3">
      <div className="flex items-baseline gap-4">
        <span className="kicker">§ {number}</span>
        <h2 className="font-display text-[24px] md:text-[28px] tracking-tight">
          {name}
        </h2>
      </div>
      {typeof count === "number" ? (
        <span className="kicker">{count}</span>
      ) : null}
    </div>
  );
}
