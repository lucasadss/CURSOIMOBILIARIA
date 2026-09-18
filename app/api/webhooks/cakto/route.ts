import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

/**
 * Cakto webhook — https://cakto-dece4a15.mintlify.app/webhooks
 *
 * Authentication is a shared `secret` field inside the JSON body (Cakto has
 * no HMAC signature scheme), configured to match CAKTO_WEBHOOK_SECRET both
 * here and in the Cakto dashboard's webhook settings.
 *
 * Grants access on `purchase_approved`; revokes on `refund` / `chargeback`.
 * Every other event (pix_gerado, boleto_gerado, subscription_*, etc.) is
 * acknowledged and ignored — this module only sells a one-time purchase.
 */

const GRANT_EVENTS = new Set(["purchase_approved"]);
const REVOKE_EVENTS = new Set(["refund", "chargeback"]);

function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // Guard the length check itself outside timingSafeEqual — it throws on
  // mismatched buffer lengths instead of returning false.
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

interface CaktoPayload {
  event?: string;
  secret?: string;
  data?: {
    id?: string;
    customer?: { email?: string };
    product?: { name?: string };
    offer?: { name?: string };
    paidAt?: string;
  };
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.CAKTO_WEBHOOK_SECRET;
  if (!expectedSecret) {
    console.error("cakto webhook: CAKTO_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "server misconfigured" }, { status: 500 });
  }

  let payload: CaktoPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // Validate the shared secret before touching anything else — an
  // unauthenticated caller never reaches the dedup insert or the DB.
  const providedSecret = typeof payload.secret === "string" ? payload.secret : "";
  if (!timingSafeEqualStrings(providedSecret, expectedSecret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const event = payload.event;
  const data = payload.data ?? {};
  const eventId = data.id;
  const email = data.customer?.email?.trim().toLowerCase();

  if (!event || !eventId) {
    return NextResponse.json({ error: "missing event or id" }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();

  // Idempotency: Cakto retries on timeout, so the same event can arrive
  // more than once. A unique-constraint violation here means "already
  // handled" — treat as success without redoing the side effects.
  const { error: dedupError } = await supabase
    .from("cakto_processed_events")
    .insert({ event_id: eventId, event_type: event });
  if (dedupError) {
    if (dedupError.code === "23505") {
      return NextResponse.json({ ok: true, deduped: true });
    }
    console.error("cakto webhook: dedup insert failed", dedupError);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }

  if (GRANT_EVENTS.has(event)) {
    if (!email) {
      return NextResponse.json({ error: "missing customer email" }, { status: 400 });
    }

    const { error: upsertError } = await supabase.from("authorized_buyers").upsert({
      email,
      status: "active",
      product: data.product?.name ?? data.offer?.name ?? null,
      cakto_transaction_id: eventId,
      purchased_at: data.paidAt ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (upsertError) {
      console.error("cakto webhook: authorized_buyers upsert failed", upsertError);
      return NextResponse.json({ error: "internal error" }, { status: 500 });
    }

    // Pre-provision the Supabase Auth account so a later
    // signInWithOtp({ shouldCreateUser: false }) succeeds for this email.
    // Re-running this for an existing user is expected and harmless.
    const { error: createUserError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });
    if (createUserError && !/already registered|already exists/i.test(createUserError.message)) {
      console.error("cakto webhook: createUser failed", createUserError);
    }
  } else if (REVOKE_EVENTS.has(event)) {
    if (email) {
      const { error: revokeError } = await supabase
        .from("authorized_buyers")
        .update({ status: "revoked", updated_at: new Date().toISOString() })
        .eq("email", email);
      if (revokeError) {
        console.error("cakto webhook: revoke update failed", revokeError);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
