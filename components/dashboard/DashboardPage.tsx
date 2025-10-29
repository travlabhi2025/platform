"use client";

import SiteHeader from "@/components/common/SiteHeader";
import DashboardSidebar, { DashboardSidebarItem } from "./DashboardSidebar";
import SummaryCards from "./SummaryCards";
import MyTripsTable from "./MyTripsTable";
import BookingsTable from "./BookingsTable";
import EarningsSection from "./EarningsSection";
import ProfileVerification from "./ProfileVerification";
import CustomerDashboard from "./CustomerDashboard";
import { useAuth } from "@/lib/auth-context";
import { useMyTrips } from "@/lib/hooks";
import { useMyBookings } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useEffect, useState } from "react";
import { userService, type User as UserProfile } from "@/lib/firestore";

export default function DashboardPage() {
  const { user, userProfile, isCustomer } = useAuth();
  const {
    trips: myTrips,
    loading: tripsLoading,
    refetch: refetchTrips,
  } = useMyTrips();
  const { bookings: myBookings, loading: bookingsLoading } = useMyBookings();

  const items: DashboardSidebarItem[] = [
    {
      id: "overview",
      label: "Dashboard Overview",
      scrollTo: "overview-section",
    },
    { id: "my-trips", label: "My Trips", scrollTo: "my-trips-section" },
    { id: "bookings", label: "Bookings", scrollTo: "bookings" },
    { id: "earnings", label: "Earnings", scrollTo: "earnings-section" },
    { id: "profile", label: "Profile/Verification", scrollTo: "profile" },
  ];

  // Calculate summary data from real data
  const summaryData = [
    { label: "Total Trips", value: myTrips.length },
    {
      label: "Active Trips",
      value: myTrips.filter((t) => t.status === "Active").length,
    },
    { label: "Bookings", value: myBookings.length },
    {
      label: "Earnings",
      value: `₹${myBookings
        .filter((b) => b.status === "Approved")
        .reduce((sum, b) => sum + b.totalAmount, 0)
        .toLocaleString()}`,
    },
    {
      label: "Upcoming Trip Alerts",
      value: myTrips.filter((t) => t.status === "Upcoming").length,
    },
  ];

  // Transform trips data for the table
  const tripsData = myTrips.map((trip) => {
    try {
      return {
        id: trip.id || "unknown",
        title: trip.title,
        date: trip.date || "Unknown",
        status: (trip.status || "Active") as
          | "Active"
          | "Upcoming"
          | "Completed",
      };
    } catch (error) {
      console.error("Error transforming trip in dashboard:", trip, error);
      return {
        id: trip.id || "unknown",
        title: trip.title || "Untitled Trip",
        date: "Unknown",
        status: "Active" as "Active" | "Upcoming" | "Completed",
      };
    }
  });

  // Transform bookings data for the table (robust date handling)
  const bookingsData = myBookings.map((booking) => {
    let dateStr = "";
    const bd = (
      booking as {
        bookingDate: { toDate?: () => Date; seconds?: number } | string;
      }
    ).bookingDate;
    try {
      if (typeof bd === "object" && bd?.toDate) {
        dateStr = bd.toDate().toISOString().split("T")[0];
      } else if (typeof bd === "object" && typeof bd?.seconds === "number") {
        dateStr = new Date(bd.seconds * 1000).toISOString().split("T")[0];
      } else if (typeof bd === "string") {
        dateStr = bd.split("T")[0];
      }
    } catch (e) {
      console.error("Failed to parse booking date", booking.bookingDate, e);
      dateStr = "";
    }

    // Find the trip title from myTrips
    const trip = myTrips.find((t) => t.id === booking.tripId);
    const tripTitle = trip?.title || "Unknown Trip";

    return {
      id: booking.id || "unknown",
      tripId: booking.tripId || "unknown",
      tripName: tripTitle, // Add trip name for display
      travelerName: booking.travelerName,
      travelerEmail: booking.travelerEmail || "",
      travelerPhone: booking.travelerPhone || "",
      groupSize: booking.groupSize || 1,
      preferences: booking.preferences || "",
      status: booking.status,
      bookingDate: dateStr,
      totalAmount: booking.totalAmount || 0,
    };
  });

  // Mock earnings data for now
  const earningsData = {
    monthly: `₹${myBookings
      .filter((b) => b.status === "Approved")
      .reduce((sum, b) => sum + b.totalAmount, 0)
      .toLocaleString()}`,
    payoutSummary: `₹${myBookings
      .filter((b) => b.status === "Approved")
      .reduce((sum, b) => sum + b.totalAmount, 0)
      .toLocaleString()}`,
  };

  const [latestProfile, setLatestProfile] = useState<UserProfile | null>(null);

  // Fetch latest user profile to avoid stale context
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        if (!user?.uid) return;
        const fresh = await userService.getUserById(user.uid);
        if (!cancelled) setLatestProfile(fresh);
      } catch (e) {
        console.error("Failed to fetch latest user profile for dashboard:", e);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  // Profile data from freshest source available
  const src = latestProfile || userProfile || null;
  const profileData = {
    name: src?.name || user?.displayName || "User",
    avatar:
      src?.profilePicture ||
      src?.avatar ||
      user?.photoURL ||
      "/images/home/placeholders/profileImg.png",
    verified: src?.verified || false,
    kycVerified: src?.kycVerified || false,
    badge: src?.badge || "Organizer",
  };

  if (tripsLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto px-4 md:px-8 lg:px-12 pt-8 md:pt-8 pb-10">
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
        </main>
      </div>
    );
  }

  // Show customer dashboard for customers
  if (isCustomer()) {
    return <CustomerDashboard />;
  }

  // Show organizer dashboard for trip organizers
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="mx-auto px-4 md:px-8 lg:px-12 pt-8 md:pt-8 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-10">
          <div className="hidden lg:block order-1 lg:order-1 lg:basis-[320px] lg:w-[320px] lg:shrink-0 lg:self-stretch">
            <DashboardSidebar profile={profileData} items={items} />
          </div>

          <section className="order-2 lg:order-2 lg:flex-1">
            <div id="overview-section" className="scroll-mt-24">
              <h1 className="font-garetheavy text-primary text-3xl md:text-4xl leading-[44px] mb-6">
                Dashboard Overview
              </h1>

              <div className="mb-6">
                <div className="text-sm font-semibold text-slate-800 mb-3">
                  Summary
                </div>
                <SummaryCards cards={summaryData} />
              </div>
            </div>

            <div id="my-trips-section" className="mb-6 scroll-mt-24">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm font-semibold text-slate-800">
                  My Trips
                </div>
                <Link
                  href="/create-trip"
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
                >
                  Create Trip
                </Link>
              </div>
              <MyTripsTable trips={tripsData} onTripsUpdate={refetchTrips} />
            </div>

            <div id="bookings" className="mb-6 scroll-mt-24">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm font-semibold text-slate-800">
                  Bookings
                </div>
                <Link
                  href="/dashboard/bookings"
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
                >
                  Manage Bookings
                </Link>
              </div>
              <BookingsTable bookings={bookingsData} />
            </div>

            <div id="earnings-section" className="mb-6 scroll-mt-24">
              <div className="text-sm font-semibold text-slate-800 mb-3">
                Earnings
              </div>
              <EarningsSection earnings={earningsData} />
            </div>

            <div id="profile" className="mb-6 scroll-mt-24">
              <div className="text-sm font-semibold text-slate-800 mb-3">
                Profile/Verification
              </div>
              <ProfileVerification profile={profileData} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
