"use client";

import { useState } from "react";
import { ComposeLinks } from "@/components/ComposeLinks";

const CATEGORIES = [
  "Join the group",
  "Update my group / subgroup",
  "Submit a resource",
  "Submit a project",
  "Ask an admin question",
  "Report a website issue",
];

interface Props {
  adminEmails: string[];
}

export function ContactForm({ adminEmails }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [category, setCategory]   = useState("");
  const [message, setMessage]     = useState("");

  const ready = fullName.trim().length > 0 && email.trim().length > 0 && category && message.trim().length > 0;

  const subject = `[Robotics Club Contact] ${category}: ${fullName.trim()}`;
  const body = [
    `Category : ${category}`,
    `From     : ${fullName.trim()} <${email.trim()}>`,
    `\nMessage:\n${message.trim()}`,
    `\nSubmitted via the Robotics Club website Contact Form`,
  ].join("\n");

  const inputClass = "w-full px-3 py-2.5 border border-rule bg-paper font-mono text-[13px] text-ink placeholder:text-mute-light focus:outline-none focus:border-rule-strong transition-colors";


  return (
    <div className="mt-6 space-y-6">
      <div className="space-y-5">
        <div>
          <label className="kicker block mb-1.5">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="kicker block mb-1.5">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="kicker block mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="kicker block mb-1.5">Message</label>
          <textarea
            rows={6}
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputClass} resize-none`}
            required
          />
        </div>
      </div>

      <div className="p-4 border border-rule bg-cream text-[13px] text-mute leading-relaxed rounded-md">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink font-bold">How this works · </span>
        Clicking &ldquo;Open in Gmail&rdquo; or &ldquo;Open in mail app&rdquo; will open a pre-filled draft in your own email. You review and send it directly from your inbox to the club admins.
      </div>

      <div>
        {ready ? (
          <ComposeLinks
            to={adminEmails}
            subject={subject}
            body={body}
          />
        ) : (
          <div className="flex flex-wrap gap-3 opacity-40 pointer-events-none select-none">
            <span className="inline-flex items-center px-4 py-2.5 border border-rule-strong text-ink font-mono text-[11px] uppercase tracking-[0.1em]">
              Open in Gmail
            </span>
            <span className="inline-flex items-center px-4 py-2.5 border border-rule-strong text-ink font-mono text-[11px] uppercase tracking-[0.1em]">
              Open in mail app
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
