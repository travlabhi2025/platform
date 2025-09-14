"use client";

import SiteHeader from "@/components/common/SiteHeader";
import DashboardSidebar, { DashboardSidebarItem } from "./DashboardSidebar";
import SummaryCards from "./SummaryCards";
import MyTripsTable from "./MyTripsTable";
import BookingsTable from "./BookingsTable";
import EarningsSection from "./EarningsSection";
import ProfileVerification from "./ProfileVerification";
import { useAuth } from "@/lib/auth-context";
import { useMyTrips } from "@/lib/hooks";
import { useMyBookings } from "@/lib/hooks";
import { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const { trips: myTrips, loading: tripsLoading } = useMyTrips();
  const { bookings: myBookings, loading: bookingsLoading } = useMyBookings();

  const items: DashboardSidebarItem[] = [
    {
      id: "overview",
      label: "Dashboard Overview",
      href: "/dashboard",
      active: true,
    },
    { id: "my-trips", label: "My Trips", href: "/my-trips" },
    { id: "bookings", label: "Bookings", href: "/dashboard#bookings" },
    { id: "earnings", label: "Earnings", href: "/dashboard#earnings" },
    {
      id: "profile",
      label: "Profile/Verification",
      href: "/dashboard#profile",
    },
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
        bookings: trip.bookings || 0,
      };
    } catch (error) {
      console.error("Error transforming trip in dashboard:", trip, error);
      return {
        id: trip.id || "unknown",
        title: trip.title || "Untitled Trip",
        date: "Unknown",
        status: "Active" as "Active" | "Upcoming" | "Completed",
        bookings: 0,
      };
    }
  });

  // Transform bookings data for the table
  const bookingsData = myBookings.map((booking) => ({
    travelerName: booking.travelerName,
    trip: "Trip Name", // We'd need to fetch trip details for this
    bookingDate: booking.bookingDate.toDate().toISOString().split("T")[0],
    status: booking.status,
  }));

  // Mock earnings data for now
  const earningsData = {
    monthly: `₹${myBookings
      .reduce((sum, b) => sum + b.totalAmount, 0)
      .toLocaleString()}`,
    payoutSummary: `₹${myBookings
      .reduce((sum, b) => sum + b.totalAmount, 0)
      .toLocaleString()}`,
  };

  // Profile data from user
  const profileData = {
    name: userProfile?.name || user?.displayName || "User",
    avatar:
      userProfile?.avatar ||
      user?.photoURL ||
      "/images/trip-discovery/profile-pic.png",
    verified: userProfile?.verified || false,
    kycVerified: userProfile?.kycVerified || false,
    badge: userProfile?.badge || "Organizer",
  };

  if (tripsLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto px-4 md:px-8 lg:px-12 pt-8 md:pt-10 pb-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading dashboard...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="mx-auto px-4 md:px-8 lg:px-12 pt-8 md:pt-10 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-10">
          <div className="order-1 lg:order-1 lg:basis-[320px] lg:w-[320px] lg:shrink-0 lg:self-stretch">
            <DashboardSidebar profile={profileData} items={items} />
          </div>

          <section className="order-2 lg:order-2 lg:flex-1">
            <h1 className="font-garetheavy text-primary text-3xl md:text-4xl leading-[44px] mb-6">
              Dashboard Overview
            </h1>

            <div className="mb-6">
              <div className="text-sm font-semibold text-slate-800 mb-3">
                Summary
              </div>
              <SummaryCards cards={summaryData} />
            </div>

            <div className="mb-6">
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
              <MyTripsTable trips={tripsData} />
            </div>

            <div id="bookings" className="mb-6">
              <div className="text-sm font-semibold text-slate-800 mb-3">
                Bookings
              </div>
              <BookingsTable bookings={bookingsData} />
            </div>

            <div id="earnings" className="mb-6">
              <div className="text-sm font-semibold text-slate-800 mb-3">
                Earnings
              </div>
              <EarningsSection earnings={earningsData} />
            </div>

            <div id="profile" className="mb-6">
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
