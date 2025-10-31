"use client";

import { useState } from "react";
import Image from "next/image";
import { EVEREST_BASE_CAMP_TRIP } from ".";
import { useTrip } from "@/lib/hooks";
import { Check, X, Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TripGallery from "./TripGallery";
import Link from "next/link";
import ShareButton from "./ShareButton";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";

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

interface TripMarketingPageProps {
  tripId: string;
}

export default function TripMarketingPage({ tripId }: TripMarketingPageProps) {
  const { trip, loading, error } = useTrip(tripId);
  // const [hostImageLoaded, setHostImageLoaded] = useState(false);
  const [relatedImagesLoaded, setRelatedImagesLoaded] = useState<
    Record<number, boolean>
  >({});

  // Debug logging
  console.log("TripMarketingPage - tripId:", tripId);
  console.log("TripMarketingPage - trip data:", trip);
  console.log("TripMarketingPage - loading:", loading);
  console.log("TripMarketingPage - error:", error);

  // Use mock data if trip is not loaded yet or there's an error
  const data = trip || EVEREST_BASE_CAMP_TRIP;
  type AboutMaybeMulti = { tripTypes?: string[]; tripType?: string };
  const aboutMulti = (data.about as unknown as AboutMaybeMulti) || {};
  const tripTypes: string[] =
    aboutMulti.tripTypes || (aboutMulti.tripType ? [aboutMulti.tripType] : []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
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
      {/* Hero Section - preserve original image dimensions */}
      <section className="relative overflow-hidden">
        <div className="relative w-full">
          <img
            src={data.heroImageUrl}
            alt={data.title}
            className="w-full h-auto block"
          />
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />

          {/* Top-left: App logo */}
          <div className="absolute top-3 left-3">
            <img
              src="/images/logo.png"
              alt="TravlAbhi"
              className="h-auto  w-24 drop-shadow-lg"
            />
          </div>

          {/* Top-right: Host avatar */}
          {"organizerImage" in (data.host as Record<string, unknown>) &&
            (data.host as { organizerImage?: string }).organizerImage && (
              <div className="absolute top-3 right-3">
                <img
                  src={
                    (data.host as { organizerImage?: string })
                      .organizerImage as string
                  }
                  alt={data.host.name}
                  className="h-10 w-10 rounded-full object-cover border border-white/70 shadow-md"
                />
              </div>
            )}
        </div>

        <div className="relative z-10 -mt-24 md:-mt-32 lg:-mt-40 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-garetheavy text-white mb-4 leading-tight">
                {data.title}
              </h1>
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
                <div className="flex items-center gap-2 flex-wrap">
                  {tripTypes.map((t) => (
                    <span
                      key={t}
                      className="text-sm inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 border border-white/30"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {/* Share button */}
                <ShareButton title={data.title} url="" />
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
                  {tripTypes.map((t) => t.toLowerCase()).join(", ")} trip offers
                  an unforgettable adventure for travelers aged{" "}
                  {data.about.ageMin}-{data.about.ageMax} years.
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
                      Trip Types
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tripTypes.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
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
                      {it.description ? (
                        <MarkdownRenderer content={it.description} />
                      ) : (
                        <p className="text-slate-500 italic">Details coming soon.</p>
                      )}
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

                <Link
                  href={`/book/${data.id}`}
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-primary/90 transition-colors block"
                >
                  Book this trip
                </Link>

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
    </div>
  );
}
