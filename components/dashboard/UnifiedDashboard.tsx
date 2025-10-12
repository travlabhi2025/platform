"use client";

import { useAuth } from "@/lib/auth-context";
import DashboardPage from "./DashboardPage"; // Organizer dashboard
import CustomerDashboard from "./CustomerDashboard"; // Customer dashboard

export default function UnifiedDashboard() {
  const { userProfile, loading } = useAuth();

  // Show loading state while user profile is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not loading but no user profile, show loading state (should be rare now)
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading user profile...</p>
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
