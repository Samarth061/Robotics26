"use client";

import { useState } from "react";
import { ComposeLinks } from "@/components/ComposeLinks";

export interface Audience {
  id: string;
  label: string;
  kind: "Org" | "Group" | "Subgroup";
  people: { name: string; email: string }[];
}

const KIND_ORDER: Audience["kind"][] = ["Org", "Group", "Subgroup"];
const KIND_LABEL: Record<Audience["kind"], string> = {
  Org: "Whole org",
  Group: "Groups",
  Subgroup: "Subgroups",
};

export function EmailComposer({
  audiences,
  from,
}: {
  audiences: Audience[];
  from: string;
}) {
  const [selectedId, setSelectedId] = useState(audiences[0]?.id ?? "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const selected =
    audiences.find((a) => a.id === selectedId) ?? audiences[0];
  const recipients = selected?.people ?? [];
  const emails = recipients.map((p) => p.email);

  const inputClass =
    "w-full border border-rule px-3 py-2.5 text-[15px] bg-paper focus:outline-none focus:border-rule-strong";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      {/* Compose column */}
      <div className="lg:col-span-7">
        <div className="mb-6 flex items-baseline justify-between gap-4 hairline-b pb-3">
          <div className="flex items-baseline gap-4">
            <span className="kicker">§ 01</span>
            <h2 className="font-display text-[24px] md:text-[26px] tracking-tight">
              Compose
            </h2>
          </div>
          <span className="kicker">From {from}</span>
        </div>

        <label className="block">
          <span className="kicker">Audience</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className={`mt-2 ${inputClass}`}
          >
            {KIND_ORDER.map((kind) => {
              const items = audiences.filter((a) => a.kind === kind);
              if (items.length === 0) return null;
              return (
                <optgroup key={kind} label={KIND_LABEL[kind]}>
                  {items.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label} ({a.people.length})
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </label>

        <label className="mt-5 block">
          <span className="kicker">Subject</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Optional — you can also write it in your mail app"
            className={`mt-2 ${inputClass}`}
          />
        </label>

        <label className="mt-5 block">
          <span className="kicker">Preamble</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Optional opening text — pre-fills the message body"
            className={`mt-2 ${inputClass} resize-y`}
          />
        </label>

        <div className="mt-7">
          <p className="kicker mb-3">Open a pre-filled draft</p>
          <ComposeLinks
            to={[from]}
            bcc={emails}
            subject={subject}
            body={body}
          />
          <p className="mt-4 text-[13.5px] text-mute leading-relaxed">
            Nothing is sent from this site. The draft opens in your own mail app
            or Gmail with you in <span className="font-mono text-ink">To</span>{" "}
            and the {recipients.length} recipient
            {recipients.length === 1 ? "" : "s"} in{" "}
            <span className="font-mono text-ink">Bcc</span> (hidden from each
            other). Review and send it yourself.
          </p>
        </div>
      </div>

      {/* Recipients column */}
      <aside className="lg:col-span-5">
        <div className="mb-6 flex items-baseline justify-between gap-4 hairline-b pb-3">
          <div className="flex items-baseline gap-4">
            <span className="kicker">§ 02</span>
            <h2 className="font-display text-[24px] md:text-[26px] tracking-tight">
              Recipients
            </h2>
          </div>
          <span className="kicker">{recipients.length}</span>
        </div>

        {recipients.length === 0 ? (
          <p className="text-[14px] text-mute">
            No members with an email in this audience.
          </p>
        ) : (
          <ul>
            {recipients.map((p) => (
              <li key={p.email} className="py-3 hairline-b">
                <p className="text-[15px] tracking-tight">{p.name}</p>
                <p className="mt-0.5 font-mono text-[11.5px] text-mute tracking-[0.02em]">
                  {p.email}
                </p>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
