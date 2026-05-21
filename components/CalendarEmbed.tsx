import { upcomingMeetings } from "@/lib/data";
import { MeetingRow } from "./MeetingRow";

interface CalendarEmbedProps {
  src?: string;
}

export function CalendarEmbed({ src }: CalendarEmbedProps) {
  if (src) {
    return (
      <div className="border border-rule bg-paper">
        <iframe
          src={src}
          title="Lab meeting calendar"
          width="100%"
          height={720}
          frameBorder={0}
          scrolling="no"
          loading="lazy"
          className="block w-full"
        />
      </div>
    );
  }

  const upcoming = upcomingMeetings();

  return (
    <div className="border border-rule bg-paper">
      <div className="px-6 py-4 hairline-b flex items-center justify-between">
        <p className="kicker">Upcoming · Placeholder list</p>
        <p className="font-mono text-[11px] text-mute uppercase tracking-[0.1em]">
          Drop a Google Calendar embed URL into <code>data/lab.json</code> to replace this list
        </p>
      </div>
      <div className="px-6">
        {upcoming.map((m) => (
          <MeetingRow key={m.id} meeting={m} />
        ))}
        {upcoming.length === 0 ? (
          <p className="py-10 text-center text-mute text-[14px]">No upcoming meetings.</p>
        ) : null}
      </div>
    </div>
  );
}
