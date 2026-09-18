import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Spends the one-time token from the access email and sets the session
 * cookie. `next` is only accepted as a same-origin path.
 */
export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url);
  const form = await request.formData();
  const tokenHash = String(form.get("token_hash") ?? "");
  const next = String(form.get("next") ?? "");
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/app";

  if (tokenHash) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "magiclink" });
    if (!error) {
      // 303 so the browser follows the POST with a GET.
      return NextResponse.redirect(`${origin}${safeNext}`, 303);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=link_invalido`, 303);
}
