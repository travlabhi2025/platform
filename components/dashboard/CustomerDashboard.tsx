"use client";

import SiteHeader from "@/components/common/SiteHeader";
import { useAuth } from "@/lib/auth-context";
import { useMyBookings } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function CustomerDashboard() {
  const { userProfile } = useAuth();
  const { bookings: myBookings, loading: bookingsLoading } = useMyBookings();

  if (bookingsLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SiteHeader />
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-lg p-6"
              >
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>

          {/* Bookings Table Skeleton */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-garetheavy text-slate-900 mb-2">
            Welcome back, {userProfile?.name?.split(" ")[0]}!
          </h1>
          <p className="text-slate-600">
            Here&apos;s an overview of your trip bookings and travel plans.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {myBookings.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Confirmed Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {myBookings.filter((b) => b.status === "Approved").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Pending Approval
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {myBookings.filter((b) => b.status === "Pending").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                ₹
                {myBookings
                  .filter((b) => b.status === "Approved")
                  .reduce((sum, b) => sum + b.totalAmount, 0)
                  .toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-garetheavy text-slate-900">
              Your Trip Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600 mb-4">
                  You haven&apos;t booked any trips yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/booking-confirmation/${booking.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex-1">
                        <h3 className="font-bold text-primary text-lg mb-1">
                          Booking ID: {booking.id}
                        </h3>
                        <p className="text-sm text-slate-600 mb-1">
                          Trip ID: {booking.tripId}
                        </p>
                        <p className="text-sm text-slate-600">
                          Traveler: {booking.travelerName}
                        </p>
                        <p className="text-sm text-slate-600">
                          Group Size: {booking.groupSize} people
                        </p>
                        <p className="text-sm text-slate-600">
                          Booking Date:{" "}
                          {(() => {
                            try {
                              if (
                                typeof booking.bookingDate === "object" &&
                                booking.bookingDate.seconds
                              ) {
                                return new Date(
                                  booking.bookingDate.seconds * 1000
                                ).toLocaleDateString();
                              }
                              return new Date(
                                booking.bookingDate as unknown as string
                              ).toLocaleDateString();
                            } catch {
                              return "Invalid Date";
                            }
                          })()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            booking.status === "Approved"
                              ? "default"
                              : booking.status === "Pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className="mb-2"
                        >
                          {booking.status}
                        </Badge>
                        <div className="text-lg font-semibold text-slate-900">
                          ₹{booking.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-garetheavy text-slate-900">
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Manage your personal information and preferences.
              </p>
              <Link
                href="/profile"
                className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
              >
                View Profile
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
