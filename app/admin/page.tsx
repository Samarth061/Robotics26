import Link from "next/link";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// One tile per admin tool. Adding a future tool is a one-line edit here —
// this is the single discreet entry point for the gated /admin area.
const tools = [
  {
    href: "/admin/email",
    name: "Group mailer",
    desc: "Email the whole org, a group, or a subgroup — opens a pre-filled draft in your own mail app.",
  },
  {
    href: "/admin/schedule",
    name: "Meeting scheduler",
    desc: "Add, edit, or remove lab meetings — changes show on the public Schedule page right away.",
  },
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-[1240px] px-6 md:px-10 pt-12 md:pt-16 pb-16">
      <div className="flex items-baseline justify-between gap-4">
        <p className="kicker">Admin · Signed in</p>
        <p className="kicker">Gated</p>
      </div>

      <ul className="mt-8 hairline-t">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="group flex items-center justify-between gap-5 hairline-b py-5 transition-colors duration-200 hover:bg-cream/60"
            >
              <div>
                <h2 className="font-display text-[20px] leading-tight tracking-tight group-hover:text-red transition-colors duration-200">
                  {tool.name}
                </h2>
                <p className="mt-1 text-[14px] text-mute leading-relaxed max-w-[64ch]">
                  {tool.desc}
                </p>
              </div>
              <span
                aria-hidden
                className="shrink-0 font-mono text-[12px] text-mute transition-transform duration-300 group-hover:translate-x-1 group-hover:text-red"
              >
                Open &rarr;
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
