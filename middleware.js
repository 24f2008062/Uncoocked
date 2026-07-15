import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Gates protected pages and the write-capable API routes.
// Public routes (home, /event, /opportunities, contact, reviews, chat,
// public event/registration reads) remain reachable without a session.
export default withAuth(
  function middleware() {
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
  ],
};
