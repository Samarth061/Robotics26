import Link from "next/link";
import { allMembers, subgroups } from "@/lib/data";
import { MemberForm } from "@/components/MemberForm";
import { deleteMember } from "./actions";
import type { Member } from "@/types";

export const metadata = {
  title: "Admin · Member manager",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const subOptions = subgroups.map((s) => ({
  slug: s.slug,
  name: s.name,
  parentGroup: s.parentGroup,
}));

function MemberAdminRow({ m }: { m: Member }) {
  const groups = m.groups.length > 0 ? m.groups.join(", ") : "faculty/none";
  const statusLabel = m.status && m.status !== "active" ? ` · ${m.status}` : "";
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 items-start py-4 hairline-b">
      <div className="min-w-0">
        <p className="font-display text-[17px] leading-snug tracking-tight">
          {m.name}
          {m.isAdmin ? (
            <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-red">
              Admin
            </span>
          ) : null}
        </p>
        <p className="mt-1 text-[13px] text-mute">
          {groups}{statusLabel}
          {m.email ? ` · ${m.email}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-4 pt-1 shrink-0">
        <Link
          href={`/admin/members/${m.slug}`}
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-mute link-underline"
        >
          Edit
        </Link>
        <form action={deleteMember}>
          <input type="hidden" name="slug" value={m.slug} />
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

export default async function AdminMembersPage() {
  const all = await allMembers();

  return (
    <div className="mx-auto max-w-[1240px] px-6 md:px-10 pt-12 md:pt-16 pb-16">
      <div className="flex items-baseline justify-between gap-4">
        <p className="kicker">Admin · Member manager</p>
        <p className="kicker">Gated</p>
      </div>

      <h1 className="mt-5 font-display text-[clamp(32px,5vw,52px)] leading-[0.98] tracking-[-0.02em]">
        Add a <span className="italic">member</span>.
      </h1>
      <p className="mt-4 max-w-[60ch] text-[15px] text-mute leading-relaxed">
        Add a member and they appear on the public Members page right away.
        Edit or remove anyone below.
      </p>

      {/* § 01 — Add member */}
      <section className="mt-10">
        <div className="flex items-baseline gap-4 mb-6 hairline-b pb-3">
          <span className="kicker">§ 01</span>
          <h2 className="font-display text-[22px] md:text-[24px] tracking-tight">
            New member
          </h2>
        </div>
        <MemberForm subgroups={subOptions} />
      </section>

      {/* § 02 — All members */}
      <section className="mt-16">
        <div className="flex items-baseline justify-between gap-4 mb-2 hairline-b pb-3">
          <div className="flex items-baseline gap-4">
            <span className="kicker">§ 02</span>
            <h2 className="font-display text-[22px] md:text-[24px] tracking-tight">
              All members
            </h2>
          </div>
          <span className="kicker">{all.length} total</span>
        </div>
        {all.length === 0 ? (
          <p className="py-4 text-[14px] text-mute">
            No members yet. Add one above.
          </p>
        ) : (
          all.map((m) => <MemberAdminRow key={m.slug} m={m} />)
        )}
      </section>
    </div>
  );
}
