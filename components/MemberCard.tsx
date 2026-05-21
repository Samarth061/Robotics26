import type { Member } from "@/types";
import { Tag } from "./Tag";

export function MemberCard({ member }: { member: Member }) {
  const initials = member.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <article className="group grid grid-cols-[64px_1fr] gap-5 py-6 hairline-b transition-colors duration-200 hover:bg-cream/60">
      <div
        aria-hidden
        className="w-16 h-16 bg-cream border border-rule flex items-center justify-center font-display text-[20px] text-ink/70 select-none transition-colors duration-200 group-hover:border-rule-strong"
      >
        {initials}
      </div>

      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h3 className="font-display text-[22px] leading-tight tracking-tight">
            {member.name}
          </h3>
          {member.isAdmin ? (
            <Tag variant="accent">Admin · {member.adminRole}</Tag>
          ) : null}
        </div>

        {member.interests.length > 0 ? (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {member.interests.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        ) : null}

        {member.links ? (
          <div className="mt-3 flex items-center gap-4 text-[12px] text-mute">
            {member.links.website ? (
              <a href={member.links.website} target="_blank" rel="noopener noreferrer" className="link-underline">website</a>
            ) : null}
            {member.links.linkedin ? (
              <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline">linkedin</a>
            ) : null}
            {member.links.github ? (
              <a href={member.links.github} target="_blank" rel="noopener noreferrer" className="link-underline">github</a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
