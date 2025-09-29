"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrganizerProtectedRouteProps {
  children: React.ReactNode;
}

export default function OrganizerProtectedRoute({
  children,
}: OrganizerProtectedRouteProps) {
  const { user, userProfile, loading, isOrganizer } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Preserve the current URL as a redirect parameter
        const redirectUrl = encodeURIComponent(pathname);
        router.push(`/signin?redirect=${redirectUrl}`);
      } else if (userProfile && !isOrganizer()) {
        // Redirect customers to their profile page
        router.push("/profile");
      }
    }
  }, [user, userProfile, loading, isOrganizer, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (userProfile && !isOrganizer()) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              This area is only accessible to trip organizers.
            </p>
            <p className="text-sm text-slate-500">
              You are currently signed in as a customer account.
            </p>
            <button
              onClick={() => router.push("/profile")}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              Go to Profile
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
