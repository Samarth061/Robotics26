"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/members",  label: "Members" },
  { href: "/groups",   label: "Groups" },
  { href: "/resources", label: "Resources" },
  { href: "/schedule", label: "Schedule" },
  { href: "/join",     label: "Join" },
  { href: "/contact",  label: "Contact" },
];

export function Header({ shortName }: { shortName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-paper/85 backdrop-blur-sm hairline-b">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <div className="flex h-[64px] items-center justify-between">
          <Wordmark shortName={shortName} />

          <div className="flex items-center gap-2 md:gap-5">
          {/* Desktop nav */}
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

          <ThemeToggle />

          {/* Mobile: hamburger button */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 -mr-1"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className={`block w-5 h-px bg-ink transition-all duration-200 origin-center ${
                open ? "rotate-45 translate-y-[6px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-px bg-ink transition-all duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-px bg-ink transition-all duration-200 origin-center ${
                open ? "-rotate-45 -translate-y-[6px]" : ""
              }`}
            />
          </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown nav */}
      {open && (
        <div className="md:hidden bg-paper hairline-b">
          <nav className="mx-auto max-w-[1240px] px-6 py-4 flex flex-col gap-0">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 hairline-b text-[16px] tracking-tight flex items-center justify-between ${
                    active ? "text-red" : "text-ink"
                  }`}
                >
                  {item.label}
                  <span className="font-mono text-[11px] text-mute">→</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
