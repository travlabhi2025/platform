"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import OrganizerProtectedRoute from "@/components/auth/OrganizerProtectedRoute";
import SiteHeader from "@/components/common/SiteHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingActions from "@/components/booking/BookingActions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Booking {
  id: string;
  tripId: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  groupSize: number;
  status: "Pending" | "Approved" | "Rejected";
  bookingDate: string | { seconds: number; nanoseconds: number };
  totalAmount: number;
  rejectionReason?: string;
  preferences?: string;
}

interface Trip {
  id: string;
  title: string;
  description: string;
  priceInInr: number;
}

export default function IndividualBookingPage() {
  const params = useParams();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingId = params?.id as string;
  const fetchBookingDetails = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch booking details (include user header for SSR-safe auth)
      const bookingResponse = await fetch(`/api/bookings/${bookingId}`, {
        headers: user?.uid ? { "x-user-id": user.uid } : undefined,
      });
      if (!bookingResponse.ok) {
        throw new Error("Failed to fetch booking details");
      }
      const bookingData = await bookingResponse.json();
      setBooking(bookingData);

      // Fetch trip details
      const tripResponse = await fetch(`/api/trips/${bookingData.tripId}`);
      if (!tripResponse.ok) {
        throw new Error("Failed to fetch trip details");
      }
      const tripData = await tripResponse.json();
      setTrip(tripData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [bookingId, user?.uid]);

  useEffect(() => {
    if (bookingId && user?.uid) {
      fetchBookingDetails();
    }
  }, [bookingId, user?.uid, fetchBookingDetails]);

  const handleBookingUpdate = () => {
    fetchBookingDetails();
  };

  const formatBookingDate = (
    bookingDate: string | { seconds: number; nanoseconds: number }
  ) => {
    try {
      if (typeof bookingDate === "object" && bookingDate.seconds) {
        return new Date(bookingDate.seconds * 1000).toLocaleDateString();
      }
      return new Date(bookingDate as string).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <OrganizerProtectedRoute>
        <div className="min-h-screen bg-white">
          <SiteHeader />
          <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-8 max-w-4xl">
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Loading booking details...</div>
            </div>
          </main>
        </div>
      </OrganizerProtectedRoute>
    );
  }

  if (error || !booking || !trip) {
    return (
      <OrganizerProtectedRoute>
        <div className="min-h-screen bg-white">
          <SiteHeader />
          <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-8 max-w-4xl">
            <div className="flex justify-center items-center py-8">
              <div className="text-red-600">{error || "Booking not found"}</div>
            </div>
          </main>
        </div>
      </OrganizerProtectedRoute>
    );
  }

  return (
    <OrganizerProtectedRoute>
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-8 max-w-4xl">
          {/* Back to Dashboard Button */}
          <div className="mb-6">
            <Link
              href="/trip-organizer/dashboard"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="font-garetheavy text-primary text-3xl md:text-4xl">
              Booking Details
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Traveler Name
                      </label>
                      <p className="text-lg font-semibold">
                        {booking.travelerName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Email
                      </label>
                      <p className="text-lg">{booking.travelerEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Phone
                      </label>
                      <p className="text-lg">
                        {booking.travelerPhone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Group Size
                      </label>
                      <p className="text-lg">
                        {booking.groupSize}{" "}
                        {booking.groupSize === 1 ? "person" : "people"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Booking Date
                      </label>
                      <p className="text-lg">
                        {formatBookingDate(booking.bookingDate)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Total Amount
                      </label>
                      <p className="text-lg font-semibold text-green-600">
                        ₹{booking.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {booking.preferences && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Special Preferences
                      </label>
                      <p className="text-lg bg-gray-50 p-3 rounded-md">
                        {booking.preferences}
                      </p>
                    </div>
                  )}

                  {booking.rejectionReason && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Rejection Reason
                      </label>
                      <p className="text-lg bg-red-50 p-3 rounded-md text-red-700">
                        {booking.rejectionReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trip Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Trip Title
                      </label>
                      <p className="text-lg font-semibold">{trip.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Description
                      </label>
                      <p className="text-lg">{trip.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Price per Person
                      </label>
                      <p className="text-lg">
                        ₹{trip.priceInInr.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                        booking.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <BookingActions
                      booking={booking}
                      onStatusUpdate={handleBookingUpdate}
                      showStatus={false}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </OrganizerProtectedRoute>
  );
}
