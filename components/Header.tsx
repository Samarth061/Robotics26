"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "./Wordmark";

const NAV = [
  { href: "/members", label: "Members" },
  { href: "/groups", label: "Groups" },
  { href: "/resources", label: "Resources" },
  { href: "/schedule", label: "Schedule" },
  { href: "/join", label: "Join" },
  { href: "/contact", label: "Contact" },
];

export function Header({ shortName }: { shortName: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-paper/85 backdrop-blur-sm hairline-b">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <div className="flex h-[64px] items-center justify-between">
          <Wordmark shortName={shortName} />

          <nav className="hidden md:flex items-center gap-7">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[14px] tracking-tight pb-1 link-underline ${
                    active ? "link-underline-active" : "text-ink/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/join"
            className="md:hidden font-mono text-[11px] tracking-[0.14em] uppercase text-red"
          >
            Join →
          </Link>
        </div>
      </div>
    </header>
  );
}
