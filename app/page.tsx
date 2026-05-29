import Link from "next/link";
import { Button } from "@/components/Button";
import { NextMeetingCard } from "@/components/NextMeetingCard";
import { lab, groups, subgroupsByGroup, nextMeeting, members } from "@/lib/data";

// The next-meeting card reads live from Supabase, so render per request.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const meeting = await nextMeeting();
  const ai = groups.find((g) => g.slug === "ai")!;
  const mech = groups.find((g) => g.slug === "mechatronics")!;
  const aiSubs = subgroupsByGroup("ai");
  const mechSubs = subgroupsByGroup("mechatronics");

  return (
    <>
      {/* HERO */}
      <section className="pt-14 md:pt-20 pb-20 md:pb-28 hairline-b">
        <div className="mx-auto max-w-[1240px] px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 stagger">
              <div className="flex items-baseline gap-3">
                <span className="kicker">N° 01</span>
                <span className="kicker">EST. FY 2026</span>
                <span className="kicker">Raleigh, NC</span>
              </div>

              <h1 className="mt-6 font-display text-[clamp(56px,9vw,128px)] leading-[0.92] tracking-[-0.025em]">
                The <span className="italic" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>Robotics</span>
                <br />
                Lab.
              </h1>

              <p className="mt-8 max-w-[44ch] text-[18px] md:text-[20px] leading-relaxed text-mute">
                {lab.mission}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button href="/join" variant="primary">Join the lab</Button>
                <Button
                  href={lab.discordInviteUrl || "/contact"}
                  variant="outline"
                  external={!!lab.discordInviteUrl}
                >
                  Discord →
                </Button>
                <Button href="/contact" variant="ghost">Contact admins</Button>
              </div>

              <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
                ⌬ Two tracks · {members.length} members · {aiSubs.length + mechSubs.length} subgroups
              </p>
            </div>

            <div className="lg:col-span-5">
              <NextMeetingCard meeting={meeting} />
            </div>
          </div>
        </div>
      </section>

      {/* TWO TRACKS */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1240px] px-6 md:px-10">
          <div className="flex items-baseline justify-between gap-6 mb-12">
            <p className="kicker">⌬ Two tracks</p>
            <p className="kicker hidden md:block">Section A</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <TrackBlock
              number="A·1"
              name={ai.name}
              description={ai.description}
              subgroups={aiSubs.map((s) => s.name)}
            />
            <TrackBlock
              number="A·2"
              name={mech.name}
              description={mech.description}
              subgroups={mechSubs.map((s) => s.name)}
            />
          </div>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="py-20 md:py-28 bg-cream hairline-t hairline-b">
        <div className="mx-auto max-w-[1240px] px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-4">
              <p className="kicker">What we do</p>
            </div>
            <div className="md:col-span-8 max-w-[58ch]">
              <p className="font-display text-[28px] md:text-[34px] leading-[1.15] tracking-tight">
                A reading group and a build space, run together.
                {" "}
                <span className="text-mute">Biweekly paper presentations on Fridays at 4:00 PM. Open lab nights for project work. One Discord, two tracks, no homework.</span>
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-[14px]">
                <FactBlock label="Cadence" value="Fri 4 PM · biweekly" />
                <FactBlock label="Format"   value="Paper + discussion" />
                <FactBlock label="Where"    value="EB-II 1230" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function TrackBlock({
  number,
  name,
  description,
  subgroups,
}: {
  number: string;
  name: string;
  description: string;
  subgroups: string[];
}) {
  return (
    <article className="group">
      <div className="flex items-baseline justify-between gap-4">
        <p className="kicker">{number}</p>
        <Link
          href="/groups"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute link-underline"
        >
          Open →
        </Link>
      </div>
      <h3 className="mt-3 font-display text-[40px] md:text-[48px] leading-tight tracking-[-0.01em]">
        {name}
      </h3>
      <p className="mt-3 text-[15px] text-mute leading-relaxed max-w-[52ch]">
        {description}
      </p>
      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 max-w-[60ch]">
        {subgroups.map((s) => (
          <li
            key={s}
            className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink/80 flex items-center gap-2"
          >
            <span aria-hidden className="inline-block w-1 h-1 bg-red" />
            {s}
          </li>
        ))}
      </ul>
    </article>
  );
}

function FactBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute">{label}</p>
      <p className="mt-1.5 font-display text-[18px] tracking-tight">{value}</p>
    </div>
  );
}
