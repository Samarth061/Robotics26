import { PageHeader } from "@/components/PageHeader";
import { CalendarEmbed } from "@/components/CalendarEmbed";
import { MeetingRow } from "@/components/MeetingRow";
import { lab, pastMeetings } from "@/lib/data";

export const metadata = { title: "Schedule" };

export default function SchedulePage() {
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
            optional. Below: the live calendar, then everything we've already
            covered.
          </>
        }
      />

      <div className="mx-auto max-w-[1240px] px-6 md:px-10 py-12 md:py-16 space-y-20">
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

        <section>
          <div className="flex items-baseline justify-between gap-4 mb-5 hairline-b pb-3">
            <div className="flex items-baseline gap-4">
              <span className="kicker">§ 02</span>
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
