"use client";

import Image from "next/image";
import SiteHeader from "@/components/common/SiteHeader";
import { EVEREST_BASE_CAMP_TRIP } from ".";
import { useState } from "react";
import { useTrip } from "@/lib/hooks";
import { useCreateBooking } from "@/lib/hooks";
import { useAuth } from "@/lib/auth-context";
import { Check, X, Edit, Copy, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function StarsAverage({ rating }: { rating: number }) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <div
      className="relative inline-block leading-none"
      aria-label={`${rating.toFixed(1)} out of 5`}
    >
      <div className="text-slate-300 select-none">★★★★★</div>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${percent}%` }}
      >
        <div className="text-slate-900 select-none">★★★★★</div>
      </div>
    </div>
  );
}

function StarsSolid({ rating }: { rating: number }) {
  const full = Math.round(Math.max(0, Math.min(5, rating)));
  const empty = 5 - full;
  return (
    <div className="leading-none" aria-label={`${rating} out of 5`}>
      <span className="text-slate-900 select-none">{"★".repeat(full)}</span>
      <span className="text-slate-300 select-none">{"★".repeat(empty)}</span>
    </div>
  );
}

interface TripDetailsPageProps {
  tripId: string;
}

export default function TripDetailsPage({ tripId }: TripDetailsPageProps) {
  const { trip, loading, error } = useTrip(tripId);
  const { createBooking, loading: bookingLoading } = useCreateBooking();
  const { user } = useAuth();

  // Debug logging
  console.log("TripDetailsPage - tripId:", tripId);
  console.log("TripDetailsPage - trip data:", trip);
  console.log("TripDetailsPage - loading:", loading);
  console.log("TripDetailsPage - error:", error);
  const [openDays, setOpenDays] = useState<number[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [bookingData, setBookingData] = useState({
    travelerName: "",
    travelerEmail: "",
    travelerPhone: "",
    groupSize: 1,
    preferences: "",
  });

  const toggleDay = (day: number) =>
    setOpenDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

  const handleDuplicate = async () => {
    if (!trip || !user) return;

    setIsDuplicating(true);
    try {
      // Create a copy of the trip data with a new title
      const duplicatedTrip = {
        ...trip,
        title: `${trip.title} (Copy)`,
        status: "Upcoming" as const,
        bookings: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...duplicatedTrip,
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to duplicate trip");
      }

      toast.success("Trip duplicated successfully!");
      setShowDuplicateModal(false);
      // Optionally redirect to the new trip or refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error duplicating trip:", error);
      toast.error("Failed to duplicate trip");
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDelete = async () => {
    if (!trip || !user) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/trips/${trip.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete trip");
      }

      toast.success("Trip deleted successfully!");
      setShowDeleteModal(false);
      // Redirect to dashboard after deletion
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      alert("Please sign in to book a trip");
      return;
    }

    if (!trip) return;

    try {
      await createBooking({
        tripId: trip.id!,
        travelerName: bookingData.travelerName,
        travelerEmail: bookingData.travelerEmail,
        travelerPhone: bookingData.travelerPhone,
        groupSize: bookingData.groupSize,
        preferences: bookingData.preferences,
        status: "Pending",
        totalAmount: trip.priceInInr * bookingData.groupSize,
        paymentStatus: "Pending",
      });

      alert("Booking created successfully!");
      setShowBookingForm(false);
    } catch (error) {
      alert("Failed to create booking. Please try again.");
    }
  };

  // Use mock data if trip is not loaded yet or there's an error
  const data = trip || EVEREST_BASE_CAMP_TRIP;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto px-20 py-8 pb-28 lg:pb-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading trip details...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto px-20 py-8 pb-28 lg:pb-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">
              Error loading trip: {error}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="mx-auto px-20 py-8 pb-28 lg:pb-8">
        {/* Hero + Sidebar CTA */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="lg:flex-1">
            <div className="relative w-full h-[280px] md:h-[340px] lg:h-[380px] overflow-hidden rounded-md">
              <Image
                src={data.heroImageUrl}
                alt={data.title}
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <h1 className="font-garetheavy text-slate-900 text-3xl md:text-4xl">
                {data.title.toUpperCase()}
              </h1>
              {user && data.createdBy === user.uid && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Link
                    href={`/edit-trip/${data.id}`}
                    className="flex items-center gap-1 px-3 py-1 hover:text-primary transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={() => setShowDuplicateModal(true)}
                    className="flex items-center gap-1 px-3 py-1 hover:text-primary transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Duplicate</span>
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-1 px-3 py-1 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
            {/* About this trip */}
            <section className="mt-10">
              <h2 className="font-garetheavy text-slate-900 text-xl mb-4">
                About this trip
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-200 pt-4">
                <div>
                  <div className="text-xs text-slate-500">Trip</div>
                  <div className="text-sm">{data.about.tripName}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Location</div>
                  <div className="text-sm">{data.about.location}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Dates</div>
                  <div className="text-sm">
                    {data.about.startDate && data.about.endDate
                      ? `${new Date(
                          data.about.startDate
                        ).toLocaleDateString()} - ${new Date(
                          data.about.endDate
                        ).toLocaleDateString()}`
                      : "Dates not set"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Group size</div>
                  <div className="text-sm">
                    {data.about.groupSizeMin}-{data.about.groupSizeMax}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Age group</div>
                  <div className="text-sm">
                    {data.about.ageMin}-{data.about.ageMax}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Trip type</div>
                  <div className="text-sm">{data.about.tripType}</div>
                </div>
              </div>
            </section>

            {/* Host */}
            <section className="mt-10">
              <h2 className="font-garetheavy text-slate-900 text-xl mb-3">
                Your host
              </h2>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-[64px] h-[32px] bg-slate-100 rounded" />
                <div>
                  <div className="font-semibold">{data.host.name}</div>
                  <div className="text-sm text-slate-600">
                    {data.host.rating} ({data.host.reviewsCount} reviews)
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {data.host.description}
                  </p>
                </div>
              </div>
            </section>

            {/* Itinerary */}
            <section className="mt-10">
              <h2 className="font-garetheavy text-slate-900 text-xl mb-3">
                Itinerary
              </h2>
              <div className="space-y-3">
                {data.itinerary.map((it) => {
                  const isOpen = openDays.includes(it.day);
                  return (
                    <div
                      key={it.day}
                      className={
                        isOpen
                          ? "rounded-md bg-primary text-white"
                          : "rounded-md bg-primary/90 text-white"
                      }
                    >
                      <button
                        type="button"
                        className="w-full px-4 py-3 flex items-center justify-between text-left"
                        onClick={() => toggleDay(it.day)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">
                            Day {it.day}
                          </span>
                          {it.title && (
                            <span className="text-sm opacity-90">
                              - {it.title}
                            </span>
                          )}
                        </div>
                        <span
                          className={
                            "ml-2 transition-transform duration-200" +
                            (isOpen ? " rotate-180" : "")
                          }
                        >
                          ▾
                        </span>
                      </button>
                      {isOpen && (
                        <div className="bg-white text-slate-700 px-4 py-3 text-sm">
                          {it.description || "Details coming soon."}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Inclusions / Exclusions */}
            <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="font-garetheavy text-slate-900 text-lg mb-3">
                  What&apos;s included
                </h3>
                <ul className="space-y-3">
                  {data.inclusions && data.inclusions.length > 0 ? (
                    data.inclusions.map((x) => (
                      <li key={x} className="flex items-start gap-3 text-sm">
                        <Check className="mt-0.5 w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{x}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500">
                      No inclusions specified
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="font-garetheavy text-slate-900 text-lg mb-3">
                  What&apos;s not included
                </h3>
                <ul className="space-y-3">
                  {data.exclusions && data.exclusions.length > 0 ? (
                    data.exclusions.map((x) => (
                      <li key={x} className="flex items-start gap-3 text-sm">
                        <X className="mt-0.5 w-4 h-4 text-red-600 flex-shrink-0" />
                        <span>{x}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500">
                      No exclusions specified
                    </li>
                  )}
                </ul>
              </div>
            </section>

            {/* Reviews */}
            <section className="mt-10">
              <h2 className="font-garetheavy text-slate-900 text-xl mb-3">
                Reviews
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-[320px,1fr] gap-8">
                <div>
                  <div className="text-4xl font-garetheavy text-slate-900">
                    {data.reviewsSummary.average.toFixed(1)}
                  </div>
                  <div className="mt-2">
                    <StarsAverage rating={data.reviewsSummary.average} />
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {data.reviewsSummary.totalCount} reviews
                  </div>
                  <div className="mt-3 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct =
                        data.reviewsSummary.distribution[
                          star as 1 | 2 | 3 | 4 | 5
                        ];
                      return (
                        <div
                          key={star}
                          className="flex items-center gap-2 text-xs text-slate-600"
                        >
                          <span className="w-4 text-right">{star}</span>
                          <div className="h-2 bg-slate-200 rounded w-full">
                            <div
                              className="h-2 bg-primary rounded"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-10 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-6">
                  {data.reviews && data.reviews.length > 0 ? (
                    data.reviews.map((r, idx) => (
                      <div key={idx} className="border rounded-md p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200" />
                          <div>
                            <div className="text-sm font-semibold">
                              {r.author}
                            </div>
                            <div className="text-xs text-slate-500">
                              {r.dateIso}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <StarsSolid rating={r.rating} />
                        </div>
                        <div className="mt-2 text-sm text-slate-700">
                          {r.content}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No reviews yet. Be the first to review this trip!</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section className="mt-10">
              <h2 className="font-garetheavy text-slate-900 text-xl mb-3">
                FAQs
              </h2>
              <div className="space-y-3">
                {data.faqs && data.faqs.length > 0 ? (
                  data.faqs.map((f, i) => (
                    <details
                      key={i}
                      className="rounded-md bg-primary/90 text-white open:bg-primary"
                    >
                      <summary className="cursor-pointer px-4 py-3 flex items-center justify-between">
                        <span className="text-sm">{f.question}</span>
                        <span className="ml-2">▾</span>
                      </summary>
                      <div className="bg-white text-slate-700 px-4 py-3 text-sm">
                        {f.answer}
                      </div>
                    </details>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No FAQs available yet.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Related trips */}
            <section className="mt-12">
              <h2 className="font-garetheavy text-slate-900 text-xl mb-4">
                Related trips
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {data.relatedTrips && data.relatedTrips.length > 0 ? (
                  data.relatedTrips.map((t) => (
                    <div
                      key={t.title}
                      className="rounded-md border overflow-hidden"
                    >
                      <div className="relative w-full h-[140px]">
                        <Image
                          src={t.imageUrl}
                          alt={t.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <div className="text-sm font-semibold">{t.title}</div>
                        <div className="text-xs text-slate-500">
                          {t.country}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <p>No related trips available.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="lg:pt-8 lg:basis-[320px] lg:w-[320px] lg:shrink-0 lg:self-start">
            <div className="p-4 w-full bg-white fixed bottom-0 left-0 right-0 z-50 rounded-none border-t border-x-0 border-b-0 lg:fixed lg:top-24 lg:right-20 lg:left-auto lg:bottom-auto lg:w-[320px] lg:rounded-md lg:border lg:z-auto">
              <div className="text-2xl font-garetheavy text-slate-900">
                ₹{data.priceInInr.toLocaleString("en-IN")}
              </div>
              <div className="text-xs text-slate-500">Per person</div>
              <button
                onClick={() => setShowBookingForm(true)}
                className="mt-4 w-full bg-primary text-white rounded-md py-2 font-bebas tracking-wide"
              >
                Book now
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Book This Trip</h2>
              <button
                onClick={() => setShowBookingForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleBooking();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={bookingData.travelerName}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      travelerName: e.target.value,
                    })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={bookingData.travelerEmail}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      travelerEmail: e.target.value,
                    })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={bookingData.travelerPhone}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      travelerPhone: e.target.value,
                    })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Size
                </label>
                <input
                  type="number"
                  min="1"
                  value={bookingData.groupSize}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      groupSize: parseInt(e.target.value),
                    })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Preferences (Optional)
                </label>
                <textarea
                  value={bookingData.preferences}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      preferences: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="text-sm text-gray-600">
                Total Amount: ₹
                {(data.priceInInr * bookingData.groupSize).toLocaleString()}
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {bookingLoading ? "Creating Booking..." : "Create Booking"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Duplicate Confirmation Modal */}
      <AlertDialog
        open={showDuplicateModal}
        onOpenChange={setShowDuplicateModal}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to duplicate this trip? A new trip will be
              created with the title "{trip?.title} (Copy)".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDuplicate}
              disabled={isDuplicating}
              className="bg-primary hover:bg-primary/90"
            >
              {isDuplicating ? "Duplicating..." : "Duplicate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this trip? This action cannot be
              undone and will permanently remove the trip and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
