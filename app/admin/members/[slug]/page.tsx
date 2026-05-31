import Link from "next/link";
import { notFound } from "next/navigation";
import { getMemberBySlug, subgroups } from "@/lib/data";
import { MemberForm } from "@/components/MemberForm";

export const metadata = {
  title: "Admin · Edit member",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const subOptions = subgroups.map((s) => ({
  slug: s.slug,
  name: s.name,
  parentGroup: s.parentGroup,
}));

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await getMemberBySlug(slug);
  if (!member) notFound();

  return (
    <div className="mx-auto max-w-[1240px] px-6 md:px-10 pt-12 md:pt-16 pb-16">
      <div className="flex items-baseline justify-between gap-4">
        <p className="kicker">Admin · Edit member</p>
        <Link href="/admin/members" className="kicker link-underline">
          ← Back
        </Link>
      </div>

      <h1 className="mt-5 font-display text-[clamp(32px,5vw,52px)] leading-[0.98] tracking-[-0.02em]">
        Edit <span className="italic">member</span>.
      </h1>

      <div className="mt-10">
        <MemberForm subgroups={subOptions} member={member} />
      </div>
    </div>
  );
}
