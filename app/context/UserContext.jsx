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

  // Synchronize NextAuth session with UserContext state
  useEffect(() => {
    // If NextAuth is still checking the session, do not proceed with auth redirects
    if (status === "loading") {
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
      // Check for a local test session first
      if (typeof window !== "undefined") {
        const localSession = localStorage.getItem("user_session");
        if (localSession) {
          setUserState(localSession);
          setIsLoading(false);
          return; // Skip clearing the state
        }
      }

      // NextAuth finished loading and confirmed no session and no local session
      // Strictly clear any local fallback sessions to prevent stale access
      setUserState(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_session");
        localStorage.removeItem("uncooked_user_cache");
      }
      setIsLoading(false);
    }
  }, [session, status, pathname, router]);

  const login = (email) => {
    setUserState(email);
    if (typeof window !== "undefined") {
      localStorage.setItem("user_session", email);
    }
  };

  const signup = (email) => {
    // In a real app, you would create the user here
    setUserState(email);
    if (typeof window !== "undefined") {
      localStorage.setItem("user_session", email);
    }
  };

  const logout = async () => {
    setUserState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_session");
    }
    // Also sign out of NextAuth
    await nextAuthSignOut({ redirect: false });
  };

  return (
    <UserContext.Provider
      value={{ user, isLoading, login, signup, logout, isAuthenticated: status === "authenticated" }}
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
