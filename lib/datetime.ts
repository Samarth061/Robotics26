// Meeting date/time formatting, pinned to NC State's timezone.
//
// IMPORTANT: do NOT format meeting dates with new Date(iso).getHours()/getDate()/…
// — those use the *render server's* timezone, which is Eastern on a local Mac but
// UTC on Vercel. That makes a 4:00 PM meeting show as 8:00 PM in production. Always
// format in America/New_York explicitly via this helper.
//
// This module intentionally avoids `server-only` so it can be used from any
// component (server or client).

const TZ = "America/New_York";

export interface MeetingDateParts {
  weekday: string; // "FRI"
  day: string; // "22"
  month: string; // "MAY"
  year: string; // "2026"
  time: string; // "4:00 PM"
}

export function meetingDateParts(iso: string): MeetingDateParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(new Date(iso));

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return {
    weekday: get("weekday").toUpperCase(),
    day: get("day"),
    month: get("month").toUpperCase(),
    year: get("year"),
    time: `${get("hour")}:${get("minute")} ${get("dayPeriod").toUpperCase()}`,
  };
}
