"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { supabaseWrite } from "@/lib/supabase";
import type { ResourceType } from "@/types";

// Mirrors the assertAdmin() guard in app/admin/schedule/actions.ts — re-checks
// Basic Auth inside each action as defense in depth (server actions are public
// POST endpoints; the proxy.ts path gate alone is not enough).
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

export interface ResourceSaveState {
  error?: string;
}

const RESOURCE_TYPES: ResourceType[] = [
  "Paper",
  "Video",
  "Project",
  "Tutorial",
  "Dataset",
];

function str(form: FormData, key: string): string {
  return (form.get(key) as string | null)?.trim() ?? "";
}

function orNull(v: string): string | null {
  return v === "" ? null : v;
}

export async function saveResource(
  _prev: ResourceSaveState,
  form: FormData,
): Promise<ResourceSaveState> {
  if (!(await assertAdmin())) return { error: "Not authorized." };

  const id = str(form, "id");
  const title = str(form, "title");
  const type = str(form, "type") as ResourceType;
  const url = str(form, "url");
  const description = str(form, "description");
  const recommendedBy = str(form, "recommendedBy");
  const subgroupSlug = str(form, "subgroupSlug");
  const tagsRaw = str(form, "tags");
  const beginnerFriendly = form.get("beginnerFriendly") === "on";
  // Date defaults to today if left blank.
  const dateAdded =
    str(form, "dateAdded") || new Date().toISOString().slice(0, 10);

  // Validation
  if (!title) return { error: "Title is required." };
  if (!url) return { error: "URL is required." };
  if (!RESOURCE_TYPES.includes(type)) {
    return { error: "Pick a valid type (Paper, Video, Project, Tutorial, Dataset)." };
  }
  if (!recommendedBy) return { error: "Recommended by is required." };

  // Tags: comma-separated string → text[]
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const row = {
    title,
    type,
    url,
    description,
    tags,
    recommended_by: recommendedBy,
    date_added: dateAdded,
    subgroup_slug: orNull(subgroupSlug),
    beginner_friendly: beginnerFriendly,
  };

  const db = supabaseWrite();

  if (id) {
    // Editing an existing resource.
    const { error } = await db.from("resources").update(row).eq("id", id);
    if (error) return { error: `Could not save: ${error.message}` };
  } else {
    // Creating a new resource.
    const { error } = await db.from("resources").insert(row);
    if (error) return { error: `Could not save: ${error.message}` };
  }

  revalidatePath("/resources");
  revalidatePath("/");
  revalidatePath("/admin/resources");
  redirect("/admin/resources");
}

export async function deleteResource(form: FormData): Promise<void> {
  if (!(await assertAdmin())) throw new Error("Not authorized.");

  const id = str(form, "id");
  if (!id) return;
  const { error } = await supabaseWrite()
    .from("resources")
    .delete()
    .eq("id", id);
  if (error) throw new Error(`Could not delete resource: ${error.message}`);
  revalidatePath("/resources");
  revalidatePath("/");
  revalidatePath("/admin/resources");
}
