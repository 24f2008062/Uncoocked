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
  function proxy() {
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
  ],
};
