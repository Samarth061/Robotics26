import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource, subgroups } from "@/lib/data";
import { ResourceForm } from "@/components/ResourceForm";

export const metadata = {
  title: "Admin · Edit resource",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const subOptions = subgroups.map((s) => ({ slug: s.slug, name: s.name }));

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = await getResource(id);
  if (!resource) notFound();

  return (
    <div className="mx-auto max-w-[1240px] px-6 md:px-10 pt-12 md:pt-16 pb-16">
      <div className="flex items-baseline justify-between gap-4">
        <p className="kicker">Admin · Edit resource</p>
        <Link href="/admin/resources" className="kicker link-underline">
          ← Back
        </Link>
      </div>

      <h1 className="mt-5 font-display text-[clamp(32px,5vw,52px)] leading-[0.98] tracking-[-0.02em]">
        Edit <span className="italic">resource</span>.
      </h1>

      <div className="mt-10">
        <ResourceForm subgroups={subOptions} resource={resource} />
      </div>
    </div>
  );
}
