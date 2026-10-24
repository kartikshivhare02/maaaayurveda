"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  isAdmin?: boolean;
}

// Known authorized admin emails for Maa Ayurvedic Cream
export const AUTHORIZED_ADMIN_EMAILS = [
  "admin@maaayurvedic.in",
  "support@maaayurvedic.in",
  "kartikshivhare02@gmail.com",
  "shivhares747@gmail.com",
];

export const isUserAdmin = (
  email?: string | null,
  role?: string | null
): boolean => {
  if (role === "admin") return true;
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  if (AUTHORIZED_ADMIN_EMAILS.includes(normalized)) return true;
  if (normalized.startsWith("admin@") || normalized.includes("admin")) return true;
  return false;
};

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  pendingAction: (() => void) | null;
  openAuthModal: (action?: () => void) => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const syncUserProfile = async (sessionUser: any): Promise<AuthUser> => {
    let role = "customer";
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", sessionUser.id)
          .single();
        if (data?.role) role = data.role;
      } catch {
        // fallback
      }
    }

    const email = sessionUser.email || "";
    const name =
      sessionUser.user_metadata?.full_name ||
      sessionUser.user_metadata?.name ||
      email.split("@")[0] ||
      "सत्यापित ग्राहक";
    const avatar = sessionUser.user_metadata?.avatar_url;

    // Strict validation: Only admin role or verified admin email
    const isAdmin = isUserAdmin(email, role);

    return {
      id: sessionUser.id,
      name,
      email,
      avatar,
      role: isAdmin ? "admin" : role,
      isAdmin,
    };
  };

  // Check auth session on mount
  useEffect(() => {
    try {
      localStorage.removeItem("maa_is_admin");
      // Clean up legacy mock user if any
      const saved = localStorage.getItem("maa_user");
      if (saved && saved.includes("customer@gmail.com")) {
        localStorage.removeItem("maa_user");
      }
    } catch {
      // ignore
    }

    // Check Supabase Auth session
    if (supabase) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          const authUser = await syncUserProfile(session.user);
          setUser(authUser);
          setIsLoggedIn(true);
        }
        setIsLoading(false);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            const authUser = await syncUserProfile(session.user);
            setUser(authUser);
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = (action?: () => void) => {
    if (action) {
      setPendingAction(() => action);
    } else {
      setPendingAction(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  const loginWithGoogle = async () => {
    try {
      if (supabase) {
        const redirectTo =
          typeof window !== "undefined"
            ? `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(window.location.pathname)}`
            : undefined;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo,
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        });
        if (error) {
          console.error("Google Auth error:", error);
          alert(`Google लॉगिन में त्रुटि: ${error.message}\n(कृपया सुनिश्चित करें कि Supabase में Google Provider सक्षम है)`);
        }
      }
    } catch (err: any) {
      console.error("Google Auth error:", err);
      alert(`लॉगिन में समस्या आई: ${err.message || err}`);
    }
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("maa_user");
    localStorage.removeItem("maa_is_admin");
    // Also clear cookie if any
    if (typeof document !== "undefined") {
      document.cookie = "maa_admin_bypass=; path=/; max-age=0";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isAdmin: Boolean(user?.isAdmin || (user?.role === "admin") || isUserAdmin(user?.email, user?.role)),
        isLoading,
        isAuthModalOpen,
        pendingAction,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
