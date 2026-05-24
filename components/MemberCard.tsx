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

  const statusLabel =
    member.status === "graduated"
      ? "Graduated"
      : member.status === "high-school"
      ? "High School"
      : null;

  return (
    <article className="group grid grid-cols-[72px_1fr] gap-5 py-6 hairline-b transition-colors duration-200 hover:bg-cream/60">
      {/* Avatar */}
      <div className="shrink-0">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-[72px] h-[72px] object-cover border border-rule transition-colors duration-200 group-hover:border-rule-strong"
          />
        ) : (
          <div
            aria-hidden
            className="w-[72px] h-[72px] bg-cream border border-rule flex items-center justify-center font-display text-[22px] text-ink/70 select-none transition-colors duration-200 group-hover:border-rule-strong"
          >
            {initials}
          </div>
        )}
      </div>

      <div className="min-w-0">
        {/* Name + badges */}
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h3 className="font-display text-[22px] leading-tight tracking-tight">
            {member.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {member.isAdmin ? (
              <Tag variant="accent">Admin · {member.adminRole}</Tag>
            ) : null}
            {statusLabel ? (
              <Tag variant="subtle">{statusLabel}</Tag>
            ) : null}
          </div>
        </div>

        {/* Email */}
        {member.email ? (
          <p className="mt-1.5 font-mono text-[11.5px] text-mute tracking-[0.02em]">
            <a
              href={`mailto:${member.email}`}
              className="link-underline"
            >
              {member.email}
            </a>
          </p>
        ) : null}

        {/* Interest tags */}
        {member.interests.length > 0 ? (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {member.interests.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        ) : null}

        {/* External links */}
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
