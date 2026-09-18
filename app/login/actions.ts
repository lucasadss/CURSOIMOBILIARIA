"use server";

import { after } from "next/server";
import { redirect } from "next/navigation";
import { createAdminSupabaseClient, createServerSupabaseClient } from "@/lib/supabase/server";
import { magicLinkEmail, sendEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Minimum gap between two links for the same email — stops anyone from
// bombing a buyer's inbox by hammering the login form.
const THROTTLE_MS = 60_000;

// Same response whether the email has an approved purchase or not — a
// different message here would let anyone probe which emails bought the
// product (user enumeration).
const GENERIC_MESSAGE =
  "Se esse e-mail tiver uma compra aprovada, você vai receber um link de acesso em instantes.";

/**
 * Generates a one-time login token for an active buyer and emails it through
 * Resend. Runs in the background (`after`) so the response time is identical
 * for buyers and non-buyers.
 */
async function sendAccessLink(email: string, next: string | undefined) {
  const admin = createAdminSupabaseClient();

  const { data: buyer } = await admin
    .from("authorized_buyers")
    .select("status, last_link_sent_at")
    .eq("email", email)
    .maybeSingle();

  if (!buyer || buyer.status !== "active") return;

  if (buyer.last_link_sent_at && Date.now() - new Date(buyer.last_link_sent_at).getTime() < THROTTLE_MS) {
    return;
  }

  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  const tokenHash = data?.properties?.hashed_token;
  if (error || !tokenHash) {
    console.error("[login] generateLink failed:", error?.message);
    return;
  }

  // The link goes to OUR confirm page (which needs a click), not straight to
  // Supabase: email scanners pre-fetch URLs and would burn a one-time link.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const link = new URL("/auth/confirm", siteUrl);
  link.searchParams.set("token_hash", tokenHash);
  if (next) link.searchParams.set("next", next);

  const sent = await sendEmail({ to: email, ...magicLinkEmail(link.toString()) });
  if (sent) {
    await admin
      .from("authorized_buyers")
      .update({ last_link_sent_at: new Date().toISOString() })
      .eq("email", email);
  }
}

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

  after(() =>
    sendAccessLink(email, safeNext).catch((err) => console.error("[login] send failed:", err)),
  );

  return { ok: true, message: GENERIC_MESSAGE };
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}
