// Pure helpers for building pre-filled email "compose" links.
//
// The site never sends mail itself — it constructs a link that opens the
// sender's own mail client (mailto:) or browser Gmail, pre-filled. The sender
// reviews and hits send from their own account, so the message genuinely
// originates from their address (e.g. an @ncsu.edu identity).
//
// Used by <ComposeLinks>, which both the professor group-mailer and any future
// mailer (e.g. mail-to-admins) share — keep this UI-free and dependency-free.

export interface ComposeFields {
  /** Visible recipients. */
  to?: string[];
  cc?: string[];
  /** Hidden recipients — use this for group blasts so recipients can't see each other. */
  bcc?: string[];
  subject?: string;
  body?: string;
}

/** Lowercase, trim, drop empties, and remove duplicates while preserving order. */
export function dedupeEmails(emails: (string | undefined | null)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of emails) {
    const email = raw?.trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    out.push(email);
  }
  return out;
}

/**
 * Build a `mailto:` URL. Addresses are left raw (plain emails are URL-safe);
 * subject/body are percent-encoded with spaces as %20 (per RFC 6068), which
 * mail clients handle more reliably than the `+` that URLSearchParams emits.
 */
export function buildMailtoUrl(fields: ComposeFields): string {
  const to = (fields.to ?? []).join(",");
  const cc = (fields.cc ?? []).join(",");
  const bcc = (fields.bcc ?? []).join(",");

  const params: string[] = [];
  if (cc) params.push(`cc=${cc}`);
  if (bcc) params.push(`bcc=${bcc}`);
  if (fields.subject) params.push(`subject=${encodeURIComponent(fields.subject)}`);
  if (fields.body) params.push(`body=${encodeURIComponent(fields.body)}`);

  const query = params.length ? `?${params.join("&")}` : "";
  return `mailto:${to}${query}`;
}

/**
 * Build a Gmail compose deep link for people who use Gmail in the browser.
 * Note Gmail uses `su` for the subject (not `subject`).
 */
export function buildGmailComposeUrl(fields: ComposeFields): string {
  const params = new URLSearchParams({ view: "cm", fs: "1" });

  const to = (fields.to ?? []).join(",");
  const cc = (fields.cc ?? []).join(",");
  const bcc = (fields.bcc ?? []).join(",");
  if (to) params.set("to", to);
  if (cc) params.set("cc", cc);
  if (bcc) params.set("bcc", bcc);
  if (fields.subject) params.set("su", fields.subject);
  if (fields.body) params.set("body", fields.body);

  return `https://mail.google.com/mail/?${params.toString()}`;
}
