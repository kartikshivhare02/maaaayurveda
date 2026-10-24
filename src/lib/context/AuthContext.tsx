"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  pendingAction: (() => void) | null;
  openAuthModal: (action?: () => void) => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Check auth session on mount
  useEffect(() => {
    // 1. Check Supabase Auth
    if (supabase && isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0] ||
              "सत्यापित ग्राहक",
            email: session.user.email || "",
            avatar: session.user.user_metadata?.avatar_url,
          };
          setUser(authUser);
          setIsLoggedIn(true);
        }
        setIsLoading(false);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            const authUser: AuthUser = {
              id: session.user.id,
              name:
                session.user.user_metadata?.full_name ||
                session.user.user_metadata?.name ||
                session.user.email?.split("@")[0] ||
                "सत्यापित ग्राहक",
              email: session.user.email || "",
              avatar: session.user.user_metadata?.avatar_url,
            };
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
      // 2. Check cached local user session
      try {
        const saved = localStorage.getItem("maa_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.email || parsed.name)) {
            setUser(parsed);
            setIsLoggedIn(true);
          }
        }
      } catch {
        // ignore
      }
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
      if (supabase && isSupabaseConfigured()) {
        const redirectTo =
          typeof window !== "undefined"
            ? `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(window.location.pathname)}`
            : undefined;
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo },
        });
      } else {
        // Instant simulated Google OAuth for local testing
        const demoUser: AuthUser = {
          id: `usr-${Date.now()}`,
          name: "प्रमाणित गूगल ग्राहक",
          email: "customer@gmail.com",
        };
        setUser(demoUser);
        setIsLoggedIn(true);
        localStorage.setItem("maa_user", JSON.stringify(demoUser));

        // Execute pending action (e.g. add to cart / buy now)
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
        setIsAuthModalOpen(false);
      }
    } catch (err) {
      console.error("Google Auth error:", err);
    }
  };

  const continueAsGuest = () => {
    const guestUser: AuthUser = {
      name: "अतिथि ग्राहक (Guest)",
      email: "guest@maaayurvedic.in",
    };
    setUser(guestUser);
    setIsLoggedIn(true);
    localStorage.setItem("maa_user", JSON.stringify(guestUser));

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    if (supabase && isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("maa_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        isAuthModalOpen,
        pendingAction,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        continueAsGuest,
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
