import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://mbwnmzjiqpanovkvbxks.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1id25temppcXBhbm92a3ZieGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4Mjc3MzYsImV4cCI6MjEwODQwMzczNn0.ooQetoXEbX2UkS_E60p6zrGflF0joeaV16cfUBAWboI";

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1id25temppcXBhbm92a3ZieGtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjgyNzczNiwiZXhwIjoyMTA4NDAzNzM2fQ.PzT30qC4jIesMwMT5b0FK_bTBrP4fmSlgpQbQ45koD8";

export const isSupabaseServerConfigured = () =>
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseUrl.includes("your-project-id");

/**
 * Cookie-aware server-side Supabase client.
 * Use inside Server Components, Route Handlers, and Server Actions.
 * Reads the session from request cookies so that auth.getUser() works
 * without a network round-trip to Supabase.
 */
export async function createSupabaseServerClient() {
  if (!isSupabaseServerConfigured()) return null;
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // In Server Components cookies are read-only; the proxy handles writes.
        }
      },
    },
  });
}

/**
 * Service-role admin client — bypasses RLS.
 * NEVER expose to client code. Use only in trusted server-side contexts
 * (webhook handlers, admin API routes, server actions).
 */
export const getSupabaseServerAdmin = () => {
  const url = supabaseUrl || "https://mbwnmzjiqpanovkvbxks.supabase.co";
  const key =
    supabaseServiceRoleKey ||
    supabaseAnonKey ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1id25temppcXBhbm92a3ZieGtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjgyNzczNiwiZXhwIjoyMTA4NDAzNzM2fQ.PzT30qC4jIesMwMT5b0FK_bTBrP4fmSlgpQbQ45koD8";

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
