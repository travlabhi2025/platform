"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users } from "lucide-react";
import Link from "next/link";

interface TripBookingStats {
  tripId: string;
  tripTitle: string;
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const TripsBookingOverview: React.FC = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<TripBookingStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTripsWithBookingStats = async () => {
    try {
      setLoading(true);
      const uid = user?.uid;
      if (!uid) return;

      // Fetch user's trips
      const tripsResponse = await fetch(`/api/trips?userId=${uid}`);
      if (!tripsResponse.ok) {
        throw new Error("Failed to fetch trips");
      }
      const userTrips = await tripsResponse.json();

      // For each trip, fetch booking stats
      const tripsWithStats = await Promise.all(
        userTrips.map(async (trip: { id: string; title: string }) => {
          try {
            const statsResponse = await fetch(
              `/api/bookings/stats?organizerId=${uid}&tripId=${trip.id}`
            );
            if (statsResponse.ok) {
              const stats = await statsResponse.json();
              return {
                tripId: trip.id,
                tripTitle: trip.title,
                total: stats.total || 0,
                pending: stats.pending || 0,
                approved: stats.approved || 0,
                rejected: stats.rejected || 0,
              };
            }
            return {
              tripId: trip.id,
              tripTitle: trip.title,
              total: 0,
              pending: 0,
              approved: 0,
              rejected: 0,
            };
          } catch (error) {
            console.error(`Error fetching stats for trip ${trip.id}:`, error);
            return {
              tripId: trip.id,
              tripTitle: trip.title,
              total: 0,
              pending: 0,
              approved: 0,
              rejected: 0,
            };
          }
        })
      );

      setTrips(tripsWithStats);
    } catch (error) {
      console.error("Error fetching trips with booking stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchTripsWithBookingStats();
    }
  }, [user?.uid, fetchTripsWithBookingStats]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">
          Loading trips and booking statistics...
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No trips found</h3>
            <p className="text-gray-400 mb-4">
              You haven&apos;t created any trips yet.
            </p>
            <Link href="/create-trip">
              <Button>Create Your First Trip</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Trips & Booking Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="px-4 py-2 font-medium">Trip</th>
                  <th className="px-4 py-2 font-medium">Total</th>
                  <th className="px-4 py-2 font-medium">Pending</th>
                  <th className="px-4 py-2 font-medium">Approved</th>
                  <th className="px-4 py-2 font-medium">Rejected</th>
                  <th className="px-4 py-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.tripId} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {trip.tripTitle}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{trip.total}</td>
                    <td className="px-4 py-3 text-yellow-600">
                      {trip.pending}
                    </td>
                    <td className="px-4 py-3 text-green-600">
                      {trip.approved}
                    </td>
                    <td className="px-4 py-3 text-red-600">{trip.rejected}</td>
                    <td className="px-4 py-3">
                      <div className="w-full flex justify-end">
                        <Link
                          href={`/dashboard/bookings?tripId=${trip.tripId}`}
                          className="border border-primary text-primary px-3 py-1.5 rounded-md inline-flex items-center gap-2 hover:bg-primary/10"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Manage Bookings
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {trips.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No trips found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripsBookingOverview;
