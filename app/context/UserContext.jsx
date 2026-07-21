"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Synchronize NextAuth session with UserContext state (no localStorage fallback)
  useEffect(() => {
    // If NextAuth is still checking the session, do not proceed with auth redirects
    if (status === "loading") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      return;
    }

    if (session?.user) {
      setUserState(session.user.email);
      setIsLoading(false);

      // Auto-redirect new users to onboarding
      if (session.user.onboardingCompleted === false && pathname !== "/onboarding") {
        router.push("/onboarding");
      }
    } else if (status === "unauthenticated") {
      setUserState(null);
      setIsLoading(false);
    }
  }, [session, status, pathname, router]);

  const logout = async () => {
    setUserState(null);
    // Sign out of NextAuth
    await nextAuthSignOut({ redirect: false });
    // eslint-disable-next-line no-console
    console.info(`[AUTH] ${new Date().toISOString()} logout`, { email: session?.user?.email ?? null });
  };

  return (
    <UserContext.Provider
      value={{ user, isLoading, logout, isAuthenticated: status === "authenticated" }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
