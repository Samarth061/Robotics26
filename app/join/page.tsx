import { PageHeader } from "@/components/PageHeader";
import { Tag } from "@/components/Tag";
import { MailingListForm } from "@/components/MailingListForm";
import { lab, admins } from "@/lib/data";

export const metadata = { title: "Join / Manage" };

const OTHER_ACTIONS = [
  "Join AI · Mechatronics · or both",
  "Join any subgroup",
  "Switch groups",
  "Update your interests",
  "Request Discord channel access",
];

export default function JoinPage() {
  // Collect admin emails for the Bcc list
  const adminEmails = admins
    .map((a) => a.email)
    .filter((e): e is string => Boolean(e));

  return (
    <>
      <PageHeader
        eyebrow="N° 06 · Membership"
        number="One form, multiple actions"
        title={<>Join. <span className="italic">Or change your mind.</span></>}
        lead={
          <>
            Fill in the form below and your request goes directly to the lab
            admins and professor from your own email address — no third-party
            service, nothing sent from this site.
          </>
        }
      />

      <div className="mx-auto max-w-[1240px] px-6 md:px-10 py-12 md:py-16">
        {/* ── Unsubscribe callout ── */}
        <div className="mb-12 p-5 border border-rule-strong bg-cream flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
              Quick action
            </p>
            <p className="mt-1 font-display text-[18px] tracking-tight">
              Unsubscribe from the mailing list
            </p>
            <p className="mt-1 text-[13.5px] text-mute leading-relaxed">
              Select &ldquo;Unsubscribe from the list&rdquo; in the form below,
              fill in your name and email, and send the pre-filled draft.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="#mailing-form"
              className="inline-flex items-center px-4 py-2.5 border border-rule-strong font-mono text-[11px] uppercase tracking-[0.12em] text-ink hover:bg-ink hover:text-paper transition-colors"
            >
              Go to form ↓
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* ── Sidebar ── */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-[80px] space-y-8">
              <div>
                <p className="kicker mb-4">Mailing list actions</p>
                <ul className="space-y-2.5">
                  {["Subscribe to the mailing list", "Unsubscribe from the mailing list"].map((a, i) => (
                    <li key={a} className="grid grid-cols-[28px_1fr] gap-3 items-baseline">
                      <span className="font-mono text-[11px] text-red uppercase tracking-[0.1em]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[15px] leading-snug">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="kicker mb-4">Other membership actions</p>
                <ul className="space-y-2.5">
                  {OTHER_ACTIONS.map((a, i) => (
                    <li key={a} className="grid grid-cols-[28px_1fr] gap-3 items-baseline">
                      <span className="font-mono text-[11px] text-mute uppercase tracking-[0.1em]">
                        {String(i + 3).padStart(2, "0")}
                      </span>
                      <span className="text-[15px] leading-snug text-mute">{a}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[13px] text-mute leading-relaxed">
                  For the actions above, use the{" "}
                  <a href="/contact" className="link-underline">Contact page</a>{" "}
                  to email an admin directly.
                </p>
              </div>

              <div className="p-5 bg-cream border border-rule">
                <p className="kicker">What happens next</p>
                <p className="mt-3 text-[14px] text-mute leading-relaxed">
                  Your email goes directly to {lab.professor.name} and all lab
                  admins. They&apos;ll update your mailing list status within a
                  few days.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Tag variant="default">Phase 1 · mailto</Tag>
                <Tag variant="subtle">Phase 3 · Self-serve</Tag>
              </div>
            </div>
          </aside>

          {/* ── Mailing list form ── */}
          <div className="lg:col-span-8 order-1 lg:order-2" id="mailing-form">
            <div className="mb-6 flex items-baseline justify-between gap-4 hairline-b pb-3">
              <div className="flex items-baseline gap-4">
                <span className="kicker">§ 01</span>
                <h2 className="font-display text-[24px] md:text-[26px] tracking-tight">
                  Mailing list
                </h2>
              </div>
              <span className="kicker">Subscribe · Unsubscribe</span>
            </div>

            <MailingListForm
              professorEmail={lab.professor.email}
              adminEmails={adminEmails}
            />
          </div>
        </div>
      </div>
    </>
  );
}
