import { PageHeader } from "@/components/PageHeader";
import { NextMeetingCard } from "@/components/NextMeetingCard";
import { MeetingRow } from "@/components/MeetingRow";
import { lab, pastMeetings, upcomingMeetings } from "@/lib/data";

export const metadata = { title: "Schedule" };

// Meetings come from Supabase (live), so render per request — newly scheduled
// meetings show immediately without a redeploy.
export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const upcoming = await upcomingMeetings();
  const past = await pastMeetings();

  // The soonest meeting headlines the page (with how-to-join); the rest list below.
  const next = upcoming[0];
  const rest = upcoming.slice(1);

  return (
    <>
      <PageHeader
        eyebrow="N° 05 · Schedule"
        number={lab.meetingCadence}
        title={<><span className="italic">Friday</span> 4 PM.</>}
        lead={
          <>
            Paper presentations and demos, biweekly. Here&apos;s what&apos;s next
            and how to join — then everything coming up, and everything
            we&apos;ve already covered.
          </>
        }
      />

      <div className="mx-auto max-w-[1240px] px-6 md:px-10 py-12 md:py-16 space-y-20">

        {/* Next meeting — headline + how to join */}
        <section>
          <NextMeetingCard meeting={next} hideScheduleLink />
        </section>

        {/* § 01 — Upcoming */}
        <section>
          <div className="flex items-baseline justify-between gap-4 mb-5 hairline-b pb-3">
            <div className="flex items-baseline gap-4">
              <span className="kicker">§ 01</span>
              <h2 className="font-display text-[26px] md:text-[30px] tracking-tight">
                Upcoming
              </h2>
            </div>
            <span className="kicker">{rest.length} more</span>
          </div>

          {rest.length === 0 ? (
            <p className="text-mute text-[14px]">
              {next
                ? "Nothing else on the calendar yet — check back soon."
                : "No upcoming meetings logged yet — check back soon."}
            </p>
          ) : (
            <div>
              {rest.map((m) => (
                <MeetingRow key={m.id} meeting={m} />
              ))}
            </div>
          )}

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.1em] text-mute">
            ⌬ Managed from <span className="text-ink">/admin/schedule</span> — changes appear here automatically.
          </p>
        </section>

        {/* § 02 — Past meetings archive */}
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
