import Link from "next/link";
import { allResources, subgroups } from "@/lib/data";
import { ResourceForm } from "@/components/ResourceForm";
import { deleteResource } from "./actions";
import type { Resource } from "@/types";

export const metadata = {
  title: "Admin · Resource manager",
  robots: { index: false, follow: false },
};

// Reads live from Supabase; render per request so every change is reflected.
export const dynamic = "force-dynamic";

const subOptions = subgroups.map((s) => ({ slug: s.slug, name: s.name }));

function ResourceAdminRow({ r }: { r: Resource }) {
  const date = new Date(r.dateAdded).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 items-start py-4 hairline-b">
      <div className="min-w-0">
        <p className="font-display text-[17px] leading-snug tracking-tight">
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            {r.title}
          </a>
        </p>
        <p className="mt-1 text-[13px] text-mute">
          {r.type} · {r.subgroupSlug ?? "General"} · rec. by {r.recommendedBy} · {date}
        </p>
      </div>
      <div className="flex items-center gap-4 pt-1 shrink-0">
        <Link
          href={`/admin/resources/${r.id}`}
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-mute link-underline"
        >
          Edit
        </Link>
        <form action={deleteResource}>
          <input type="hidden" name="id" value={r.id} />
          <button
            type="submit"
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-mute hover:text-red transition-colors"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function AdminResourcesPage() {
  const all = await allResources();

  return (
    <div className="mx-auto max-w-[1240px] px-6 md:px-10 pt-12 md:pt-16 pb-16">
      <div className="flex items-baseline justify-between gap-4">
        <p className="kicker">Admin · Resource manager</p>
        <p className="kicker">Gated</p>
      </div>

      <h1 className="mt-5 font-display text-[clamp(32px,5vw,52px)] leading-[0.98] tracking-[-0.02em]">
        Add a <span className="italic">resource</span>.
      </h1>
      <p className="mt-4 max-w-[60ch] text-[15px] text-mute leading-relaxed">
        Add a paper, video, tutorial, or other resource and it appears on the
        public Resources page right away. Edit or remove anything below.
      </p>

      {/* § 01 — Add resource */}
      <section className="mt-10">
        <div className="flex items-baseline gap-4 mb-6 hairline-b pb-3">
          <span className="kicker">§ 01</span>
          <h2 className="font-display text-[22px] md:text-[24px] tracking-tight">
            New resource
          </h2>
        </div>
        <ResourceForm subgroups={subOptions} />
      </section>

      {/* § 02 — All resources */}
      <section className="mt-16">
        <div className="flex items-baseline justify-between gap-4 mb-2 hairline-b pb-3">
          <div className="flex items-baseline gap-4">
            <span className="kicker">§ 02</span>
            <h2 className="font-display text-[22px] md:text-[24px] tracking-tight">
              All resources
            </h2>
          </div>
          <span className="kicker">{all.length} total</span>
        </div>
        {all.length === 0 ? (
          <p className="py-4 text-[14px] text-mute">
            No resources yet. Add one above.
          </p>
        ) : (
          all.map((r) => <ResourceAdminRow key={r.id} r={r} />)
        )}
      </section>
    </div>
  );
}
