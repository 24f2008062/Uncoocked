import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Edge middleware protecting admin routes and organizer sub-routes
export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;
    const path = req.nextUrl.pathname;

    // Super Admin gating for /admin pages and /api/admin endpoints
    if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
      if (!token || token.role !== "SUPER_ADMIN") {
        if (path.startsWith("/api/admin")) {
          return NextResponse.json(
            { error: "Forbidden: Super Admin access required." },
            { status: 403 }
          );
        }
        return NextResponse.redirect(
          new URL(token ? "/dashboard" : "/login", req.url)
        );
      }
      return NextResponse.next();
    }

    // Email verification check for creator & host routes
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
    "/dashboard/organizer/:path*",
    "/profile/:path*",
    "/onboarding/:path*",
    "/api/users/:path*",
    "/api/organizer/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
