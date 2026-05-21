import type { Resource } from "@/types";
import { Tag } from "./Tag";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="group grid grid-cols-[88px_1fr] gap-5 py-6 hairline-b transition-colors duration-200 hover:bg-cream/60">
      <div className="flex flex-col gap-2 items-start pt-1">
        <Tag variant="subtle">{resource.type}</Tag>
        <span className="font-mono text-[11px] text-mute uppercase tracking-[0.1em]">
          {formatDate(resource.dateAdded)}
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h3 className="font-display text-[20px] md:text-[22px] leading-tight tracking-tight">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline"
            >
              {resource.title}
            </a>
          </h3>
          {resource.beginnerFriendly ? (
            <Tag variant="accent">Beginner</Tag>
          ) : null}
        </div>

        <p className="mt-2 text-[14px] text-mute leading-relaxed max-w-[68ch]">
          {resource.description}
        </p>

        <div className="mt-3 flex items-center flex-wrap gap-x-4 gap-y-1.5">
          <span className="font-mono text-[11px] text-mute uppercase tracking-[0.1em]">
            rec. by {resource.recommendedBy}
          </span>
          {resource.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
