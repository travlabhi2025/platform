"use client";

import { useAuth } from "@/lib/auth-context";
import DashboardPage from "./DashboardPage"; // Organizer dashboard
import CustomerDashboard from "./CustomerDashboard"; // Customer dashboard
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UnifiedDashboard() {
  const { userProfile, loading } = useAuth();

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Force a page refresh to get latest data
      window.location.reload();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Show loading state while user profile is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-8 md:pt-8 pb-10">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-10">
            {/* Sidebar Skeleton - Hidden on mobile */}
            <div className="hidden lg:block order-1 lg:order-1 lg:basis-[320px] lg:w-[320px] lg:shrink-0 lg:self-stretch">
              <div className="sticky top-24 bg-white rounded-lg border border-slate-200 p-4 md:p-5 flex flex-col h-full max-h-[calc(100vh-8rem)]">
                {/* Profile section skeleton */}
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>

                {/* Navigation skeleton */}
                <nav className="mt-4 space-y-1 flex-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="px-3 py-2">
                      <Skeleton className="h-4 w-28" />
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <section className="order-2 lg:order-2 lg:flex-1">
              {/* Header Skeleton */}
              <div className="mb-6">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
              </div>

              {/* Summary Cards Skeleton */}
              <div className="mb-6">
                <Skeleton className="h-4 w-16 mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-white border border-slate-200 rounded-lg p-4"
                    >
                      <Skeleton className="h-3 w-16 mb-2" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
              </div>

              {/* My Trips Section Skeleton */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bookings Section Skeleton */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Earnings Section Skeleton */}
              <div className="mb-6">
                <Skeleton className="h-4 w-16 mb-3" />
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Section Skeleton */}
              <div className="mb-6">
                <Skeleton className="h-4 w-32 mb-3" />
                <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-14 h-14 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // If not loading but no user profile, show loading state (should be rare now)
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  switch (userProfile.role) {
    case "trip-organizer":
      return <DashboardPage />;
    case "customer":
      return <CustomerDashboard />;
    default:
      // Fallback for unknown roles
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              Unknown User Role
            </h1>
            <p className="text-slate-600">
              Your account has an unrecognized role. Please contact support.
            </p>
          </div>
        </div>
      );
  }
}
