/**
 * GET /api/auth/callback
 *
 * Supabase Google OAuth redirect handler.
 * Exchanges the auth code for a session, writes session tokens directly
 * to the outgoing HTTP redirect response cookies, and redirects the user
 * back to the current device's origin (supporting localhost, mobile LAN IP, and custom domains).
 */

import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";
  const safeNext = next.startsWith("/") ? next : "/";

  // Determine the exact origin of the device making the request
  // (crucial for mobile testing on LAN IP like 192.168.x.x or custom domain)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host") || requestUrl.host;
  const proto =
    request.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") || host.includes("127.0.0.1") || host.includes("192.168.")
      ? "http"
      : "https");

  const origin = `${proto}://${host}`;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://mbwnmzjiqpanovkvbxks.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1id25temppcXBhbm92a3ZieGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4Mjc3MzYsImV4cCI6MjEwODQwMzczNn0.ooQetoXEbX2UkS_E60p6zrGflF0joeaV16cfUBAWboI";

  if (!code) {
    return NextResponse.redirect(`${origin}/?authError=missing_code`);
  }

  // Pre-create the redirect response so session cookies are written directly to it
  const response = NextResponse.redirect(`${origin}${safeNext}`);

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          // Write cookie to both incoming request and outgoing response
          request.cookies.set(name, value);
          response.cookies.set(name, value, {
            ...options,
            path: "/",
            sameSite: "lax",
            // Allow cookies across non-https during local LAN testing
            secure: proto === "https",
          });
        });
      },
    },
  });

  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
    return NextResponse.redirect(`${origin}/?authError=session_exchange`);
  }

  // Auto-sync profile to profiles table to prevent foreign key issues on orders
  if (sessionData?.session?.user) {
    const u = sessionData.session.user;
    const adminClient = getSupabaseServerAdmin();
    if (adminClient) {
      try {
        await adminClient.from("profiles").upsert(
          {
            id: u.id,
            full_name:
              u.user_metadata?.full_name ||
              u.user_metadata?.name ||
              u.email?.split("@")[0] ||
              "Customer",
            email: u.email || null,
            role: "customer",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      } catch (pe) {
        console.warn("[auth/callback] Could not upsert profile:", pe);
      }
    }
  }

  // Successfully exchanged session and cookies attached — user is now immediately logged in
  return response;
}
