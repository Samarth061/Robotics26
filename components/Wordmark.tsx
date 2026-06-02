import Link from "next/link";

export function Wordmark({ shortName }: { shortName: string }) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 text-ink hover:text-ink"
      aria-label="Home"
    >
      {/* SVG logo at h-14 (56px). Note: if the SVG has a baked-in background
          rect it may show as a box in dark mode — crop or remove it if so. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Robotics_Logo.svg"
        alt=""
        aria-hidden
        className="h-12 w-auto"
      />
      <span className="font-display text-[19px] tracking-tight leading-none">
        {shortName}
      </span>
    </Link>
  );
}
