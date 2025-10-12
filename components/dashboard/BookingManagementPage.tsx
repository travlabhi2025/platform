"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Users } from "lucide-react";
import BookingApprovalPanel from "@/components/booking/BookingApprovalPanel";
import TripsBookingOverview from "@/components/dashboard/TripsBookingOverview";
import SiteHeader from "@/components/common/SiteHeader";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface TripDetails {
  id: string;
  title: string;
  about?: {
    destination?: string;
    startDate?: string;
    duration?: string;
  };
  pricing?: {
    priceInInr?: number;
  };
}

const BookingManagementPage: React.FC = () => {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTripDetails = useCallback(async () => {
    if (!tripId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/trips/${tripId}`);
      if (response.ok) {
        const data = await response.json();
        setTripDetails(data);
      }
    } catch (error) {
      console.error("Error fetching trip details:", error);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId, fetchTripDetails]);

  // Show skeleton loader while loading trip details
  if (loading && tripId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="container mx-auto p-6 space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-64" />
            </div>
          </div>

          {/* Trip Details Skeleton */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Skeleton className="h-6 w-48 mb-2" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-16 w-24" />
            </div>
          </div>

          {/* Booking Panel Skeleton */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4 mb-2">
              {tripId ? (
                <>
                  <Link
                    href="/dashboard/bookings"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to All Trips
                  </Link>
                </>
              ) : (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {tripId ? "Trip Bookings" : "Booking Management"}
            </h1>

            {tripId && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-6 bg-gray-300 rounded mb-2 w-1/3"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    ) : tripDetails ? (
                      <>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          {tripDetails.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {tripDetails.about?.destination && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span>{tripDetails.about.destination}</span>
                            </div>
                          )}
                          {tripDetails.about?.startDate && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>
                                {new Date(
                                  tripDetails.about.startDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {tripDetails.pricing?.priceInInr && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>
                                ₹
                                {tripDetails.pricing.priceInInr.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        Trip details not available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <p className="text-gray-600 mt-3">
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
    </div>
  );
};

export default BookingManagementPage;
