import { PageHeader } from "@/components/PageHeader";
import { CalendarEmbed } from "@/components/CalendarEmbed";
import { MeetingRow } from "@/components/MeetingRow";
import { lab, pastMeetings, upcomingMeetings } from "@/lib/data";

export const metadata = { title: "Schedule" };

export default function SchedulePage() {
  const upcoming = upcomingMeetings();
  const past = pastMeetings();

  return (
    <>
      <PageHeader
        eyebrow="N° 05 · Schedule"
        number={lab.meetingCadence}
        title={<><span className="italic">Friday</span> 4 PM.</>}
        lead={
          <>
            Paper presentations and demos, biweekly. Bring questions, snacks
            optional. Below: the live calendar, upcoming meetings, then
            everything we&apos;ve already covered.
          </>
        }
      />

      <div className="mx-auto max-w-[1240px] px-6 md:px-10 py-12 md:py-16 space-y-20">

        {/* § 01 — Google Calendar embed */}
        <section>
          <div className="flex items-baseline justify-between gap-4 mb-5 hairline-b pb-3">
            <div className="flex items-baseline gap-4">
              <span className="kicker">§ 01</span>
              <h2 className="font-display text-[26px] md:text-[30px] tracking-tight">
                Calendar
              </h2>
            </div>
            <span className="kicker">Live</span>
          </div>
          <CalendarEmbed src={lab.calendarEmbedUrl} />
        </section>

        {/* § 02 — Upcoming meetings from JSON (always shown as a scannable list) */}
        <section>
          <div className="flex items-baseline justify-between gap-4 mb-5 hairline-b pb-3">
            <div className="flex items-baseline gap-4">
              <span className="kicker">§ 02</span>
              <h2 className="font-display text-[26px] md:text-[30px] tracking-tight">
                Upcoming meetings
              </h2>
            </div>
            <span className="kicker">{upcoming.length} scheduled</span>
          </div>

          {upcoming.length === 0 ? (
            <p className="text-mute text-[14px]">
              No upcoming meetings logged yet — check back soon.
            </p>
          ) : (
            <div>
              {upcoming.map((m) => (
                <MeetingRow key={m.id} meeting={m} />
              ))}
            </div>
          )}

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.1em] text-mute">
            ⌬ Add meetings to <span className="text-ink">data/meetings.json</span> — they appear here automatically.
          </p>
        </section>

        {/* § 03 — Past meetings archive */}
        <section>
          <div className="flex items-baseline justify-between gap-4 mb-5 hairline-b pb-3">
            <div className="flex items-baseline gap-4">
              <span className="kicker">§ 03</span>
              <h2 className="font-display text-[26px] md:text-[30px] tracking-tight">
                Past meetings
              </h2>
            </div>
            <span className="kicker">{past.length} archived</span>
          </div>

          {past.length === 0 ? (
            <p className="text-mute text-[14px]">No past meetings logged yet.</p>
          ) : (
            <div>
              {past.map((m) => (
                <MeetingRow key={m.id} meeting={m} />
              ))}
            </div>
          )}

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.1em] text-mute">
            ⌬ Slides and recording archive land in Phase 2.
          </p>
        </section>
      </div>
    </>
  );
}
