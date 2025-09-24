"use client";

import Image from "next/image";
import SiteHeader from "@/components/common/SiteHeader";
import { EVEREST_BASE_CAMP_TRIP } from ".";
import { useTrip } from "@/lib/hooks";
import { useAuth } from "@/lib/auth-context";
import { Check, X, Edit } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TripGallery from "./TripGallery";

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
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 pb-28 lg:pb-8 max-w-7xl">
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
              {user && "createdBy" in data && data.createdBy === user.uid && (
                <Link
                  href={`/edit-trip/${data.id}`}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </Link>
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
                    {"startDate" in data.about &&
                    "endDate" in data.about &&
                    data.about.startDate &&
                    data.about.endDate
                      ? `${new Date(data.about.startDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )} - ${new Date(data.about.endDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}`
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
                <div>
                  <div className="text-xs text-slate-500">Status</div>
                  <div className="text-sm">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border " +
                        ("status" in data && data.status === "Active"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "status" in data && data.status === "Upcoming"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "status" in data && data.status === "Completed"
                          ? "bg-gray-100 text-gray-800 border-gray-200"
                          : "bg-red-100 text-red-800 border-red-200")
                      }
                    >
                      {"status" in data ? data.status || "Unknown" : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Host */}
            <section className="mt-10">
              <h2 className="font-garetheavy text-slate-900 text-xl mb-3">
                Your host
              </h2>
              <div className="flex items-start gap-4">
                {"organizerImage" in data.host && data.host.organizerImage ? (
                  <Image
                    src={data.host.organizerImage}
                    alt={data.host.name}
                    width={64}
                    height={64}
                    className="shrink-0 w-16 h-16 rounded-full object-cover"
                  />
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
              <Accordion type="multiple" className="w-full space-y-3">
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

            {/* Trip Gallery */}
            {"galleryImages" in data &&
              data.galleryImages &&
              data.galleryImages.length > 0 && (
                <TripGallery images={data.galleryImages} title={data.title} />
              )}

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
              {data.faqs && data.faqs.length > 0 ? (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-3"
                >
                  {data.faqs.map((f, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="rounded-md text-white border-0"
                    >
                      <AccordionTrigger className="px-4 py-3 bg-primary/90 hover:no-underline text-white [&>svg]:text-white data-[state=open]:rounded-b-none">
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

          <div className="order-1 lg:order-1 lg:basis-[320px] lg:w-[320px] lg:shrink-0 lg:self-stretch">
            <aside className="sticky top-24 h-full max-h-[calc(100vh-8rem)] flex flex-col">
              <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-5 h-fit">
                <div className="text-2xl font-garetheavy text-slate-900">
                  ₹{data.priceInInr.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-slate-500">Per person</div>

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
                  className="mt-4 block w-full text-center bg-primary text-white rounded-md py-2 font-bebas tracking-wide hover:bg-primary/90"
                >
                  Book now
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
