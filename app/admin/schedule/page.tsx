import Link from "next/link";
import { upcomingMeetings, pastMeetings, subgroups } from "@/lib/data";
import { MeetingForm } from "@/components/MeetingForm";
import { deleteMeeting } from "./actions";
import type { Meeting } from "@/types";

export const metadata = {
  title: "Admin — Meeting scheduler",
  robots: { index: false, follow: false },
};

// Reads live from Supabase; render per request so the list reflects every change.
export const dynamic = "force-dynamic";

const subOptions = subgroups.map((s) => ({
  slug: s.slug,
  name: s.name,
  parentGroup: s.parentGroup,
}));

function MeetingAdminRow({ m }: { m: Meeting }) {
  const when = new Date(m.date).toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 items-start py-4 hairline-b">
      <div className="min-w-0">
        <p className="font-display text-[17px] leading-snug tracking-tight">
          {m.topic}
        </p>
        <p className="mt-1 text-[13px] text-mute">
          {when} · {m.presenter} · {m.location}
        </p>
      </div>
      <div className="flex items-center gap-4 pt-1">
        <Link
          href={`/admin/schedule/${m.id}`}
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-mute link-underline"
        >
          Edit
        </Link>
        <form action={deleteMeeting}>
          <input type="hidden" name="id" value={m.id} />
          <button
            type="submit"
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-mute hover:text-red transition-colors"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function AdminSchedulePage() {
  const upcoming = await upcomingMeetings();
  const past = await pastMeetings();

  return (
    <div className="mx-auto max-w-[1240px] px-6 md:px-10 pt-12 md:pt-16 pb-16">
      <div className="flex items-baseline justify-between gap-4">
        <p className="kicker">Admin · Meeting scheduler</p>
        <p className="kicker">Gated</p>
      </div>

      <h1 className="mt-5 font-display text-[clamp(32px,5vw,52px)] leading-[0.98] tracking-[-0.02em]">
        Schedule a <span className="italic">meeting</span>.
      </h1>
      <p className="mt-4 max-w-[60ch] text-[15px] text-mute leading-relaxed">
        Add a meeting and it appears on the public Schedule page right away. Edit
        or remove anything below.
      </p>

      <section className="mt-10">
        <div className="flex items-baseline gap-4 mb-6 hairline-b pb-3">
          <span className="kicker">§ 01</span>
          <h2 className="font-display text-[22px] md:text-[24px] tracking-tight">
            New meeting
          </h2>
        </div>
        <MeetingForm subgroups={subOptions} />
      </section>

      <section className="mt-16">
        <div className="flex items-baseline justify-between gap-4 mb-2 hairline-b pb-3">
          <div className="flex items-baseline gap-4">
            <span className="kicker">§ 02</span>
            <h2 className="font-display text-[22px] md:text-[24px] tracking-tight">
              Upcoming
            </h2>
          </div>
          <span className="kicker">{upcoming.length} scheduled</span>
        </div>
        {upcoming.length === 0 ? (
          <p className="py-4 text-[14px] text-mute">No upcoming meetings.</p>
        ) : (
          upcoming.map((m) => <MeetingAdminRow key={m.id} m={m} />)
        )}
      </section>

      <section className="mt-14">
        <div className="flex items-baseline justify-between gap-4 mb-2 hairline-b pb-3">
          <div className="flex items-baseline gap-4">
            <span className="kicker">§ 03</span>
            <h2 className="font-display text-[22px] md:text-[24px] tracking-tight">
              Past
            </h2>
          </div>
          <span className="kicker">{past.length} archived</span>
        </div>
        {past.length === 0 ? (
          <p className="py-4 text-[14px] text-mute">No past meetings.</p>
        ) : (
          past.map((m) => <MeetingAdminRow key={m.id} m={m} />)
        )}
      </section>
    </div>
  );
}
