"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveMeeting, type SaveState } from "@/app/admin/schedule/actions";
import type { GroupSlug, MeetingTrack, Meeting } from "@/types";

type SubOption = { slug: string; name: string; parentGroup: GroupSlug };

const inputClass =
  "w-full border border-rule px-3 py-2.5 text-[15px] bg-paper focus:outline-none focus:border-rule-strong";

// A stored ISO string carries the Eastern wall-clock in its first 16 chars
// (e.g. "2026-05-22T16:00:00-04:00" → "2026-05-22T16:00"), which is exactly the
// value a datetime-local input wants. (See toEasternISO in actions.ts.)
function toLocalInput(iso?: string): string {
  return iso ? iso.slice(0, 16) : "";
}

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium tracking-tight transition-colors duration-200 bg-red text-paper hover:bg-red-deep disabled:opacity-50"
    >
      {pending ? "Saving…" : editing ? "Save changes" : "Add meeting"}
    </button>
  );
}

export function MeetingForm({
  subgroups,
  meeting,
}: {
  subgroups: SubOption[];
  meeting?: Meeting;
}) {
  const [state, formAction] = useActionState<SaveState, FormData>(saveMeeting, {});
  // Most meetings are lab-wide, so default new ones to "general".
  const [group, setGroup] = useState<MeetingTrack>(meeting?.parentGroup ?? "general");
  const [repeat, setRepeat] = useState<"none" | "weekly" | "biweekly">("none");

  const isTrack = group === "ai" || group === "mechatronics";
  const subsForGroup = subgroups.filter((s) => s.parentGroup === group);

  return (
    <form action={formAction} className="max-w-[640px] space-y-5">
      {meeting ? <input type="hidden" name="id" value={meeting.id} /> : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="kicker">Presenter</span>
          <input
            name="presenter"
            type="text"
            required
            defaultValue={meeting?.presenter ?? ""}
            className={`mt-2 ${inputClass}`}
          />
        </label>

        <label className="block">
          <span className="kicker">Date &amp; time</span>
          <input
            name="date"
            type="datetime-local"
            required
            defaultValue={toLocalInput(meeting?.date)}
            className={`mt-2 ${inputClass}`}
          />
        </label>
      </div>

      <label className="block">
        <span className="kicker">Topic</span>
        <input
          name="topic"
          type="text"
          required
          defaultValue={meeting?.topic ?? ""}
          placeholder="Paper title or session topic"
          className={`mt-2 ${inputClass}`}
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="kicker">Group</span>
          <select
            name="parentGroup"
            required
            value={group}
            onChange={(e) => setGroup(e.target.value as MeetingTrack)}
            className={`mt-2 ${inputClass}`}
          >
            <option value="general">General (lab-wide)</option>
            <option value="ai">AI Group</option>
            <option value="mechatronics">Mechatronics Group</option>
          </select>
        </label>

        <label className="block">
          <span className="kicker">Subgroup (optional)</span>
          <select
            name="subgroupSlug"
            defaultValue={meeting?.subgroupSlug ?? ""}
            disabled={!isTrack}
            className={`mt-2 ${inputClass} disabled:opacity-50`}
          >
            <option value="">— none —</option>
            {subsForGroup.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* How to join — all optional, all public */}
      <fieldset className="border border-rule p-4 space-y-5">
        <legend className="kicker px-1">How to join</legend>
        <p className="text-[12px] text-mute leading-relaxed -mt-1">
          Shown publicly on the Schedule page — leave a field blank to keep it
          off the site.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="block">
            <span className="kicker">Location</span>
            <input
              name="location"
              type="text"
              required
              defaultValue={meeting?.location ?? "Zoom"}
              className={`mt-2 ${inputClass}`}
            />
          </label>

          <label className="block">
            <span className="kicker">Zoom link</span>
            <input
              name="zoomUrl"
              type="url"
              defaultValue={meeting?.zoomUrl ?? ""}
              placeholder="https://ncsu.zoom.us/j/…"
              className={`mt-2 ${inputClass}`}
            />
          </label>

          <label className="block">
            <span className="kicker">Zoom meeting ID</span>
            <input
              name="zoomMeetingId"
              type="text"
              defaultValue={meeting?.zoomMeetingId ?? ""}
              placeholder="812 1234 5678"
              className={`mt-2 ${inputClass}`}
            />
          </label>

          <label className="block">
            <span className="kicker">Zoom passcode</span>
            <input
              name="zoomPasscode"
              type="text"
              defaultValue={meeting?.zoomPasscode ?? ""}
              placeholder="optional"
              className={`mt-2 ${inputClass}`}
            />
          </label>
        </div>
      </fieldset>

      <label className="block">
        <span className="kicker">Paper URL (optional)</span>
        <input
          name="paperUrl"
          type="url"
          defaultValue={meeting?.paperUrl ?? ""}
          placeholder="https://arxiv.org/abs/…"
          className={`mt-2 ${inputClass}`}
        />
      </label>

      {/* Repeat — only when creating a new meeting */}
      {!meeting ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="block">
            <span className="kicker">Repeat</span>
            <select
              name="repeat"
              value={repeat}
              onChange={(e) =>
                setRepeat(e.target.value as "none" | "weekly" | "biweekly")
              }
              className={`mt-2 ${inputClass}`}
            >
              <option value="none">Just once</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Every 2 weeks</option>
            </select>
          </label>

          <label className="block">
            <span className="kicker">Times</span>
            <input
              name="times"
              type="number"
              min={1}
              max={52}
              defaultValue={1}
              disabled={repeat === "none"}
              className={`mt-2 ${inputClass} disabled:opacity-50`}
            />
            <span className="mt-1 block text-[11px] text-mute">
              How many meetings to create, including the first.
            </span>
          </label>
        </div>
      ) : null}

      {state.error ? (
        <p className="text-[14px] text-red border border-red/30 bg-red-tint px-3 py-2">
          {state.error}
        </p>
      ) : null}

      <div className="pt-1">
        <SubmitButton editing={!!meeting} />
      </div>
    </form>
  );
}
