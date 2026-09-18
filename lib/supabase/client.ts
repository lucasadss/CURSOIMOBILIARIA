"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

/** Browser client — anon key only, safe to call from client components. */
export function createClient() {
  return createBrowserClient(SUPABASE_URL(), SUPABASE_ANON_KEY());
}
