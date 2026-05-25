"use client";

import { useState } from "react";
import {
  buildMailtoUrl,
  buildGmailComposeUrl,
  dedupeEmails,
  type ComposeFields,
} from "@/lib/mailto";

// Self-contained compose buttons: Open in Gmail · Open in mail app · Copy.
// No page-specific dependencies — drop it in anywhere and pass recipients.
// Shared by the professor group-mailer and any future mailer (mail-to-admins).
export function ComposeLinks({ to, cc, bcc, subject, body }: ComposeFields) {
  const [copied, setCopied] = useState(false);

  const fields: ComposeFields = { to, cc, bcc, subject, body };
  const allRecipients = dedupeEmails([
    ...(to ?? []),
    ...(cc ?? []),
    ...(bcc ?? []),
  ]);
  const disabled = allRecipients.length === 0;

  async function copyAddresses() {
    try {
      await navigator.clipboard.writeText(allRecipients.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable (e.g. non-secure context) — ignore.
    }
  }

  const base =
    "inline-flex items-center justify-center px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] border transition-colors";

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={disabled ? undefined : buildGmailComposeUrl(fields)}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={disabled}
        className={`${base} ${
          disabled
            ? "border-rule text-mute-light pointer-events-none"
            : "border-red/30 text-red bg-red-tint hover:bg-red hover:text-paper"
        }`}
      >
        Open in Gmail
      </a>

      <a
        href={disabled ? undefined : buildMailtoUrl(fields)}
        aria-disabled={disabled}
        className={`${base} ${
          disabled
            ? "border-rule text-mute-light pointer-events-none"
            : "border-rule-strong text-ink hover:bg-ink hover:text-paper"
        }`}
      >
        Open in mail app
      </a>

      <button
        type="button"
        onClick={copyAddresses}
        disabled={disabled}
        className={`${base} ${
          disabled
            ? "border-rule text-mute-light cursor-not-allowed"
            : "border-rule-strong text-ink hover:bg-cream"
        }`}
      >
        {copied ? "Copied ✓" : "Copy addresses"}
      </button>
    </div>
  );
}
