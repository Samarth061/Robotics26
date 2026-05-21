import Link from "next/link";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";
const base =
  "inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium tracking-tight transition-colors duration-200";

const styles: Record<Variant, string> = {
  primary: "bg-red text-paper hover:bg-red-deep",
  outline: "border border-ink text-ink hover:border-red hover:text-red",
  ghost: "text-ink hover:text-red",
};

interface ButtonProps {
  href?: string;
  variant?: Variant;
  external?: boolean;
  className?: string;
  children: ReactNode;
}

export function Button({
  href,
  variant = "primary",
  external,
  className = "",
  children,
}: ButtonProps & ComponentPropsWithoutRef<"a">) {
  const cls = `${base} ${styles[variant]} ${className}`;

  if (!href) {
    return <button className={cls}>{children}</button>;
  }
  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cls}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
