import { PageHeader } from "@/components/PageHeader";
import { Tag } from "@/components/Tag";
import { adminWithMember } from "@/lib/data";
import { ContactForm } from "@/components/ContactForm";

export const metadata = { title: "Contact / Admins" };

export default function ContactPage() {
  const admins = adminWithMember();
  const adminEmails = admins.map(a => a.admin.email).filter(Boolean) as string[];

  return (
    <>
      <PageHeader
        eyebrow="N° 07 · Contact"
        number="Routing hub"
        title={<><span className="italic">Reach</span> the admins.</>}
        lead={
          <>
            Pick a category, write your message, and it reaches all four
            admins. For things that need a same-day reply, ping an admin on
            Discord or email directly.
          </>
        }
      />

      <div className="mx-auto max-w-[1240px] px-6 md:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-baseline gap-4 hairline-b pb-3">
              <div className="flex items-baseline gap-4">
                <span className="kicker">§ 01</span>
                <h2 className="font-display text-[24px] md:text-[26px] tracking-tight">
                  Form
                </h2>
              </div>
            </div>

            <ContactForm adminEmails={adminEmails} />
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
                  className="py-4 hairline-b"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-display text-[20px] tracking-tight">
                      {member.name}
                    </p>
                    {admin.discordHandle ? (
                      <Tag variant="default">{admin.discordHandle}</Tag>
                    ) : null}
                  </div>
                  {admin.email ? (
                    <a
                      href={`mailto:${admin.email}`}
                      className="mt-1.5 inline-block font-mono text-[11.5px] text-mute link-underline tracking-[0.02em]"
                    >
                      {admin.email}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[14px] text-mute leading-relaxed">
              For urgent issues (broken hardware or a day-of schedule conflict),
              ping <span className="font-mono text-ink">#help</span> on Discord.
              The website is the source of truth; Discord is where the club
              actually lives day-to-day.
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
