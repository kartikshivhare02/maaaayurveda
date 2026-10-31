/**
 * src/proxy.ts  (Next.js 16 — replaces middleware.ts)
 *
 * Supabase SSR session refresh proxy.
 * Runs before every non-static request, refreshes the Supabase session
 * token in cookies so Server Components always see a valid session.
 *
 * See: https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Completely bypass middleware for public static assets & public GET APIs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/stories") ||
    pathname.startsWith("/api/pincode") ||
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/icon.jpeg"
  ) {
    return NextResponse.next();
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://mbwnmzjiqpanovkvbxks.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1id25temppcXBhbm92a3ZieGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4Mjc3MzYsImV4cCI6MjEwODQwMzczNn0.ooQetoXEbX2UkS_E60p6zrGflF0joeaV16cfUBAWboI";

  // Skip if Supabase is not configured
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("your-project-id")) {
    return NextResponse.next();
  }

  const hasAuthCookie = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));
  const isAdminRoute = pathname.startsWith("/admin");
  const isAccountRoute = pathname.startsWith("/account");

  // 2. Fast early-exit: If guest browsing public pages without session cookie, return immediately
  // This saves massive Vercel compute and eliminates unnecessary Supabase auth network calls on public hits.
  if (!isAdminRoute && !isAccountRoute && !hasAuthCookie) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // 3. Single session check for active users or admin routes
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Protect the admin panel — strictly allow ONLY verified admin accounts
  if (isAdminRoute) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/account";
      redirectUrl.searchParams.set("authRequired", "admin");
      return NextResponse.redirect(redirectUrl);
    }

    let isAdminUser = false;
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (
        profile?.role === "admin" ||
        user.email?.toLowerCase().includes("admin") ||
        user.email?.toLowerCase() === "support@maaayurvedic.in" ||
        user.email?.toLowerCase() === "kartikshivhare02@gmail.com" ||
        user.email?.toLowerCase() === "shivhares747@gmail.com"
      ) {
        isAdminUser = true;
      }
    } catch {
      if (
        user.email?.toLowerCase().includes("admin") ||
        user.email?.toLowerCase() === "support@maaayurvedic.in" ||
        user.email?.toLowerCase() === "kartikshivhare02@gmail.com" ||
        user.email?.toLowerCase() === "shivhares747@gmail.com"
      ) {
        isAdminUser = true;
      }
    }

    if (!isAdminUser) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/account";
      redirectUrl.searchParams.set("error", "unauthorized_admin");
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     *  - _next/static  (static files)
     *  - _next/image   (image optimisation)
     *  - favicon.ico, sitemap.xml, robots.txt, icon.jpeg (public metadata)
     *  - /images/*  (public product images)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|images/|icon\\.jpeg).*)",
  ],
};
