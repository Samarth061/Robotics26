import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase access lives entirely server-side. `server-only` makes the build fail
// if any of this is ever imported into a client component, so the secret key can
// never leak into the browser bundle.
//
// Two clients, two key tiers (Supabase's current key system):
//   - read  → publishable key (sb_publishable_…, the new "anon"). Bound by RLS,
//             which permits public SELECT. Safe to expose; hence NEXT_PUBLIC_.
//   - write → secret key (sb_secret_…, the new "service_role"). Used only by the
//             gated /admin/schedule server actions. Bypasses RLS. Server-only —
//             SUPABASE_SECRET_KEY must NOT be NEXT_PUBLIC_.
//
// Missing config fails closed with a clear error rather than silently returning
// empty data — same ethos as the /admin Basic Auth gate in proxy.ts.

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Supabase is not configured — see supabase.md.`,
    );
  }
  return value;
}

const COMMON = { auth: { persistSession: false, autoRefreshToken: false } };

/** Publishable-key client for reads. RLS permits public SELECT on `meetings`. */
export function supabaseRead(): SupabaseClient {
  return createClient(
    required("NEXT_PUBLIC_SUPABASE_URL"),
    required("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    COMMON,
  );
}

/** Secret-key client for writes. Server-only; bypasses RLS. */
export function supabaseWrite(): SupabaseClient {
  return createClient(
    required("NEXT_PUBLIC_SUPABASE_URL"),
    required("SUPABASE_SECRET_KEY"),
    COMMON,
  );
}
