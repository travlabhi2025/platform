"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTrip } from "@/lib/hooks";

export default function BookingConfirmationPage({
  bookingId,
}: {
  bookingId: string;
}) {
  const [booking, setBooking] = useState<{
    id: string;
    tripId: string;
    travelerName: string;
    travelerEmail: string;
    travelerPhone: string;
    groupSize: number;
    preferences?: string;
    totalAmount: number;
    status: string;
    bookingDate: { seconds: number } | string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trip details when we have a booking
  const { trip, loading: tripLoading } = useTrip(booking?.tripId || "");

  useEffect(() => {
    async function fetchBooking() {
      try {
        setLoading(true);
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load booking");
        }
        const data = await res.json();
        setBooking(data);
      } catch (e: unknown) {
        setError((e as Error).message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    if (bookingId) fetchBooking();
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-8 max-w-3xl">
        {loading ? (
          <div>Loading confirmation…</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Booking Confirmed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Thank you for your booking request. We've recorded your
                information and sent a confirmation to your email.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Booking Details
                </h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">
                      Booking ID:
                    </span>
                    <span className="text-blue-700">{booking?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Trip:</span>
                    <span className="text-blue-700">
                      {trip?.title || "Loading..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Host:</span>
                    <span className="text-blue-700">
                      {trip?.host?.name || "Loading..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Traveler:</span>
                    <span className="text-blue-700">
                      {booking?.travelerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Email:</span>
                    <span className="text-blue-700">
                      {booking?.travelerEmail}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Phone:</span>
                    <span className="text-blue-700">
                      {booking?.travelerPhone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">
                      Group Size:
                    </span>
                    <span className="text-blue-700">
                      {booking?.groupSize} people
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">
                      Total Amount:
                    </span>
                    <span className="text-blue-700 font-semibold">
                      ₹
                      {Number(booking?.totalAmount || 0).toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking?.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : booking?.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking?.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">
                      Booking Date:
                    </span>
                    <span className="text-blue-700">
                      {(() => {
                        try {
                          // Handle Firestore Timestamp
                          if (
                            typeof booking?.bookingDate === "object" &&
                            booking?.bookingDate.seconds
                          ) {
                            return new Date(
                              booking.bookingDate.seconds * 1000
                            ).toLocaleDateString();
                          }
                          // Handle regular Date string
                          return new Date(
                            booking?.bookingDate as string
                          ).toLocaleDateString();
                        } catch {
                          return "Invalid Date";
                        }
                      })()}
                    </span>
                  </div>
                  {booking?.preferences && (
                    <div className="flex flex-col">
                      <span className="font-medium text-blue-800">
                        Preferences:
                      </span>
                      <span className="text-blue-700 mt-1">
                        {booking.preferences}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-center pt-2">
                <Button
                  onClick={() =>
                    (window.location.href = `/trip/${booking?.tripId}`)
                  }
                  className="bg-primary text-white"
                >
                  View Trip Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
