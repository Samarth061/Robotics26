import { NextRequest, NextResponse } from "next/server";

// Gate the whole /admin/* area behind HTTP Basic Auth. One shared credential
// pair lives in env vars (ADMIN_USER / ADMIN_PASS) — no user accounts. This is
// the simple "only the professor" gate; real per-user auth (Auth.js + isAdmin)
// can replace this later without touching the pages it protects.
export const config = { matcher: ["/admin/:path*"] };

export function proxy(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;

  // Fail closed: if no credentials are configured, lock the area rather than
  // leaving it open.
  if (!user || !pass) {
    return new NextResponse("Admin access is not configured.", { status: 503 });
  }

  const header = req.headers.get("authorization");
  if (header) {
    const [scheme, encoded] = header.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const sep = decoded.indexOf(":");
      const u = decoded.slice(0, sep);
      const p = decoded.slice(sep + 1);
      if (u === user && p === pass) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"' },
  });
}
