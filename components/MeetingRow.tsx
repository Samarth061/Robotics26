import type { Meeting } from "@/types";
import { getSubgroup } from "@/lib/data";
import { meetingDateParts } from "@/lib/datetime";
import { MeetingJoin } from "./MeetingJoin";

export function MeetingRow({ meeting }: { meeting: Meeting }) {
  const { day, month, year, time } = meetingDateParts(meeting.date);
  const sub = meeting.subgroupSlug ? getSubgroup(meeting.subgroupSlug) : undefined;

  return (
    <div className="grid grid-cols-[96px_1fr_auto] gap-5 py-5 hairline-b items-start">
      <div className="font-mono text-[12px] text-mute uppercase tracking-[0.08em] leading-tight">
        <div className="text-ink text-[16px] font-normal font-display tracking-tight">
          {month} {day}
        </div>
        <div className="mt-1">{year} · {time}</div>
      </div>

      <div className="min-w-0">
        <p className="font-display text-[18px] leading-snug tracking-tight">
          {meeting.topic}
        </p>
        <p className="mt-1 text-[13px] text-mute">
          <span>{meeting.presenter}</span>
          {sub ? <> · <span>{sub.name}</span></> : null}
          <> · <span>{meeting.location}</span></>
        </p>
      </div>

      <div className="flex items-start gap-3 pt-1">
        {meeting.paperUrl ? (
          <a href={meeting.paperUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] uppercase tracking-[0.1em] text-mute link-underline">
            paper
          </a>
        ) : null}
        <MeetingJoin meeting={meeting} variant="inline" />
      </div>
    </div>
  );
}
