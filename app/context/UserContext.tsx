'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'attendee' | 'organizer';

interface UserContextType {
  role: UserRole;
  user: string | null;
  login: (email: string, role: UserRole) => void;
  signup: (email: string, role: UserRole) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('organizer');
  const [user, setUserState] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedRole = localStorage.getItem('user_role') as UserRole;
        const savedUser = localStorage.getItem('user_session');
        
        const loadState = () => {
          if (savedRole === 'attendee' || savedRole === 'organizer') {
            setRoleState(savedRole);
          } else {
            setRoleState('organizer');
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

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_role', newRole);
    }
  };

  const login = (email: string, targetRole: UserRole = 'organizer') => {
    setUserState(email);
    setRoleState(targetRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_session', email);
      localStorage.setItem('user_role', targetRole);
    }
  };

  const signup = (email: string, targetRole: UserRole = 'organizer') => {
    // In a real app, you would create the user here
    setUserState(email);
    setRoleState(targetRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_session', email);
      localStorage.setItem('user_role', targetRole);
    }
  };

  const logout = () => {
    setUserState(null);
    setRoleState('organizer');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_session');
      localStorage.removeItem('user_role');
    }
  };

  return (
    <UserContext.Provider value={{ role, user, login, signup, logout, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
