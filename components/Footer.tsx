import Link from "next/link";
import { lab, adminWithMember } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();
  const admins = adminWithMember();

  return (
    <footer className="mt-32 hairline-t">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="kicker">N° 01 · {lab.institution}</p>
            <p className="mt-4 font-display text-[28px] leading-[1.1] tracking-tight">
              {lab.name}
            </p>
            <p className="mt-3 text-mute text-[14px] leading-relaxed max-w-[44ch]">
              {lab.mission}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="kicker">Navigate</p>
            <ul className="mt-4 space-y-2 text-[14px]">
              <li><Link href="/members" className="link-underline">Members</Link></li>
              <li><Link href="/groups" className="link-underline">Groups</Link></li>
              <li><Link href="/resources" className="link-underline">Resources</Link></li>
              <li><Link href="/schedule" className="link-underline">Schedule</Link></li>
              <li><Link href="/join" className="link-underline">Join / Manage</Link></li>
              <li><Link href="/contact" className="link-underline">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="kicker">Admins</p>
            <ul className="mt-4 space-y-2 text-[14px]">
              {admins.map(({ admin, member }) => (
                <li key={admin.memberSlug}>
                  <span className="font-display text-[15px]">{member.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 hairline-t flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
            EST. FY 2026 — Draft / Phase 1
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
            © {year} {lab.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
