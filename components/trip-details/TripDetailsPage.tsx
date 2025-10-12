"use client";

import { useState } from "react";
import Image from "next/image";
import SiteHeader from "@/components/common/SiteHeader";
import { EVEREST_BASE_CAMP_TRIP } from ".";
import { useTrip } from "@/lib/hooks";
import { useAuth } from "@/lib/auth-context";
import { Check, X, Edit, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TripGallery from "./TripGallery";

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
  const { user } = useAuth();
  const [hostImageLoaded, setHostImageLoaded] = useState(false);
  const [relatedImagesLoaded, setRelatedImagesLoaded] = useState<
    Record<number, boolean>
  >({});

  // Debug logging
  console.log("TripDetailsPage - tripId:", tripId);
  console.log("TripDetailsPage - trip data:", trip);
  console.log("TripDetailsPage - loading:", loading);
  console.log("TripDetailsPage - error:", error);

  // Use mock data if trip is not loaded yet or there's an error
  const data = trip || EVEREST_BASE_CAMP_TRIP;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-8 pb-28 lg:pb-8 max-w-7xl">
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
        <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-8 pb-28 lg:pb-8 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">
              Error loading trip: {error}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Date TBD";
    }
  };

  const formatPrice = (price: number, currency: string = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={data.heroImageUrl}
            alt={data.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-3xl">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl md:text-6xl font-garetheavy text-white leading-tight">
                  {data.title}
                </h1>
                {user && "createdBy" in data && data.createdBy === user.uid && (
                  <Link
                    href={`/edit-trip/${data.id}`}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-white/80 hover:text-white transition-colors bg-white/20 rounded-md backdrop-blur-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">
                    {formatPrice(data.priceInInr, data.currency || "INR")}
                  </span>
                  <span className="text-sm">per person</span>
                </div>
                <div className="flex items-center gap-2">
                  <StarsSolid rating={data.reviewsSummary.average} />
                  <span className="text-sm">
                    {data.reviewsSummary.average.toFixed(1)} (
                    {data.reviewsSummary.totalCount} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{data.about.tripType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <section>
              <h2 className="font-garetheavy text-slate-900 text-2xl mb-6">
                About This Trip
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  Discover the amazing {data.about.tripName} experience in{" "}
                  {data.about.location}. This{" "}
                  {data.about.tripType.toLowerCase()} trip offers an
                  unforgettable adventure for travelers aged {data.about.ageMin}
                  -{data.about.ageMax} years.
                </p>

                {/* Trip Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Location
                    </h4>
                    <p className="text-slate-700">{data.about.location}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Trip Type
                    </h4>
                    <p className="text-slate-700">{data.about.tripType}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Group Size
                    </h4>
                    <p className="text-slate-700">
                      {data.about.groupSizeMin}-{data.about.groupSizeMax} people
                    </p>
                  </div>
                </div>

                {/* Date Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Start Date
                    </h4>
                    <p className="text-slate-700">
                      {"startDate" in data.about && data.about.startDate
                        ? formatDate(data.about.startDate)
                        : "Date TBD"}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      End Date
                    </h4>
                    <p className="text-slate-700">
                      {"endDate" in data.about && data.about.endDate
                        ? formatDate(data.about.endDate)
                        : "Date TBD"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Host Information */}
            <section>
              <h2 className="font-garetheavy text-slate-900 text-xl mb-3">
                Your host
              </h2>
              <div className="flex items-start gap-4">
                {"organizerImage" in data.host && data.host.organizerImage ? (
                  <div className="shrink-0 relative w-16 h-16 rounded-full overflow-hidden">
                    {/* Loading skeleton */}
                    {!hostImageLoaded && (
                      <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    )}
                    <Image
                      src={data.host.organizerImage}
                      alt={data.host.name}
                      width={64}
                      height={64}
                      className={`shrink-0 w-16 h-16 rounded-full object-cover transition-opacity duration-300 ${
                        hostImageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => setHostImageLoaded(true)}
                    />
                  </div>
                ) : (
                  <div className="shrink-0 w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-slate-400 text-sm font-medium">
                      {data.host.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
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
              <Accordion type="multiple" className="w-full space-y-3 pb-4">
                {data.itinerary.map((it) => (
                  <AccordionItem
                    key={it.day}
                    value={`day-${it.day}`}
                    className="rounded-md text-white border-0"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline bg-primary/90 text-white [&>svg]:text-white data-[state=open]:rounded-b-none">
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
                    </AccordionTrigger>
                    <AccordionContent className="bg-[#f28c0030] rounded-b-md text-slate-700 px-4 py-3 text-sm">
                      {it.description || "Details coming soon."}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Inclusions & Exclusions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-garetheavy text-slate-900 text-lg mb-3">
                  What&apos;s included
                </h3>
                <ul className="space-y-3">
                  {data.inclusions && data.inclusions.length > 0 ? (
                    data.inclusions.map((inclusion, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm"
                      >
                        <Check className="mt-0.5 w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{inclusion}</span>
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
                    data.exclusions.map((exclusion, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm"
                      >
                        <X className="mt-0.5 w-4 h-4 text-red-600 flex-shrink-0" />
                        <span>{exclusion}</span>
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

            {/* Trip Gallery */}
            {data.galleryImages && data.galleryImages.length > 0 && (
              <TripGallery images={data.galleryImages} title={data.title} />
            )}

            {/* Reviews */}
            <section>
              <h2 className="font-garetheavy text-slate-900 text-xl mb-3">
                Reviews
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-[320px,1fr] gap-8">
                <div>
                  <div className="text-center p-6 border border-slate-200 rounded-lg">
                    <div className="text-4xl font-bold text-slate-900 mb-2">
                      {data.reviewsSummary.average}
                    </div>
                    <div className="mb-3">
                      <StarsSolid rating={data.reviewsSummary.average} />
                    </div>
                    <div className="text-sm text-slate-600">
                      Based on {data.reviewsSummary.totalCount} reviews
                    </div>
                  </div>
                </div>
                <div>
                  {data.reviews && data.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {data.reviews.slice(0, 3).map((review, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-primary pl-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <StarsSolid rating={review.rating} />
                            <span className="text-sm font-medium">
                              {review.author}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700">
                            {review.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No reviews yet.</p>
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
              {data.faqs && data.faqs.length > 0 ? (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-3 pb-4"
                >
                  {data.faqs.map((f, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="rounded-md text-white border-0"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline bg-primary/90 text-white [&>svg]:text-white data-[state=open]:rounded-b-none">
                        <span className="text-sm text-left">{f.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="bg-[#f28c0030] rounded-b-md text-slate-700 px-4 py-3 text-sm">
                        {f.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No FAQs available yet.</p>
                </div>
              )}
            </section>

            {/* Related trips */}
            <section className="mt-12">
              <h2 className="font-garetheavy text-slate-900 text-xl mb-4">
                Related trips
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {data.relatedTrips && data.relatedTrips.length > 0 ? (
                  data.relatedTrips.map((t, index) => (
                    <div
                      key={t.title}
                      className="rounded-md border overflow-hidden"
                    >
                      <div className="relative w-full h-[140px]">
                        {/* Loading skeleton */}
                        {!relatedImagesLoaded[index] && (
                          <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          </div>
                        )}
                        <Image
                          src={t.imageUrl}
                          alt={t.title}
                          fill
                          className={`object-cover transition-opacity duration-300 ${
                            relatedImagesLoaded[index]
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                          onLoad={() =>
                            setRelatedImagesLoaded((prev) => ({
                              ...prev,
                              [index]: true,
                            }))
                          }
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {t.title}
                        </h3>
                        <p className="text-sm text-slate-600">{t.country}</p>
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

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {formatPrice(data.priceInInr, data.currency || "INR")}
                  </div>
                  <div className="text-sm text-slate-600">per person</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Start date</span>
                    <span className="font-medium">
                      {"startDate" in data.about && data.about.startDate
                        ? formatDate(data.about.startDate)
                        : "TBD"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">End date</span>
                    <span className="font-medium">
                      {"endDate" in data.about && data.about.endDate
                        ? formatDate(data.about.endDate)
                        : "TBD"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Duration</span>
                    <span className="font-medium">
                      {"startDate" in data.about &&
                      "endDate" in data.about &&
                      data.about.startDate &&
                      data.about.endDate
                        ? `${Math.ceil(
                            (new Date(data.about.endDate).getTime() -
                              new Date(data.about.startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )} days`
                        : "TBD"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Group size</span>
                    <span className="font-medium">
                      {data.about.groupSizeMin}-{data.about.groupSizeMax} people
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    toast.success("This test link works! To test: ", {
                      duration: 8000,
                      action: {
                        label: "Go to Booking",
                        onClick: () => {
                          window.location.href = `/book/${data.id}`;
                        },
                      },
                    });
                  }}
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-primary/90 transition-colors"
                >
                  Book this trip
                </button>

                <div className="mt-4 text-center">
                  <Link
                    href="/booking-status"
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Check booking status
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Link */}
      <div className="container mx-auto px-4 pb-12">
        <div className="pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">
            By booking this trip, you agree to our
          </p>
          <Link
            href="/trip-terms-and-conditions"
            className="text-primary hover:text-primary/80 transition-colors font-medium text-sm"
          >
            Trip Terms and Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
