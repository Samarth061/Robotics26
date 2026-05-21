import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  number?: string;
}

export function PageHeader({ eyebrow, title, lead, number }: PageHeaderProps) {
  return (
    <header className="pt-16 md:pt-24 pb-12 md:pb-16 hairline-b">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10 stagger">
        <div className="flex items-baseline justify-between gap-4">
          <p className="kicker">{eyebrow}</p>
          {number ? <p className="kicker">{number}</p> : null}
        </div>
        <h1 className="mt-5 font-display text-[clamp(44px,7vw,96px)] leading-[0.95] tracking-[-0.02em] text-ink max-w-[18ch]">
          {title}
        </h1>
        {lead ? (
          <p className="mt-8 max-w-[60ch] text-[17px] md:text-[19px] leading-relaxed text-mute">
            {lead}
          </p>
        ) : null}
      </div>
    </header>
  );
}
