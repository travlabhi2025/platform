"use client";

import React from "react";
import { Clock } from "lucide-react";
import Link from "next/link";

interface PendingBookingsBannerProps {
  pendingCount: number;
}

const PendingBookingsBanner: React.FC<PendingBookingsBannerProps> = ({
  pendingCount,
}) => {
  if (pendingCount === 0) return null;

  return (
    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-orange-800">
              {pendingCount} Booking{pendingCount !== 1 ? "s" : ""} Pending
              Approval
            </h3>
            <p className="text-sm text-orange-700 mt-1">
              You have {pendingCount} booking{pendingCount !== 1 ? "s" : ""}{" "}
              waiting for your review and approval.
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Link
            href="/trip-organizer/dashboard/bookings"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-orange-800 bg-orange-100 hover:bg-orange-200 transition-colors"
          >
            Review Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PendingBookingsBanner;
