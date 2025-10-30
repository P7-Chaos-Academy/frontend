"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      console.log("AdminGuard: No user, redirecting to login");
      window.location.href = "/login";
    } else if (!loading && user && !isAdmin) {
      console.warn("USER: ", user);
      console.warn("IS ADMIN: ", isAdmin);
      console.error("Access denied: User is not an admin.");
      window.location.href = "/unauthorized";
    }
  }, [user, loading, isAdmin]);

  if (loading) {
    return (
      <div>
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (!isAdmin) {
    return fallback || null; // Will redirect to unauthorized
  }

  return <>{children}</>;
}
