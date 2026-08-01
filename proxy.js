import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Gates protected pages. NOTE: In Next.js 16 the `middleware` convention was
// renamed to `proxy`; this file uses the new convention so it executes.
//
// Rate limiting for the auth API endpoints is implemented inside the route
// handlers themselves (app/api/auth/register/route.js and the NextAuth
// authorize() callback) because the per-request proxy matcher is not reliably
// honored by the current Next 16 + Turbopack build. This file keeps the
// existing page-level session gating.
export default withAuth(
  function proxy(req) {
    const token = req.nextauth?.token;
    const path = req.nextUrl.pathname;

    // Super Admin gating for /admin pages and /api/admin endpoints.
    if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
      if (!token || token.role !== "SUPER_ADMIN") {
        if (path.startsWith("/api/admin")) {
          return NextResponse.json(
            { error: "Forbidden: Super Admin access required." },
            { status: 403 }
          );
        }
        // Not signed in at all: send to login. Signed in but wrong role:
        // send back to the regular dashboard rather than looping on /login.
        return NextResponse.redirect(
          new URL(token ? "/dashboard" : "/login", req.url)
        );
      }
      return NextResponse.next();
    }

    if (token && !token.emailVerified) {
      if (
        path.startsWith("/dashboard/organizer") ||
        path.startsWith("/onboarding") ||
        path.startsWith("/profile") ||
        path.startsWith("/api/organizer")
      ) {
        return NextResponse.redirect(
          new URL(
            `/verify-email?notice=unverified&email=${encodeURIComponent(token.email || "")}`,
            req.url
          )
        );
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    // Base /dashboard is intentionally public: it renders its own inline
    // "sign in to view" prompt (app/dashboard/page.jsx) instead of redirecting.
    // Only the host/creator sub-routes require a session.
    "/dashboard/organizer/:path*",
    "/profile/:path*",
    "/onboarding/:path*",
    "/api/users/:path*",
    "/api/organizer/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
