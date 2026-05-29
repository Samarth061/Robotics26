import Link from "next/link";

export function Wordmark({ shortName }: { shortName: string }) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 text-ink hover:text-ink"
      aria-label="Home"
    >
      {/* Trying the SVG lockup, served as-is with a plain <img> (no next/image,
          so no aspect-ratio or preload dev warnings). Sized by height; width
          follows the file's own aspect ratio. NOTE: this SVG has an opaque
          #ECE8E7 (cream) background baked in — it shows a cream box and won't
          blend with the page (especially in dark mode). Swap src back to
          "/Robotics_Logo.png", or strip the background rect, to change that. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Robotics_Logo.svg"
        alt=""
        aria-hidden
        className="h-6 w-auto"
      />
      <span className="font-display text-[19px] tracking-tight leading-none">
        {shortName}
      </span>
    </Link>
  );
}
