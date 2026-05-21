import Link from "next/link";

interface FormEmbedProps {
  src?: string;
  title: string;
  height?: number;
  fallbackTitle?: string;
  fallbackBody?: string;
}

export function FormEmbed({
  src,
  title,
  height = 760,
  fallbackTitle = "Form coming soon.",
  fallbackBody = "We're finalizing the embed. In the meantime, reach an admin via the Contact page.",
}: FormEmbedProps) {
  if (src) {
    return (
      <div className="border border-rule bg-paper">
        <iframe
          src={src}
          title={title}
          width="100%"
          height={height}
          loading="lazy"
          className="block w-full"
        >
          Loading…
        </iframe>
      </div>
    );
  }

  return (
    <div className="border border-rule bg-cream p-8 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
           style={{
             backgroundImage:
               "repeating-linear-gradient(45deg, var(--color-ink) 0 1px, transparent 1px 14px)",
           }}
           aria-hidden
      />
      <div className="relative">
        <p className="kicker">Placeholder · drop a Google Form URL into <code className="font-mono">data/lab.json</code></p>
        <p className="mt-4 font-display text-[28px] leading-tight tracking-tight max-w-[24ch]">
          {fallbackTitle}
        </p>
        <p className="mt-3 text-[14px] text-mute max-w-[52ch]">{fallbackBody}</p>
        <Link
          href="/contact"
          className="mt-6 inline-block font-mono text-[12px] uppercase tracking-[0.14em] text-red link-underline"
        >
          Email an admin →
        </Link>
      </div>
    </div>
  );
}
