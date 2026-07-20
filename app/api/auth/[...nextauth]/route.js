import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { logAuthEvent } from "@/lib/auth/log";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Per-IP rate limit on credential attempts (10 / minute).
        const rl = rateLimit(`login:${getClientIp(req)}`, {
          limit: 10,
          windowMs: 60 * 1000,
        });
        if (!rl.success) {
          logAuthEvent("login_rate_limited", { ip: getClientIp(req) });
          return null;
        }

        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            fullName: true,
            name: true,
            passwordHash: true,
            onboardingCompleted: true,
            failedLoginAttempts: true,
            lockedUntil: true,
          },
        });

        // Account-level lockout (does not reveal whether the email exists).
        if (user?.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
          logAuthEvent("login_blocked_locked", { email });
          return null;
        }

        if (!user || !user.passwordHash) {
          // Generic failure: do not disclose whether the account exists.
          logAuthEvent("login_failure", { email, reason: "invalid_credentials" });
          return null;
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
          const attempts = (user.failedLoginAttempts || 0) + 1;
          if (attempts >= MAX_FAILED_ATTEMPTS) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: attempts,
                lockedUntil: new Date(Date.now() + LOCK_DURATION_MS),
              },
            });
            logAuthEvent("account_locked", { email, attempts });
          } else {
            await prisma.user.update({
              where: { id: user.id },
              data: { failedLoginAttempts: attempts },
            });
            logAuthEvent("login_failure", { email, attempts });
          }
          return null;
        }

        // Successful login: reset the failure counter.
        if (user.failedLoginAttempts > 0 || user.lockedUntil) {
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lockedUntil: null },
          });
        }
        logAuthEvent("login_success", { email });

        return {
          id: user.id,
          email: user.email,
          name: user.fullName || user.name,
          onboardingCompleted: user.onboardingCompleted,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.callback-url"
          : "next-auth.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.onboardingCompleted = user.onboardingCompleted;
      }

      if (trigger === "update" && session?.onboardingCompleted !== undefined) {
        token.onboardingCompleted = session.onboardingCompleted;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.onboardingCompleted = token.onboardingCompleted;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
