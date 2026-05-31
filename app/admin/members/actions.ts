"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { supabaseWrite } from "@/lib/supabase";
import type { GroupSlug } from "@/types";

async function assertAdmin(): Promise<boolean> {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;
  if (!user || !pass) return false;
  const header = (await headers()).get("authorization");
  if (!header) return false;
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return false;
  let decoded: string;
  try {
    decoded = atob(encoded);
  } catch {
    return false;
  }
  const sep = decoded.indexOf(":");
  return decoded.slice(0, sep) === user && decoded.slice(sep + 1) === pass;
}

export interface MemberSaveState {
  error?: string;
}

function str(form: FormData, key: string): string {
  return (form.get(key) as string | null)?.trim() ?? "";
}

function orNull(v: string): string | null {
  return v === "" ? null : v;
}

/** Derive a URL-safe slug from a display name. */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const VALID_GROUPS: GroupSlug[] = ["ai", "mechatronics"];

export async function saveMember(
  _prev: MemberSaveState,
  form: FormData,
): Promise<MemberSaveState> {
  if (!(await assertAdmin())) return { error: "Not authorized." };

  const slug = str(form, "slug");
  const name = str(form, "name");
  const email = str(form, "email");
  const photo = str(form, "photo");
  const status = str(form, "status");
  const isAdmin = form.get("isAdmin") === "on";
  const adminRole = str(form, "adminRole");
  const interestsRaw = str(form, "interests");
  const linkWebsite = str(form, "linkWebsite");
  const linkLinkedin = str(form, "linkLinkedin");
  const linkGithub = str(form, "linkGithub");

  // Groups — checkboxes, may be multiple values
  const groupValues = form.getAll("groups") as string[];
  const groups = groupValues.filter((g) =>
    VALID_GROUPS.includes(g as GroupSlug),
  );

  // Subgroups — multi-select
  const subgroupValues = form.getAll("subgroups") as string[];

  // Interests — comma-separated
  const interests = interestsRaw
    .split(",")
    .map((i) => i.trim())
    .filter(Boolean);

  // Validation
  if (!name) return { error: "Name is required." };

  const finalSlug = slug || slugify(name);
  if (!finalSlug) return { error: "Could not generate a slug from the name." };

  const row = {
    slug: finalSlug,
    name,
    email: orNull(email),
    photo: orNull(photo),
    status: orNull(status),
    groups,
    subgroups: subgroupValues,
    interests,
    is_admin: isAdmin,
    admin_role: isAdmin ? orNull(adminRole) : null,
    link_website: orNull(linkWebsite),
    link_linkedin: orNull(linkLinkedin),
    link_github: orNull(linkGithub),
  };

  const db = supabaseWrite();

  if (slug) {
    // Editing — slug is the PK, update by matching it
    const { error } = await db.from("members").update(row).eq("slug", slug);
    if (error) return { error: `Could not save: ${error.message}` };
  } else {
    // Creating — upsert so re-submitting with same name is safe
    const { error } = await db
      .from("members")
      .upsert(row, { onConflict: "slug" });
    if (error) return { error: `Could not save: ${error.message}` };
  }

  revalidatePath("/members");
  revalidatePath("/");
  revalidatePath("/admin/members");
  redirect("/admin/members");
}

export async function deleteMember(form: FormData): Promise<void> {
  if (!(await assertAdmin())) throw new Error("Not authorized.");

  const slug = str(form, "slug");
  if (!slug) return;
  const { error } = await supabaseWrite()
    .from("members")
    .delete()
    .eq("slug", slug);
  if (error) throw new Error(`Could not delete member: ${error.message}`);
  revalidatePath("/members");
  revalidatePath("/");
  revalidatePath("/admin/members");
}
