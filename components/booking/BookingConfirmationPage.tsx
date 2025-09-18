"use client";

import SiteHeader from "@/components/common/SiteHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function BookingConfirmationPage({
  bookingId,
}: {
  bookingId: string;
}) {
  const [booking, setBooking] = useState<{
    id: string;
    tripId: string;
    travelerName: string;
    groupSize: number;
    totalAmount: number;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <SiteHeader />
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
            <CardContent className="space-y-3">
              <p>
                Thank you for your booking. We’ve recorded your request and sent
                a confirmation.
              </p>
              <div className="text-sm grid grid-cols-1 gap-2">
                <div>
                  <span className="font-medium">Trip:</span> {booking?.tripId}
                </div>
                <div>
                  <span className="font-medium">Traveler:</span>{" "}
                  {booking?.travelerName}
                </div>
                <div>
                  <span className="font-medium">Group size:</span>{" "}
                  {booking?.groupSize}
                </div>
                <div>
                  <span className="font-medium">Total paid:</span> ₹
                  {Number(booking?.totalAmount || 0).toLocaleString("en-IN")}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {booking?.status}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => (window.location.href = "/dashboard#bookings")}
                >
                  Go to dashboard
                </Button>
                <Button variant="outline" onClick={() => window.history.back()}>
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
