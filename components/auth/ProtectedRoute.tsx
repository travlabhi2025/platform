"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, userProfile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("[ProtectedRoute] State check:", {
      loading,
      hasUser: !!user,
      userId: user?.uid,
      email: user?.email,
      hasUserProfile: !!userProfile,
      userRole: userProfile?.role,
      pathname,
      timestamp: new Date().toISOString(),
    });

    if (!loading && !user) {
      console.log("[ProtectedRoute] ❌ No user found - redirecting to signin");
      // Preserve the current URL as a redirect parameter
      const redirectUrl = encodeURIComponent(pathname);
      router.push(`/signin?redirect=${redirectUrl}`);
    } else if (!loading && user && userProfile) {
      // Security check: Block organisers from accessing protected routes
      if (userProfile.role === "organiser") {
        console.log("[ProtectedRoute] 🚫 Organiser detected - redirecting to signin");
        router.push("/signin?error=organiser_access_denied");
        return;
      }
      console.log("[ProtectedRoute] ✅ User authenticated:", {
        uid: user.uid,
        email: user.email,
        hasProfile: !!userProfile,
        role: userProfile.role,
      });
    }
  }, [user, loading, router, pathname, userProfile]);

  if (loading) {
    console.log("[ProtectedRoute] ⏳ Loading auth state...");
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    console.log("[ProtectedRoute] ❌ No user - returning null");
    return null;
  }

  // Security check: Block organisers BEFORE rendering (prevents race condition)
  if (userProfile && userProfile.role === "organiser") {
    console.log("[ProtectedRoute] 🚫 Organiser detected - blocking render");
    return null;
  }

  console.log("[ProtectedRoute] ✅ Rendering protected content");
  return <>{children}</>;
}
