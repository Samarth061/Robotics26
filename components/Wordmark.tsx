import Link from "next/link";

export function Wordmark({ shortName }: { shortName: string }) {
  return (
    <Link
      href="/"
      className="group inline-flex items-baseline gap-2.5 text-ink hover:text-ink"
      aria-label="Home"
    >
      <span
        aria-hidden
        className="inline-block w-2 h-2 translate-y-[-2px] bg-red transition-transform duration-300 group-hover:rotate-45"
      />
      <span className="font-display text-[19px] tracking-tight leading-none">
        {shortName}
      </span>
    </Link>
  );
}
