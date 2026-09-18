import { createServerSupabaseClient } from "@/lib/supabase/server";
import ConfiguracoesClient from "./configuracoes-client";

export default async function ConfiguracoesPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <ConfiguracoesClient email={user?.email ?? ""} />;
}
