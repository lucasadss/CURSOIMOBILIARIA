import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

/**
 * Payt postback ("PayT V1") — https://help.payt.com.br/article/155-postback
 *
 * Authentication: Payt has no HMAC signature; every postback carries our
 * account's `integration_key` in the JSON body, which must match
 * PAYT_INTEGRATION_KEY. It is checked first, timing-safe, before anything
 * touches the database.
 *
 * Grants access on status `paid`; revokes on `refunded` / `chargeback`.
 * Everything else (waiting_payment, refused, lost_cart, subscription_*, ...)
 * is acknowledged and ignored.
 */

const GRANT_STATUSES = new Set(["paid"]);
const REVOKE_STATUSES = new Set(["refunded", "chargeback"]);

function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // timingSafeEqual throws on different lengths, so compare those first.
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

interface PaytPayload {
  integration_key?: string;
  transaction_id?: string;
  status?: string;
  type?: string;
  test?: boolean;
  customer?: { email?: string; fake_email?: boolean };
  product?: { name?: string };
}

export async function POST(request: NextRequest) {
  const expectedKey = process.env.PAYT_INTEGRATION_KEY;
  if (!expectedKey) {
    console.error("payt webhook: PAYT_INTEGRATION_KEY not configured");
    return NextResponse.json({ error: "server misconfigured" }, { status: 500 });
  }

  let payload: PaytPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const providedKey =
    typeof payload.integration_key === "string" ? payload.integration_key : "";
  if (!timingSafeEqualStrings(providedKey, expectedKey)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { transaction_id: transactionId, status } = payload;
  if (!transactionId || !status) {
    return NextResponse.json({ error: "missing transaction_id or status" }, { status: 400 });
  }

  const grants = GRANT_STATUSES.has(status);
  const revokes = REVOKE_STATUSES.has(status);
  if (!grants && !revokes) {
    return NextResponse.json({ ok: true, ignored: status });
  }

  const email = payload.customer?.email?.trim().toLowerCase();
  if (!email || payload.customer?.fake_email) {
    // Payt lets buyers tick "I don't have an email" — nothing to log in with.
    return NextResponse.json({ error: "missing customer email" }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();

  // One transaction moves through several statuses (paid, then refunded), so
  // the dedup key is transaction + status: a retried delivery of the same
  // status is a no-op, but a later refund is never swallowed as a duplicate.
  const eventId = `${transactionId}:${status}`;
  const { error: dedupError } = await supabase
    .from("webhook_processed_events")
    .insert({ event_id: eventId, event_type: status });
  if (dedupError) {
    if (dedupError.code === "23505") {
      return NextResponse.json({ ok: true, deduped: true });
    }
    console.error("payt webhook: dedup insert failed", dedupError);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }

  if (grants) {
    const { error: upsertError } = await supabase.from("authorized_buyers").upsert({
      email,
      status: "active",
      product: payload.product?.name ?? null,
      transaction_id: transactionId,
      purchased_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (upsertError) {
      console.error("payt webhook: authorized_buyers upsert failed", upsertError);
      // Release the dedup slot so Payt's retry is processed, not skipped.
      await supabase.from("webhook_processed_events").delete().eq("event_id", eventId);
      return NextResponse.json({ error: "internal error" }, { status: 500 });
    }

    // Pre-provision the auth account so signInWithOtp({ shouldCreateUser:
    // false }) works for this email. Already-exists is expected and fine.
    const { error: createUserError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });
    if (createUserError && !/already registered|already exists/i.test(createUserError.message)) {
      console.error("payt webhook: createUser failed", createUserError);
    }
  } else {
    const { error: revokeError } = await supabase
      .from("authorized_buyers")
      .update({ status: "revoked", updated_at: new Date().toISOString() })
      .eq("email", email);
    if (revokeError) {
      console.error("payt webhook: revoke update failed", revokeError);
    }
  }

  return NextResponse.json({ ok: true });
}
