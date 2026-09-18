import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Providers } from "@/components/layout/providers";
import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server";

// The product lives behind /app and isn't meant to be discoverable via
// search — only the marketing landing page at "/" should be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // The middleware already blocks unauthenticated visitors from reaching
  // here — this is the defense-in-depth layer the project's security
  // guidance calls for: every protected surface re-verifies on its own,
  // never trusting the edge layer alone. It also catches something the
  // middleware can't: a purchase that was refunded/charged back *after*
  // the visitor already had a valid session.
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  const admin = createAdminSupabaseClient();
  const { data: buyer } = await admin
    .from("authorized_buyers")
    .select("status")
    .eq("email", user.email.toLowerCase())
    .maybeSingle();

  if (buyer?.status !== "active") {
    await supabase.auth.signOut();
    redirect("/login?error=acesso_revogado");
  }

  return <Providers>{children}</Providers>;
}
