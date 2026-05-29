import { NextMeetingCard } from "@/components/NextMeetingCard";
import { MeetingRow } from "@/components/MeetingRow";
import { pastMeetings, upcomingMeetings } from "@/lib/data";

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
      <div className="mx-auto max-w-[1240px] px-6 md:px-10 pt-12 md:pt-16 pb-8 hairline-b stagger">
        <p className="kicker">N° 05 · Schedule</p>
        <h1 className="mt-3 font-display text-[26px] md:text-[30px] tracking-tight">
          Schedule
        </h1>
        <p className="mt-2 text-[15px] text-mute leading-relaxed max-w-[60ch]">
          Meeting times vary; here&apos;s what&apos;s next, what&apos;s coming up,
          and what we&apos;ve already covered.
        </p>
      </div>

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
                ? "Nothing else on the calendar yet. Check back soon."
                : "No upcoming meetings logged yet. Check back soon."}
            </p>
          ) : (
            <div>
              {rest.map((m) => (
                <MeetingRow key={m.id} meeting={m} />
              ))}
            </div>
          )}
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
        </section>
      </div>
    </>
  );
}
