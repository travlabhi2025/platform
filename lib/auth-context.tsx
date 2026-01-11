"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { authService, AuthUser } from "./auth";
import { userService, User } from "./firestore";

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    phone?: string
  ) => Promise<{ authUser: AuthUser; userProfile: User }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ firebaseUser: FirebaseUser; userProfile: User }>;
  isCustomer: () => boolean;
  waitForUserProfile: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle auth state changes
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    console.log("[auth-context] 🔄 Setting up onAuthStateChanged listener");

    unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      console.log("[auth-context] 🔔 onAuthStateChanged fired:", {
        hasUser: !!firebaseUser,
        uid: firebaseUser?.uid,
        email: firebaseUser?.email,
        displayName: firebaseUser?.displayName,
        timestamp: new Date().toISOString(),
      });

      setUser(firebaseUser);

      if (firebaseUser) {
        console.log("[auth-context] ✅ User authenticated, fetching profile...");
        // Fetch user profile from Firestore
        try {
          const profile = await userService.getUserById(firebaseUser.uid);
          
          if (profile) {
            console.log("[auth-context] ✅ Profile found:", {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role,
            });
            setUserProfile(profile);
          } else {
            console.log("[auth-context] ⚠️ No profile found, creating new one...");
            // Create profile if it doesn't exist (fallback for OAuth users)
            const newProfile = await userService.createOrUpdateUser({
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
              email: firebaseUser.email || "",
              emailVerified: firebaseUser.emailVerified || false,
              role: "customer",
              avatar: firebaseUser.photoURL || undefined
            }, firebaseUser.uid);
            console.log("[auth-context] ✅ Created new profile:", {
              id: newProfile.id,
              name: newProfile.name,
            });
            setUserProfile(newProfile);
          }
        } catch (error: unknown) {
          console.error("[auth-context] ❌ Error fetching user profile:", error);
        }
      } else {
        console.log("[auth-context] 👤 No user - clearing profile");
        setUserProfile(null);
      }

      console.log("[auth-context] ✅ Auth state update complete, setting loading to false");
      setLoading(false);
    });

    return () => {
      console.log("[auth-context] 🧹 Cleaning up auth listener");
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password);
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    // Force role to "customer"
    const { authUser, userProfile } = await authService.signUp(
      email,
      password,
      name,
      "customer",
      phone
    );

    // Immediately set the user profile to avoid race conditions
    setUserProfile(userProfile);

    // The onAuthStateChanged will still fire, but now we already have the profile
    return { authUser, userProfile };
  };

  const signOut = async () => {
    await authService.signOut();
  };

  const signInWithGoogle = async () => {
    console.log("[auth-context] 🚀 Starting Google OAuth sign-in...");
    try {
      const result = await authService.signInWithGoogle();
      console.log("[auth-context] ✅ Google OAuth successful:", {
        uid: result.firebaseUser.uid,
        email: result.firebaseUser.email,
        hasProfile: !!result.userProfile,
        profileId: result.userProfile.id,
      });
      
      // Immediately set user and profile from popup result
      // The FirebaseUser will also trigger onAuthStateChanged, but setting it here
      // ensures immediate state update for redirect
      console.log("[auth-context] 📝 Setting user state immediately...");
      setUser(result.firebaseUser);
      setUserProfile(result.userProfile);
      
      console.log("[auth-context] ✅ User state set:", {
        userSet: !!result.firebaseUser,
        profileSet: !!result.userProfile,
      });
      
      return result;
    } catch (error: unknown) {
      console.error("[auth-context] ❌ Google OAuth error:", error);
      throw error;
    }
  };

  const isCustomer = () => {
    return userProfile?.role === "customer";
  };

  const waitForUserProfile = async (
    timeoutMs: number = 5000
  ): Promise<User | null> => {
    // If we already have the user profile, return it immediately
    if (userProfile) {
      return userProfile;
    }

    // If we don't have a user, return null
    if (!user) {
      return null;
    }

    // Wait for the user profile to load with timeout
    return new Promise((resolve) => {
      const startTime = Date.now();

      const checkProfile = () => {
        if (userProfile) {
          resolve(userProfile);
        } else if (Date.now() - startTime > timeoutMs) {
          // Timeout reached, resolve with null
          console.warn("Timeout waiting for user profile to load");
          resolve(null);
        } else {
          // Check again after a short delay
          setTimeout(checkProfile, 50);
        }
      };
      checkProfile();
    });
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    isCustomer,
    waitForUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
