import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, isStrongPassword } from "@/lib/password";
import { logAuthEvent } from "@/lib/auth/log";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    // Per-IP rate limit on signup (10 requests / minute).
    const rl = rateLimit(`register:${getClientIp(request)}`, {
      limit: 10,
      windowMs: 60 * 1000,
    });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters and include both letters and numbers",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      logAuthEvent("signup_failure", { email, reason: "duplicate" });
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: fullName || "New User",
        onboardingCompleted: false,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    logAuthEvent("signup_success", { email });
    return NextResponse.json({ success: true });
  } catch (error) {
    // Never leak internal/database details to the client.
    logAuthEvent("signup_failure", { reason: "server_error" });
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
