import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

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
  if (
    !supabaseUrl ||
    !supabaseServiceRoleKey ||
    supabaseUrl.includes("your-project-id")
  ) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
