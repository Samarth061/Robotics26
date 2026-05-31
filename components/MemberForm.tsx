"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveMember, type MemberSaveState } from "@/app/admin/members/actions";
import type { Member } from "@/types";

type SubOption = { slug: string; name: string; parentGroup: string };

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
      {pending ? "Saving…" : editing ? "Save changes" : "Add member"}
    </button>
  );
}

export function MemberForm({
  subgroups,
  member,
}: {
  subgroups: SubOption[];
  member?: Member;
}) {
  const [state, formAction] = useActionState<MemberSaveState, FormData>(
    saveMember,
    {},
  );

  const [isAdmin, setIsAdmin] = useState(member?.isAdmin ?? false);
  const [interestsValue, setInterestsValue] = useState(
    member?.interests?.join(", ") ?? "",
  );

  const editing = Boolean(member);
  const aiSubs = subgroups.filter((s) => s.parentGroup === "ai");
  const mechSubs = subgroups.filter((s) => s.parentGroup === "mechatronics");

  return (
    <form action={formAction} className="max-w-[700px] space-y-5">
      {/* Hidden slug — present only when editing */}
      {member ? <input type="hidden" name="slug" value={member.slug} /> : null}

      {/* Name */}
      <label className="block">
        <span className="kicker">Name *</span>
        <input
          name="name"
          type="text"
          required
          defaultValue={member?.name ?? ""}
          placeholder="Full name"
          className={`mt-2 ${inputClass}`}
        />
        {!editing && (
          <span className="mt-1 block text-[11px] text-mute">
            Slug (URL key) is auto-generated from the name.
          </span>
        )}
      </label>

      {/* Email + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="kicker">Email</span>
          <input
            name="email"
            type="email"
            defaultValue={member?.email ?? ""}
            placeholder="unity@ncsu.edu"
            className={`mt-2 ${inputClass}`}
          />
        </label>

        <label className="block">
          <span className="kicker">Status</span>
          <select
            name="status"
            defaultValue={member?.status ?? ""}
            className={`mt-2 ${inputClass}`}
          >
            <option value="">Active (default)</option>
            <option value="faculty">Faculty</option>
            <option value="graduated">Graduated</option>
            <option value="high-school">High School</option>
          </select>
        </label>
      </div>

      {/* Groups */}
      <fieldset className="border border-rule p-4">
        <legend className="kicker px-1">Group(s)</legend>
        <p className="text-[12px] text-mute -mt-1 mb-3">
          Faculty members typically belong to neither group.
        </p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-[14px] cursor-pointer">
            <input
              type="checkbox"
              name="groups"
              value="ai"
              defaultChecked={member?.groups.includes("ai") ?? false}
              className="w-4 h-4 accent-red"
            />
            AI Group
          </label>
          <label className="flex items-center gap-2 text-[14px] cursor-pointer">
            <input
              type="checkbox"
              name="groups"
              value="mechatronics"
              defaultChecked={member?.groups.includes("mechatronics") ?? false}
              className="w-4 h-4 accent-red"
            />
            Mechatronics Group
          </label>
        </div>
      </fieldset>

      {/* Subgroups */}
      <fieldset className="border border-rule p-4">
        <legend className="kicker px-1">Subgroup(s)</legend>
        <p className="text-[12px] text-mute -mt-1 mb-4">
          Check all that apply — leave all unchecked for faculty.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-mute mb-2">
              AI
            </p>
            <div className="space-y-2">
              {aiSubs.map((s) => (
                <label key={s.slug} className="flex items-center gap-2.5 text-[14px] cursor-pointer">
                  <input
                    type="checkbox"
                    name="subgroups"
                    value={s.slug}
                    defaultChecked={member?.subgroups?.includes(s.slug) ?? false}
                    className="w-4 h-4 accent-red shrink-0"
                  />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-mute mb-2">
              Mechatronics
            </p>
            <div className="space-y-2">
              {mechSubs.map((s) => (
                <label key={s.slug} className="flex items-center gap-2.5 text-[14px] cursor-pointer">
                  <input
                    type="checkbox"
                    name="subgroups"
                    value={s.slug}
                    defaultChecked={member?.subgroups?.includes(s.slug) ?? false}
                    className="w-4 h-4 accent-red shrink-0"
                  />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      {/* Interests */}
      <label className="block">
        <span className="kicker">Interests</span>
        <input
          name="interests"
          type="text"
          value={interestsValue}
          onChange={(e) => setInterestsValue(e.target.value)}
          placeholder="LLMs, ROS 2, Manipulation"
          className={`mt-2 ${inputClass}`}
        />
        <span className="mt-1 block text-[11px] text-mute">Comma-separated.</span>
      </label>

      {/* Admin */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            name="isAdmin"
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="w-4 h-4 accent-red"
          />
          <span className="text-[14px]">Mark as <span className="font-medium">Admin</span></span>
        </label>
        {isAdmin && (
          <label className="block">
            <span className="kicker">Admin role (optional)</span>
            <input
              name="adminRole"
              type="text"
              defaultValue={member?.adminRole ?? ""}
              placeholder="e.g. President, Tech Lead"
              className={`mt-2 ${inputClass}`}
            />
          </label>
        )}
      </div>

      {/* Links */}
      <fieldset className="border border-rule p-4 space-y-4">
        <legend className="kicker px-1">Links (optional)</legend>
        <label className="block">
          <span className="kicker">Photo URL</span>
          <input
            name="photo"
            type="url"
            defaultValue={member?.photo ?? ""}
            placeholder="https://…"
            className={`mt-2 ${inputClass}`}
          />
          <span className="mt-1 block text-[11px] text-mute">
            Leave blank — initials avatar shows automatically.
          </span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block">
            <span className="kicker">Website</span>
            <input
              name="linkWebsite"
              type="url"
              defaultValue={member?.links?.website ?? ""}
              placeholder="https://…"
              className={`mt-2 ${inputClass}`}
            />
          </label>
          <label className="block">
            <span className="kicker">LinkedIn</span>
            <input
              name="linkLinkedin"
              type="url"
              defaultValue={member?.links?.linkedin ?? ""}
              placeholder="https://linkedin.com/in/…"
              className={`mt-2 ${inputClass}`}
            />
          </label>
          <label className="block">
            <span className="kicker">GitHub</span>
            <input
              name="linkGithub"
              type="url"
              defaultValue={member?.links?.github ?? ""}
              placeholder="https://github.com/…"
              className={`mt-2 ${inputClass}`}
            />
          </label>
        </div>
      </fieldset>

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
