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
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip if Supabase is not configured (local dev without .env)
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes("your-project-id")
  ) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Set on both the cloned request and the outgoing response so that
        // downstream Server Components see the refreshed token.
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

  // IMPORTANT: Do not write any logic between createServerClient and
  // auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  //
  // auth.getUser() refreshes the session if it has expired. The updated
  // session is written back to cookies via setAll above.
  await supabase.auth.getUser();

  // Protect the admin panel — redirect unauthenticated visitors to /
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      redirectUrl.searchParams.set("authRequired", "admin");
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
     *  - favicon.ico, sitemap.xml, robots.txt (public metadata)
     *  - /images/*  (public product images)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|images/).*)",
  ],
};
