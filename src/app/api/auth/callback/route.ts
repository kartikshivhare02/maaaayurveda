/**
 * GET /api/auth/callback
 *
 * Supabase Google OAuth redirect handler.
 * After Google redirects the user back, Supabase sends a `code` query param.
 * This route exchanges it for a session and writes the auth cookies,
 * then redirects to the intended destination (or home).
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  // Origin for the final redirect (works on localhost and production)
  const origin = requestUrl.origin;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://mbwnmzjiqpanovkvbxks.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1id25temppcXBhbm92a3ZieGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4Mjc3MzYsImV4cCI6MjEwODQwMzczNn0.ooQetoXEbX2UkS_E60p6zrGflF0joeaV16cfUBAWboI";

  if (!code || !supabaseUrl || !supabaseAnonKey) {
    // Missing code or env vars — send back to home with an error flag
    return NextResponse.redirect(
      `${origin}/?authError=missing_code`,
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
    return NextResponse.redirect(`${origin}/?authError=session_exchange`);
  }

  // Decode the `next` path (Supabase encodes it as a URL-encoded string)
  const safeNext = next.startsWith("/") ? next : "/";

  return NextResponse.redirect(`${origin}${safeNext}`);
}
