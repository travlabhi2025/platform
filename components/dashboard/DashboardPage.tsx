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
import Link from "next/link";

export default function DashboardPage() {
  const { user, userProfile, isOrganizer, isCustomer } = useAuth();
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

  // Profile data from user
  const profileData = {
    name: userProfile?.name || user?.displayName || "User",
    avatar:
      userProfile?.profilePicture ||
      userProfile?.avatar ||
      user?.photoURL ||
      "/images/home/placeholders/profileImg.png",
    verified: userProfile?.verified || false,
    kycVerified: userProfile?.kycVerified || false,
    badge: userProfile?.badge || "Organizer",
  };

  if (tripsLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto px-4 md:px-8 lg:px-12 pt-8 md:pt-8 pb-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading dashboard...</div>
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
          <div className="order-1 lg:order-1 lg:basis-[320px] lg:w-[320px] lg:shrink-0 lg:self-stretch">
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
