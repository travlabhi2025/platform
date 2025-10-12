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
    role: "trip-organizer" | "customer"
  ) => Promise<{ authUser: AuthUser; userProfile: User }>;
  signOut: () => Promise<void>;
  isOrganizer: () => boolean;
  isCustomer: () => boolean;
  waitForUserProfile: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user profile from Firestore
        try {
          const profile = await userService.getUserById(firebaseUser.uid);
          setUserProfile(profile);
        } catch (error: unknown) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password);
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: "trip-organizer" | "customer"
  ) => {
    const { authUser, userProfile } = await authService.signUp(
      email,
      password,
      name,
      role
    );

    // Immediately set the user profile to avoid race conditions
    setUserProfile(userProfile);

    // The onAuthStateChanged will still fire, but now we already have the profile
    return { authUser, userProfile };
  };

  const signOut = async () => {
    await authService.signOut();
  };

  const isOrganizer = () => {
    return userProfile?.role === "trip-organizer";
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
    isOrganizer,
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
