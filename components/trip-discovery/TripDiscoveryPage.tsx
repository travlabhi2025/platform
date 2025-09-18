"use client";

import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/common/SiteHeader";
import { useTrips } from "@/lib/hooks";
import { useAuth } from "@/lib/auth-context";

export default function TripDiscoveryPage() {
  const { trips, loading, error } = useTrips();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto px-4 md:px-8 lg:px-12 pt-8 md:pt-10 pb-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading trips...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto px-4 md:px-8 lg:px-12 pt-8 md:pt-10 pb-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">
              Error loading trips: {error}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="mx-auto px-4 md:px-8 lg:px-12 pt-8 md:pt-10 pb-10">
        <div className="mb-8">
          <h1 className="font-garetheavy text-primary text-3xl md:text-4xl leading-[44px] mb-4">
            Discover Amazing Trips
          </h1>
          <p className="text-slate-600">
            Explore curated trips from our community of travel organizers
          </p>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-lg text-slate-600 mb-4">
              No trips available yet
            </div>
            {user && (
              <Link
                href="/dashboard"
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
              >
                Create Your First Trip
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trip-details?id=${trip.id}`}
                className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={trip.heroImageUrl}
                    alt={trip.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                      {trip.title}
                    </h3>
                    <span className="text-lg font-bold text-primary">
                      ₹{trip.priceInInr.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Location:</span>
                      <span>{trip.about.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Duration:</span>
                      <span>
                        {trip.about.startDate} - {trip.about.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Type:</span>
                      <span>{trip.about.tripType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Group Size:</span>
                      <span>
                        {trip.about.groupSizeMin}-{trip.about.groupSizeMax}{" "}
                        people
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                      <span className="text-sm text-slate-600">
                        {trip.host.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-slate-600">
                        {trip.host.rating}
                      </span>
                      <span className="text-sm text-slate-500">
                        ({trip.host.reviewsCount})
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">
                        {trip.bookings} bookings
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trip.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : trip.status === "Upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
