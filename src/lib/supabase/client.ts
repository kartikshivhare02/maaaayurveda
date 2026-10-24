import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://mbwnmzjiqpanovkvbxks.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1id25temppcXBhbm92a3ZieGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4Mjc3MzYsImV4cCI6MjEwODQwMzczNn0.ooQetoXEbX2UkS_E60p6zrGflF0joeaV16cfUBAWboI";

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
 * server components and API routes).
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
