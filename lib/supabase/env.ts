/**
 * Fails fast and loud at startup if a required Supabase env var is missing,
 * instead of the far more confusing "fetch failed" deep inside a client
 * call. Never import this from a file that also runs in the browser bundle
 * with the service role key.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const SUPABASE_URL = () => required("NEXT_PUBLIC_SUPABASE_URL");
export const SUPABASE_ANON_KEY = () => required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
export const SUPABASE_SERVICE_ROLE_KEY = () => required("SUPABASE_SERVICE_ROLE_KEY");
