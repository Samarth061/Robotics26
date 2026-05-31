"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveResource, type ResourceSaveState } from "@/app/admin/resources/actions";
import type { Resource, ResourceType } from "@/types";

type SubOption = { slug: string; name: string };

const TYPES: ResourceType[] = ["Paper", "Video", "Project", "Tutorial", "Dataset"];

const inputClass =
  "w-full border border-rule px-3 py-2.5 text-[15px] bg-paper focus:outline-none focus:border-rule-strong";

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium tracking-tight transition-colors duration-200 bg-red text-paper hover:bg-red-deep disabled:opacity-50"
    >
      {pending ? "Saving…" : editing ? "Save changes" : "Add resource"}
    </button>
  );
}

export function ResourceForm({
  subgroups,
  resource,
}: {
  subgroups: SubOption[];
  resource?: Resource;
}) {
  const [state, formAction] = useActionState<ResourceSaveState, FormData>(
    saveResource,
    {},
  );

  // Track the comma-separated tags string as controlled state so it stays
  // populated when the form re-renders after a validation error.
  const [tagsValue, setTagsValue] = useState(
    resource?.tags?.join(", ") ?? "",
  );

  const editing = Boolean(resource);

  return (
    <form action={formAction} className="max-w-[640px] space-y-5">
      {resource ? <input type="hidden" name="id" value={resource.id} /> : null}

      {/* Title + Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="block sm:col-span-1">
          <span className="kicker">Title</span>
          <input
            name="title"
            type="text"
            required
            defaultValue={resource?.title ?? ""}
            placeholder="Paper / video / project title"
            className={`mt-2 ${inputClass}`}
          />
        </label>

        <label className="block">
          <span className="kicker">Type</span>
          <select
            name="type"
            required
            defaultValue={resource?.type ?? "Paper"}
            className={`mt-2 ${inputClass}`}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* URL */}
      <label className="block">
        <span className="kicker">URL</span>
        <input
          name="url"
          type="url"
          required
          defaultValue={resource?.url ?? ""}
          placeholder="https://arxiv.org/abs/…"
          className={`mt-2 ${inputClass}`}
        />
      </label>

      {/* Description */}
      <label className="block">
        <span className="kicker">Short description</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={resource?.description ?? ""}
          placeholder="One or two sentences on why this is useful."
          className={`mt-2 ${inputClass} resize-none`}
        />
      </label>

      {/* Subgroup + Recommended by */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="kicker">Subgroup</span>
          <select
            name="subgroupSlug"
            defaultValue={resource?.subgroupSlug ?? ""}
            className={`mt-2 ${inputClass}`}
          >
            <option value="">General (lab-wide)</option>
            {subgroups.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="kicker">Recommended by</span>
          <input
            name="recommendedBy"
            type="text"
            required
            defaultValue={resource?.recommendedBy ?? ""}
            placeholder="Full name"
            className={`mt-2 ${inputClass}`}
          />
        </label>
      </div>

      {/* Tags + Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="kicker">Tags</span>
          <input
            name="tags"
            type="text"
            value={tagsValue}
            onChange={(e) => setTagsValue(e.target.value)}
            placeholder="transformer, attention, foundational"
            className={`mt-2 ${inputClass}`}
          />
          <span className="mt-1 block text-[11px] text-mute">
            Comma-separated.
          </span>
        </label>

        <label className="block">
          <span className="kicker">Date added</span>
          <input
            name="dateAdded"
            type="date"
            defaultValue={resource?.dateAdded ?? new Date().toISOString().slice(0, 10)}
            className={`mt-2 ${inputClass}`}
          />
          <span className="mt-1 block text-[11px] text-mute">
            Defaults to today if left blank.
          </span>
        </label>
      </div>

      {/* Beginner friendly */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          name="beginnerFriendly"
          type="checkbox"
          defaultChecked={resource?.beginnerFriendly ?? false}
          className="w-4 h-4 accent-red"
        />
        <span className="text-[14px]">
          Mark as <span className="font-medium">Beginner-friendly</span>
        </span>
      </label>

      {state.error ? (
        <p className="text-[14px] text-red border border-red/30 bg-red-tint px-3 py-2">
          {state.error}
        </p>
      ) : null}

      <div className="pt-1">
        <SubmitButton editing={editing} />
      </div>
    </form>
  );
}
