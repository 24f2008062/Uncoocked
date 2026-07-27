import { NextResponse } from "next/server";

export async function GET(request) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    request.headers.get("origin") ||
    "http://localhost:3000";
  return NextResponse.redirect(new URL("/login", baseUrl));
}

export async function POST() {
  return NextResponse.json(
    { error: "Email verification is temporarily disabled." },
    { status: 503 }
  );
}

export const dynamic = "force-dynamic";
