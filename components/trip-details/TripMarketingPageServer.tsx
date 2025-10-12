import Image from "next/image";
import { Check, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TripGallery from "./TripGallery";
import Link from "next/link";
import { TripData } from "@/lib/trip-data";
import {
  generateTripStructuredData,
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
} from "@/lib/structured-data";

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

interface TripMarketingPageServerProps {
  trip: TripData;
}

export default function TripMarketingPageServer({
  trip,
}: TripMarketingPageServerProps) {
  // Format price display
  const formatPrice = (price: number, currency: string = "INR") => {
    if (currency === "INR") {
      return `₹${price.toLocaleString("en-IN")}`;
    }
    return `${currency} ${price.toLocaleString()}`;
  };

  // Generate structured data for SEO
  const tripStructuredData = generateTripStructuredData(trip);
  const breadcrumbStructuredData = generateBreadcrumbStructuredData(trip);
  const faqStructuredData = generateFAQStructuredData(trip);

  // Format date
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

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: tripStructuredData }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbStructuredData }}
      />
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqStructuredData }}
        />
      )}

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={trip.heroImageUrl}
              alt={trip.title}
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
                <h1 className="text-4xl md:text-6xl font-garetheavy text-white mb-4 leading-tight">
                  {trip.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      {formatPrice(trip.priceInInr, trip.currency)}
                    </span>
                    {trip.perPerson && (
                      <span className="text-sm">per person</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StarsSolid rating={trip.reviewsSummary.average} />
                    <span className="text-sm">
                      {trip.reviewsSummary.average.toFixed(1)} (
                      {trip.reviewsSummary.totalCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{trip.about.tripType}</span>
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
                    Discover the amazing {trip.about.tripName} experience in{" "}
                    {trip.about.location}. This{" "}
                    {trip.about.tripType.toLowerCase()} trip offers an
                    unforgettable adventure for travelers aged{" "}
                    {trip.about.ageMin}-{trip.about.ageMax} years.
                  </p>

                  {/* Trip Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">
                        Location
                      </h4>
                      <p className="text-slate-700">{trip.about.location}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">
                        Trip Type
                      </h4>
                      <p className="text-slate-700">{trip.about.tripType}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">
                        Group Size
                      </h4>
                      <p className="text-slate-700">
                        {trip.about.groupSizeMin}-{trip.about.groupSizeMax}{" "}
                        people
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
                        {formatDate(trip.about.startDate)}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">
                        End Date
                      </h4>
                      <p className="text-slate-700">
                        {formatDate(trip.about.endDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Itinerary */}
              {trip.itinerary && trip.itinerary.length > 0 && (
                <section>
                  <h2 className="font-garetheavy text-slate-900 text-2xl mb-6">
                    Itinerary
                  </h2>
                  <div className="space-y-6">
                    {trip.itinerary.map((day, index) => (
                      <div
                        key={index}
                        className="border border-slate-200 rounded-lg p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                            {day.day}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 text-lg mb-2">
                              {day.title}
                            </h3>
                            <p className="text-slate-700 mb-3">
                              {day.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Inclusions & Exclusions */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-garetheavy text-slate-900 text-lg mb-3">
                    What&apos;s included
                  </h3>
                  <ul className="space-y-3">
                    {trip.inclusions && trip.inclusions.length > 0 ? (
                      trip.inclusions.map((inclusion, index) => (
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
                    {trip.exclusions && trip.exclusions.length > 0 ? (
                      trip.exclusions.map((exclusion, index) => (
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
              {trip.galleryImages && trip.galleryImages.length > 0 && (
                <TripGallery images={trip.galleryImages} title={trip.title} />
              )}

              {/* Reviews */}
              <section>
                <h2 className="font-garetheavy text-slate-900 text-xl mb-3">
                  Reviews
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-[320px,1fr] gap-8">
                  <div>
                    <div className="text-4xl font-garetheavy text-slate-900">
                      {trip.reviewsSummary.average.toFixed(1)}
                    </div>
                    <div className="mt-2">
                      <StarsAverage rating={trip.reviewsSummary.average} />
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {trip.reviewsSummary.totalCount} reviews
                    </div>
                  </div>
                  <div className="space-y-6">
                    {trip.reviews && trip.reviews.length > 0 ? (
                      trip.reviews.slice(0, 3).map((review, index) => (
                        <div
                          key={index}
                          className="border-b border-slate-200 pb-4"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm font-semibold">
                              {review.author.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-sm">
                                {review.author}
                              </div>
                              <div className="flex items-center gap-2">
                                <StarsSolid rating={review.rating} />
                                <span className="text-xs text-slate-500">
                                  {new Date(
                                    review.dateIso
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-slate-700 text-sm">
                            {review.content}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm">No reviews yet</p>
                    )}
                  </div>
                </div>
              </section>

              {/* FAQs */}
              {trip.faqs && trip.faqs.length > 0 && (
                <section>
                  <h2 className="font-garetheavy text-slate-900 text-xl mb-3">
                    Frequently Asked Questions
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {trip.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-700">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              )}
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-garetheavy text-slate-900 mb-2">
                      {formatPrice(trip.priceInInr, trip.currency)}
                    </div>
                    {trip.perPerson && (
                      <div className="text-sm text-slate-600">per person</div>
                    )}
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <StarsSolid rating={trip.reviewsSummary.average} />
                      <span className="text-sm text-slate-600">
                        {trip.reviewsSummary.average.toFixed(1)} (
                        {trip.reviewsSummary.totalCount} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Location:</span>
                      <span className="font-medium">{trip.about.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Trip Type:</span>
                      <span className="font-medium">{trip.about.tripType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Group Size:</span>
                      <span className="font-medium">
                        {trip.about.groupSizeMin}-{trip.about.groupSizeMax}{" "}
                        people
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Age Range:</span>
                      <span className="font-medium">
                        {trip.about.ageMin}-{trip.about.ageMax} years
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/book/${trip.id}`}
                    className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center block"
                  >
                    Book This Trip
                  </Link>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-slate-500">
                      Free cancellation up to 24 hours before trip
                    </p>
                  </div>
                </div>

                {/* Host Info */}
                <div className="bg-slate-50 rounded-lg p-6 mt-6">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Meet Your Host
                  </h3>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Image
                        src={trip.host.organizerImage}
                        alt={trip.host.name}
                        width={60}
                        height={60}
                        className="w-15 h-15 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">
                        {trip.host.name}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <StarsSolid rating={trip.host.rating} />
                        <span className="text-sm text-slate-600">
                          {trip.host.rating.toFixed(1)} ({trip.host.reviewCount}{" "}
                          reviews)
                        </span>
                      </div>
                      {trip.host.description && (
                        <p className="text-sm text-slate-700">
                          {trip.host.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Trips */}
        {trip.relatedTrips && trip.relatedTrips.length > 0 && (
          <section className="bg-slate-50 py-12">
            <div className="container mx-auto px-4">
              <h2 className="font-garetheavy text-slate-900 text-2xl mb-8">
                You might also like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trip.relatedTrips.map((relatedTrip, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={relatedTrip.imageUrl}
                        alt={relatedTrip.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                        {relatedTrip.title}
                      </h3>
                      <div className="text-primary font-semibold">
                        {relatedTrip.country}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
