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
    "/dashboard/:path*",
    "/profile/:path*",
    "/onboarding/:path*",
    "/api/users/:path*",
    "/api/organizer/:path*",
  ],
};
