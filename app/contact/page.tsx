import { PageHeader } from "@/components/PageHeader";
import { FormEmbed } from "@/components/FormEmbed";
import { Tag } from "@/components/Tag";
import { lab, adminWithMember } from "@/lib/data";

const CATEGORIES = [
  "Join the group",
  "Update my group / subgroup",
  "Submit a resource",
  "Submit a project",
  "Ask an admin question",
  "Report a website issue",
];

export const metadata = { title: "Contact / Admins" };

export default function ContactPage() {
  const admins = adminWithMember();

  return (
    <>
      <PageHeader
        eyebrow="N° 07 · Contact"
        number="Routing hub"
        title={<><span className="italic">Reach</span> the admins.</>}
        lead={
          <>
            One form with a category dropdown — your message lands in the right
            inbox. For things that need a same-day reply, ping the relevant
            admin on Discord.
          </>
        }
      />

      <div className="mx-auto max-w-[1240px] px-6 md:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-baseline justify-between gap-4 hairline-b pb-3">
              <div className="flex items-baseline gap-4">
                <span className="kicker">§ 01</span>
                <h2 className="font-display text-[24px] md:text-[26px] tracking-tight">
                  Form
                </h2>
              </div>
              <span className="kicker">{CATEGORIES.length} categories</span>
            </div>

            <FormEmbed
              src={lab.formUrls.contact}
              title="Lab contact form"
              fallbackTitle="Contact form coming online."
              fallbackBody="The Google Form with a category dropdown will live here. While it's being set up, email any admin directly using the handles on the right."
            />

            <p className="mt-5 kicker">Categories</p>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {CATEGORIES.map((c, i) => (
                <li
                  key={c}
                  className="grid grid-cols-[28px_1fr] gap-3 items-baseline text-[14px]"
                >
                  <span className="font-mono text-[11px] text-mute uppercase tracking-[0.1em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-5">
            <div className="mb-6 flex items-baseline justify-between gap-4 hairline-b pb-3">
              <div className="flex items-baseline gap-4">
                <span className="kicker">§ 02</span>
                <h2 className="font-display text-[24px] md:text-[26px] tracking-tight">
                  Admins
                </h2>
              </div>
              <span className="kicker">{admins.length}</span>
            </div>

            <ul>
              {admins.map(({ admin, member }) => (
                <li
                  key={admin.memberSlug}
                  className="grid grid-cols-[1fr_auto] gap-4 py-4 hairline-b items-baseline"
                >
                  <div>
                    <p className="font-display text-[20px] tracking-tight">
                      {member.name}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-mute uppercase tracking-[0.1em]">
                      {admin.role}
                    </p>
                  </div>
                  {admin.discordHandle ? (
                    <Tag variant="default">{admin.discordHandle}</Tag>
                  ) : null}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[14px] text-mute leading-relaxed">
              For urgent issues — broken hardware, schedule conflicts day-of —
              ping <span className="font-mono text-ink">#help</span> on Discord.
              The website is the source of truth; Discord is where the lab
              actually lives day-to-day.
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
