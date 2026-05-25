"use client";

import { useState } from "react";
import { ComposeLinks } from "@/components/ComposeLinks";

type Action = "subscribe" | "unsubscribe";
type GroupChoice = "ai" | "mechatronics" | "both";

interface Props {
  professorEmail: string;
  adminEmails: string[];
}

export function MailingListForm({ professorEmail, adminEmails }: Props) {
  const [action, setAction] = useState<Action>("subscribe");
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [group, setGroup]   = useState<GroupChoice>("both");
  const [note, setNote]     = useState("");

  const ready = name.trim().length > 0 && email.trim().length > 0;

  const groupLabel =
    group === "both" ? "AI + Mechatronics" :
    group === "ai"   ? "AI Group" :
                       "Mechatronics Group";

  const subject = `[Robotics Lab] ${action === "subscribe" ? "Subscribe" : "Unsubscribe"} request — ${name.trim() || "?"}`;

  const bodyLines = [
    `Action : ${action === "subscribe" ? "Subscribe to mailing list" : "Unsubscribe from mailing list"}`,
    `Name   : ${name.trim()  || "—"}`,
    `Email  : ${email.trim() || "—"}`,
    action === "subscribe" ? `Group  : ${groupLabel}` : null,
    note.trim() ? `\nNote:\n${note.trim()}` : null,
    `\n— Submitted via the Robotics Lab website`,
  ].filter(Boolean).join("\n");

  const inputClass =
    "w-full px-3 py-2.5 border border-rule bg-paper font-mono text-[13px] text-ink placeholder:text-mute-light focus:outline-none focus:border-rule-strong transition-colors";

  const radioBtn = (value: Action, label: string) => (
    <button
      type="button"
      onClick={() => setAction(value)}
      className={`flex-1 py-3 px-4 border font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
        action === value
          ? "border-red bg-red-tint text-red"
          : "border-rule text-mute hover:border-rule-strong hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Action toggle */}
      <div>
        <p className="kicker mb-3">I want to…</p>
        <div className="flex gap-3">
          {radioBtn("subscribe",   "Subscribe to the list")}
          {radioBtn("unsubscribe", "Unsubscribe from the list")}
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="kicker block mb-1.5">Full name</label>
          <input
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="kicker block mb-1.5">Email address</label>
          <input
            type="email"
            placeholder="jdoe@ncsu.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Group interest — only for subscribe */}
      {action === "subscribe" && (
        <div>
          <p className="kicker mb-3">Group interest</p>
          <div className="flex gap-3 flex-wrap">
            {(["both", "ai", "mechatronics"] as GroupChoice[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroup(g)}
                className={`px-4 py-2 border font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                  group === g
                    ? "border-red bg-red-tint text-red"
                    : "border-rule text-mute hover:border-rule-strong hover:text-ink"
                }`}
              >
                {g === "both" ? "AI + Mechatronics" : g === "ai" ? "AI Group" : "Mechatronics Group"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Optional note */}
      <div>
        <label className="kicker block mb-1.5">Note <span className="text-mute-light normal-case font-sans text-[12px]">optional</span></label>
        <textarea
          rows={3}
          placeholder="Anything the admins should know…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* How it works */}
      <div className="p-4 border border-rule bg-cream text-[13px] text-mute leading-relaxed">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink">How this works · </span>
        Clicking &ldquo;Open in Gmail&rdquo; or &ldquo;Open in mail app&rdquo; below will open a
        pre-filled draft in <em>your own</em> email. You review it and hit send —
        it goes directly to the lab admins and professor from your address.
      </div>

      {/* Compose buttons */}
      <div>
        <p className="kicker mb-3">
          {ready ? "Ready — open your email to send" : "Fill in your name and email first"}
        </p>
        {ready ? (
          <ComposeLinks
            to={[professorEmail]}
            bcc={adminEmails}
            subject={subject}
            body={bodyLines}
          />
        ) : (
          <div className="flex flex-wrap gap-3 opacity-40 pointer-events-none select-none">
            <span className="inline-flex items-center px-4 py-2.5 border border-red/30 text-red bg-red-tint font-mono text-[11px] uppercase tracking-[0.1em]">Open in Gmail</span>
            <span className="inline-flex items-center px-4 py-2.5 border border-rule-strong text-ink font-mono text-[11px] uppercase tracking-[0.1em]">Open in mail app</span>
            <span className="inline-flex items-center px-4 py-2.5 border border-rule-strong text-ink font-mono text-[11px] uppercase tracking-[0.1em]">Copy addresses</span>
          </div>
        )}
      </div>
    </div>
  );
}
