"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [role, setRoleState] = useState("organizer");
  const [user, setUserState] = useState(null);
  const { data: session, status } = useSession();

  // Synchronize NextAuth session with UserContext state
  useEffect(() => {
    if (session?.user) {
      setUserState(session.user.email);
      setRoleState(session.user.role || "attendee");
    }
  }, [session]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedRole = localStorage.getItem("user_role");
        const savedUser = localStorage.getItem("user_session");
        const loadState = () => {
          if (savedRole === "attendee" || savedRole === "organizer") {
            setRoleState(savedRole);
          } else {
            setRoleState("organizer");
          }
          if (savedUser) {
            setUserState(savedUser);
          }
        };

        const timer = setTimeout(loadState, 0);
        return () => clearTimeout(timer);
      } catch {
        // ignore
      }
    }
  }, []);

  const setRole = (newRole) => {
    setRoleState(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("user_role", newRole);
    }
  };

  const login = (email, targetRole = "organizer") => {
    setUserState(email);
    setRoleState(targetRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("user_session", email);
      localStorage.setItem("user_role", targetRole);
    }
  };

  const signup = (email, targetRole = "organizer") => {
    // In a real app, you would create the user here
    setUserState(email);
    setRoleState(targetRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("user_session", email);
      localStorage.setItem("user_role", targetRole);
    }
  };

  const logout = async () => {
    setUserState(null);
    setRoleState("organizer");
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_session");
      localStorage.removeItem("user_role");
    }
    // Also sign out of NextAuth
    await nextAuthSignOut({ redirect: false });
  };

  return (
    <UserContext.Provider
      value={{ role, user, login, signup, logout, setRole }}
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
