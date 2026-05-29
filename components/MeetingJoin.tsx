import type { Meeting } from "@/types";
import { lab } from "@/lib/data";

// Renders "how to join" for a meeting. Join fields are optional and the site is
// public, so the professor only fills them when he wants the link/credentials
// public. When nothing is set, the `block` variant shows a quiet fallback
// pointing people to Discord / the contact page rather than an empty area.
//
//  - block  → hero + home next-meeting card (full join details)
//  - inline → list rows (compact "join" link only)

function hasJoinInfo(m: Meeting): boolean {
  return Boolean(m.zoomUrl || m.zoomMeetingId || m.zoomPasscode);
}

export function MeetingJoin({
  meeting,
  variant = "block",
}: {
  meeting: Meeting;
  variant?: "inline" | "block";
}) {
  if (variant === "inline") {
    if (!meeting.zoomUrl) return null;
    return (
      <a
        href={meeting.zoomUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[11px] uppercase tracking-[0.1em] text-mute link-underline"
      >
        ▸ join
      </a>
    );
  }

  // block
  if (!hasJoinInfo(meeting)) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
        Join link shared with members ·{" "}
        {lab.discordInviteUrl ? (
          <a
            href={lab.discordInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-ink"
          >
            Discord
          </a>
        ) : (
          <a href="/contact" className="link-underline text-ink">
            contact an admin
          </a>
        )}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {meeting.zoomUrl ? (
        <a
          href={meeting.zoomUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 px-4 py-2 text-[13px] font-medium tracking-tight bg-red text-paper hover:bg-red-deep transition-colors duration-200"
        >
          ▸ Join Zoom
        </a>
      ) : null}
      {meeting.zoomMeetingId || meeting.zoomPasscode ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mute">
          {meeting.zoomMeetingId ? (
            <>Mtg <span className="text-ink">{meeting.zoomMeetingId}</span></>
          ) : null}
          {meeting.zoomMeetingId && meeting.zoomPasscode ? " · " : null}
          {meeting.zoomPasscode ? (
            <>Passcode <span className="text-ink">{meeting.zoomPasscode}</span></>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
