import { TripData } from "./trip-data";

/**
 * Generate JSON-LD structured data for trip pages
 * This helps search engines understand the content better
 */
export function generateTripStructuredData(trip: TripData) {
  const baseUrl = "https://travlabhi.com";
  const tripUrl = `${baseUrl}/trip/${trip.id}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": tripUrl,
    name: trip.title,
    description: `Discover the amazing ${trip.about.tripName} experience in ${
      trip.about.location
    }. This ${trip.about.tripTypes
      .map((t) => t.toLowerCase())
      .join(", ")} trip offers an unforgettable adventure for travelers aged ${
      trip.about.ageMin
    }-${trip.about.ageMax} years.`,
    url: tripUrl,
    image: [
      trip.heroImageUrl,
      ...(trip.galleryImages || []).slice(0, 5), // Limit to 5 images
    ],
    offers: {
      "@type": "Offer",
      price: trip.priceInInr,
      priceCurrency: trip.currency || "INR",
      availability:
        trip.status === "Active"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      validFrom: new Date().toISOString(),
      url: tripUrl,
    },
    provider: {
      "@type": "Organization",
      name: "TravlAbhi",
      url: baseUrl,
      logo: `${baseUrl}/images/logo.png`,
    },
    organizer: {
      "@type": "Person",
      name: trip.host.name,
      image: trip.host.organizerImage,
      description: trip.host.description,
    },
    duration: `From ${trip.about.startDate} to ${trip.about.endDate}`,
    touristType: trip.about.tripTypes && trip.about.tripTypes.length > 0 ? trip.about.tripTypes : undefined,
    location: {
      "@type": "Place",
      name: trip.about.location,
    },
    datePublished: trip.createdAt,
    dateModified: new Date().toISOString(),
    aggregateRating:
      trip.reviewsSummary.totalCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: trip.reviewsSummary.average,
            reviewCount: trip.reviewsSummary.totalCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    review:
      trip.reviews && trip.reviews.length > 0
        ? trip.reviews.slice(0, 5).map((review) => ({
            "@type": "Review",
            author: {
              "@type": "Person",
              name: review.author,
            },
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
              bestRating: 5,
              worstRating: 1,
            },
            reviewBody: review.content,
            datePublished: review.dateIso,
          }))
        : undefined,
    includesObject:
      trip.inclusions && trip.inclusions.length > 0
        ? {
            "@type": "ItemList",
            itemListElement: trip.inclusions.map((inclusion, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: inclusion,
            })),
          }
        : undefined,
    excludesObject:
      trip.exclusions && trip.exclusions.length > 0
        ? {
            "@type": "ItemList",
            itemListElement: trip.exclusions.map((exclusion, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: exclusion,
            })),
          }
        : undefined,
    itinerary:
      trip.itinerary && trip.itinerary.length > 0
        ? trip.itinerary.map((day) => ({
            "@type": "TouristTrip",
            name: day.title,
            description: day.description,
            position: day.day,
          }))
        : undefined,
  };

  // Remove undefined properties
  return JSON.stringify(structuredData, (key, value) =>
    value === undefined ? undefined : value
  );
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(trip: TripData) {
  const baseUrl = "https://travlabhi.com";
  const tripUrl = `${baseUrl}/trip/${trip.id}`;

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Trips",
        item: `${baseUrl}/trips`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: trip.title,
        item: tripUrl,
      },
    ],
  };

  return JSON.stringify(breadcrumbData);
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(trip: TripData) {
  if (!trip.faqs || trip.faqs.length === 0) {
    return null;
  }

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: trip.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return JSON.stringify(faqData);
}
