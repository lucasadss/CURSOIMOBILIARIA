"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same response whether the email has an approved purchase or not — a
// different message here would let anyone probe which emails bought the
// product (user enumeration).
const GENERIC_MESSAGE =
  "Se esse e-mail tiver uma compra aprovada, você vai receber um link de acesso em instantes.";

export async function requestMagicLink(
  _prev: { ok: boolean; message: string } | undefined,
  formData: FormData,
): Promise<{ ok: boolean; message: string }> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Digite um e-mail válido." };
  }

  const rawNext = String(formData.get("next") ?? "");
  const safeNext = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : undefined;

  const supabase = await createServerSupabaseClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const callbackUrl = new URL("/auth/callback", siteUrl);
  if (safeNext) callbackUrl.searchParams.set("next", safeNext);

  // shouldCreateUser: false — only emails the Cakto webhook already
  // provisioned (real buyers) can ever receive a link. An unknown email
  // returns an error here, which we deliberately swallow into the same
  // generic message above.
  await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: callbackUrl.toString(),
    },
  });

  return { ok: true, message: GENERIC_MESSAGE };
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}
