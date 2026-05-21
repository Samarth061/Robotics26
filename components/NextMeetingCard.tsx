import type { Meeting } from "@/types";
import { getSubgroup } from "@/lib/data";

function fmt(iso: string) {
  const d = new Date(iso);
  const days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const h = d.getHours();
  const m = d.getMinutes();
  const am = h < 12;
  const h12 = ((h + 11) % 12) + 1;
  return {
    weekday: days[d.getDay()],
    day: String(d.getDate()).padStart(2, "0"),
    month: months[d.getMonth()],
    year: d.getFullYear(),
    time: `${h12}:${String(m).padStart(2,"0")} ${am ? "AM" : "PM"}`,
  };
}

export function NextMeetingCard({ meeting }: { meeting?: Meeting }) {
  if (!meeting) {
    return (
      <div className="border border-rule bg-cream p-6">
        <p className="kicker">Next meeting</p>
        <p className="mt-3 font-display text-[22px] leading-tight">No meetings scheduled.</p>
        <p className="mt-2 text-[13px] text-mute">Check back soon, or contact an admin.</p>
      </div>
    );
  }

  const f = fmt(meeting.date);
  const sub = meeting.subgroupSlug ? getSubgroup(meeting.subgroupSlug) : undefined;

  return (
    <article
      className="relative border border-rule bg-red-tint/40"
      style={{ borderLeft: "4px solid var(--color-red)" }}
    >
      <div className="absolute right-4 top-4 kicker">Next meeting</div>

      <div className="grid grid-cols-[110px_1fr] gap-5 p-6 md:p-7">
        <div className="border-r border-rule pr-4">
          <div className="font-mono text-[11px] text-red uppercase tracking-[0.14em]">{f.weekday}</div>
          <div className="mt-2 font-display text-[58px] leading-[0.95] tracking-[-0.02em] text-ink">
            {f.day}
          </div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
            {f.month} {f.year}
          </div>
          <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
            {f.time}
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="font-display text-[22px] md:text-[24px] leading-tight tracking-tight">
            {meeting.topic}
          </h3>
          <p className="mt-2 text-[13.5px] text-mute leading-relaxed">
            Presenter · <span className="text-ink">{meeting.presenter}</span>
            <br />
            {sub ? <>Subgroup · <span className="text-ink">{sub.name}</span><br /></> : null}
            Location · <span className="text-ink">{meeting.location}</span>
          </p>
          <div className="mt-4 flex items-center gap-4">
            {meeting.paperUrl ? (
              <a
                href={meeting.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-red link-underline"
              >
                paper →
              </a>
            ) : null}
            <a
              href="/schedule"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute link-underline"
            >
              full schedule
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
