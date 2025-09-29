"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingActions from "./BookingActions";

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
}

interface BookingApprovalPanelProps {
  tripId?: string;
  onBookingUpdate: () => void;
}

const BookingApprovalPanel: React.FC<BookingApprovalPanelProps> = ({
  tripId,
  onBookingUpdate,
}) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const url = tripId
        ? `/api/bookings/trip/${tripId}`
        : `/api/bookings/pending?organizerId=${user.uid}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, tripId]);

  useEffect(() => {
    if (user?.uid) {
      fetchBookings();
    }
  }, [fetchBookings, user?.uid, tripId]);

  const handleBookingUpdate = () => {
    fetchBookings();
    onBookingUpdate();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading bookings...</div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="text-gray-500">
            <p className="text-lg font-medium mb-2">No bookings found</p>
            <p className="text-gray-400">
              {tripId
                ? "No bookings for this trip yet."
                : "No bookings to manage yet."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{tripId ? "Trip Bookings" : "All Bookings"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="px-4 py-2 font-medium">Traveler</th>
                  <th className="px-4 py-2 font-medium">Contact</th>
                  <th className="px-4 py-2 font-medium">Group Size</th>
                  <th className="px-4 py-2 font-medium">Amount</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {booking.travelerName}
                        </div>
                        {booking.travelerEmail && (
                          <div className="text-sm text-gray-500">
                            {booking.travelerEmail}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {booking.travelerPhone}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {booking.groupSize}{" "}
                      {booking.groupSize === 1 ? "person" : "people"}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      ₹{booking.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {(() => {
                        try {
                          // Handle Firestore Timestamp
                          if (
                            typeof booking.bookingDate === "object" &&
                            booking.bookingDate.seconds
                          ) {
                            return new Date(
                              booking.bookingDate.seconds * 1000
                            ).toLocaleDateString();
                          }
                          // Handle regular Date string
                          return new Date(
                            booking.bookingDate as string
                          ).toLocaleDateString();
                        } catch {
                          return "Invalid Date";
                        }
                      })()}
                    </td>
                    <td className="px-4 py-3">
                      <BookingActions
                        booking={booking}
                        onStatusUpdate={handleBookingUpdate}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Booking Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter((b) => b.status === "Pending").length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter((b) => b.status === "Approved").length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {bookings.filter((b) => b.status === "Rejected").length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingApprovalPanel;
