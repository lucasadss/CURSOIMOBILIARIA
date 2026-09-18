import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on everything except Next.js internals and static assets — this
     * is the allowlist-of-public-routes pattern from the project's security
     * guidance: a new page is protected by default, not opt-in.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon|opengraph-image|robots.txt|sitemap.xml|thumbnails|landing|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)",
  ],
};
