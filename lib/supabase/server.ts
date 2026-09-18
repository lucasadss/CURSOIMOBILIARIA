import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } from "./env";

/**
 * Server-side client bound to the request's cookies — respects the signed-in
 * user's session (anon key + their session token, never the service role).
 * Use in Server Components, Server Actions and Route Handlers.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL(), SUPABASE_ANON_KEY(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component that can't set cookies — the
          // middleware's session refresh already covers this request.
        }
      },
    },
  });
}

/**
 * Admin client with the service_role key — bypasses RLS entirely. Only ever
 * call this from trusted server code (the Cakto webhook handler), never in
 * response to a request whose caller isn't independently verified first.
 */
export function createAdminSupabaseClient() {
  return createAdminClient(SUPABASE_URL(), SUPABASE_SERVICE_ROLE_KEY(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
