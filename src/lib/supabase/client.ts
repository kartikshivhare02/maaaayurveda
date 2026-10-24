import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes("your-project-id")
  );
};

/**
 * Browser/client-component Supabase client.
 * Uses @supabase/ssr so the session is stored in cookies (readable by
 * server components and API routes). Always call this at the top level
 * of a client component — never inside a loop or conditional.
 */
export const supabase = isSupabaseConfigured()
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null;
