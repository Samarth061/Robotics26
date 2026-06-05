import Link from "next/link";
import type { Subgroup } from "@/types";

export function SubgroupCard({
  subgroup,
  index,
  memberCount,
  resourceCount,
}: {
  subgroup: Subgroup;
  index: number;
  memberCount: number;
  resourceCount: number;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/groups/${subgroup.slug}`}
      className="group block hairline-b transition-colors duration-200 hover:bg-cream/60"
    >
      <div className="grid grid-cols-[64px_1fr_auto] gap-5 items-start py-7">
        <div className="font-mono text-[12px] text-mute pt-1">{num}</div>

        <div>
          <h3 className="font-display text-[24px] leading-tight tracking-tight group-hover:text-red transition-colors duration-200">
            {subgroup.name}
          </h3>
          <p className="mt-1.5 text-[14px] text-mute leading-relaxed max-w-[64ch]">
            {subgroup.description}
          </p>
          <div className="mt-3 flex items-center gap-4 font-mono text-[11px] text-mute uppercase tracking-[0.1em]">
            <span>{memberCount} {memberCount === 1 ? "member" : "members"}</span>
            <span aria-hidden>·</span>
            <span>{resourceCount} {resourceCount === 1 ? "resource" : "resources"}</span>
            <span aria-hidden>·</span>
            <span>{subgroup.projects.length} {subgroup.projects.length === 1 ? "project" : "projects"}</span>
          </div>
        </div>

        <div
          aria-hidden
          className="self-center font-mono text-[12px] text-mute pt-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-red"
        >
          View →
        </div>
      </div>
    </Link>
  );
}
