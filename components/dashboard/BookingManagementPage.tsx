"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BookingApprovalPanel from "@/components/booking/BookingApprovalPanel";
import TripsBookingOverview from "@/components/dashboard/TripsBookingOverview";
import Link from "next/link";

const BookingManagementPage: React.FC = () => {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-4 mb-2">
            {tripId && (
              <Link
                href="/dashboard/bookings"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Trips
              </Link>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {tripId ? "Trip Bookings" : "Booking Management"}
          </h1>
          <p className="text-gray-600 mt-1">
            {tripId
              ? "Manage and approve bookings for this specific trip"
              : "Manage and approve trip bookings from travelers"}
          </p>
        </div>
      </div>

      {/* Content */}
      {tripId ? (
        <BookingApprovalPanel
          tripId={tripId}
          onBookingUpdate={() => {
            // Refresh stats when bookings are updated
            window.location.reload();
          }}
        />
      ) : (
        <TripsBookingOverview />
      )}
    </div>
  );
};

export default BookingManagementPage;
