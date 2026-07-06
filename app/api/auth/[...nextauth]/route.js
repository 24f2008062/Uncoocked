import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Add environment variable validation logging
if (!process.env.NEXTAUTH_SECRET) {
  console.warn("⚠️ NEXTAUTH_SECRET is not set in environment variables!");
}
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn("⚠️ GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing!");
}
if (process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.includes("localhost") && process.env.VERCEL) {
  console.warn("🚨 ERROR: NEXTAUTH_URL is set to localhost but this is running on Vercel! This will break Google Sign-In redirects.");
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
      // Force prompt so users can select an account if cookies get messed up
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Keep debug true to output raw NextAuth errors
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("➡️ [signIn Callback] Initiated for:", user?.email);
      try {
        // You can add custom user validation here
        return true;
      } catch (error) {
        console.error("🚨 [signIn Callback Error]:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      console.log("➡️ [redirect Callback] url:", url, "| baseUrl:", baseUrl);
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user, trigger, session, account }) {
      if (account) {
        console.log("➡️ [jwt Callback] Initial sign in for user:", user?.email);
      }
      if (user) {
        token.sub = user.id;
        token.onboardingCompleted = user.onboardingCompleted;
      }
      // Allow updating the token
      if (trigger === "update" && session?.onboardingCompleted) {
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
  events: {
    error(message) {
      console.error("🚨 [NextAuth Event Error]:", message);
    }
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login page on error instead of standard NextAuth error page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
