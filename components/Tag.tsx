import { ReactNode } from "react";

type Variant = "default" | "accent" | "solid" | "subtle";

const styles: Record<Variant, string> = {
  default: "border border-rule text-mute bg-paper",
  subtle:  "bg-cream text-ink/70",
  accent:  "border border-red/30 text-red bg-red-tint",
  solid:   "bg-ink text-paper",
};

export function Tag({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] font-mono text-[10.5px] uppercase tracking-[0.1em] whitespace-nowrap ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
