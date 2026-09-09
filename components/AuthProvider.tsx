"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  credits: number;
  loading: boolean;
  isAuthModalOpen: boolean;
  isTopupModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openTopupModal: () => void;
  closeTopupModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<{ success: boolean; message?: string }>;
  demoSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [credits, setCredits] = useState<number>(50);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);

  const supabase = createClient();

  const fetchCreditsAndProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/credits");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setCredits(data.credits ?? 50);
          setProfile({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.full_name,
            credits: data.credits ?? 50,
            avatar_url: data.user.avatar_url,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch credits and profile:", err);
    }
  }, []);

  useEffect(() => {
    // Initial session check
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetchCreditsAndProfile();
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchCreditsAndProfile();
      } else {
        setProfile(null);
        setCredits(0);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchCreditsAndProfile, supabase.auth]);

  const signInWithGoogle = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  const signInWithEmail = async (email: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: "Magic link sent to your email!" };
  };

  const demoSignIn = async () => {
    // Sign in anonymously or with test credentials
    const testEmail = "demo.builder@prdcraft.ai";
    const testPassword = "DemoUser#2026";

    // Attempt sign in or sign up
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (error) {
      // Try sign up if not exists
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: "Demo Architect",
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }
      if (signUpData.user) {
        setUser(signUpData.user);
        await fetchCreditsAndProfile();
        setIsAuthModalOpen(false);
      }
    } else if (data.user) {
      setUser(data.user);
      await fetchCreditsAndProfile();
      setIsAuthModalOpen(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setCredits(0);
  };

  const refreshCredits = async () => {
    await fetchCreditsAndProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        credits,
        loading,
        isAuthModalOpen,
        isTopupModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        openTopupModal: () => setIsTopupModalOpen(true),
        closeTopupModal: () => setIsTopupModalOpen(false),
        signInWithGoogle,
        signInWithEmail,
        demoSignIn,
        signOut,
        refreshCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
