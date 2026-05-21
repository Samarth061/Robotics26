import { PageHeader } from "@/components/PageHeader";
import { FormEmbed } from "@/components/FormEmbed";
import { Tag } from "@/components/Tag";
import { lab } from "@/lib/data";

export const metadata = { title: "Join / Manage" };

const ACTIONS = [
  "Subscribe to the mailing list",
  "Unsubscribe",
  "Join AI · Mechatronics · or both",
  "Join any subgroup",
  "Switch groups",
  "Update your interests",
  "Request Discord channel access",
];

export default function JoinPage() {
  return (
    <>
      <PageHeader
        eyebrow="N° 06 · Membership"
        number="One form, multiple actions"
        title={<>Join. <span className="italic">Or change your mind.</span></>}
        lead={
          <>
            For Phase 1 we route everything through a single form. Admins review
            submissions and update your access — usually within a few days. A
            self-serve profile page arrives in Phase 3.
          </>
        }
      />

      <div className="mx-auto max-w-[1240px] px-6 md:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <aside className="lg:col-span-4">
            <p className="kicker">Use this form to…</p>
            <ul className="mt-5 space-y-2.5">
              {ACTIONS.map((a, i) => (
                <li
                  key={a}
                  className="grid grid-cols-[28px_1fr] gap-3 items-baseline"
                >
                  <span className="font-mono text-[11px] text-red uppercase tracking-[0.1em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] leading-snug">{a}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 p-5 bg-cream border border-rule">
              <p className="kicker">What happens next</p>
              <p className="mt-3 text-[14px] text-mute leading-relaxed">
                Admins review the response, add you to the relevant Discord
                channels, and confirm by email within a few days.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <Tag variant="default">Phase 1 · Google Form</Tag>
              <Tag variant="subtle">Phase 3 · Self-serve</Tag>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <FormEmbed
              src={lab.formUrls.join}
              title="Lab join / manage form"
              fallbackTitle="Join form coming online."
              fallbackBody="Once the Google Form is wired into data/lab.json (formUrls.join), the iframe replaces this card. For now, drop a note via the contact form."
            />
          </div>
        </div>
      </div>
    </>
  );
}
