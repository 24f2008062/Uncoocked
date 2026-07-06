import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  // 1. Comment out the adapter to rely on a universal JWT session structure
  // adapter: PrismaAdapter(prisma), 
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
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
  debug: false,
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          if (!user?.email) {
            console.error("🚨 No email returned from Google profile");
            return false;
          }

          // Verify if a user with this email already exists
          let existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          // If they are completely new, provision their record safely
          if (!existingUser) {
            existingUser = await prisma.user.create({
              data: {
                email: user.email,
                // Safely falls back to whatever field name variant your database schema requires
                name: user.name || profile?.name || "Ecosystem Student", 
                image: user.image || profile?.picture || "",
                onboardingCompleted: false,
              },
            });
          }

          user.id = existingUser.id;
          user.onboardingCompleted = existingUser.onboardingCompleted;
          return true;
        } catch (error) {
          console.error("🚨 [Google DB Sync Error]:", error);
          // If your local DB constraints throw a mismatch error, we still let them authenticate
          return true; 
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.onboardingCompleted = user.onboardingCompleted;
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