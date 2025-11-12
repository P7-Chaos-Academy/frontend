"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthService, User } from "../lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const initAuth = async () => {
      if (AuthService.isAuthenticated()) {
        try {
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        } catch {
          AuthService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [mounted]);

  const login = async (username: string, password: string) => {
    try {
      const response = await AuthService.login({ username, password });
      if (response.user) {
        console.log(
          "AuthContext: Login successful, setting user: ",
          response.user
        );
        setUser(response.user);
      } else {
        // If no user in response, try to fetch current user
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } 
    } finally {
      () => {1+1} // no-op to satisfy linting rules
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const isAdmin = AuthService.isAdmin(user);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
