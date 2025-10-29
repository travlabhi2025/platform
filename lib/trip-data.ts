import { tripService } from "./firestore";

export interface TripData {
  id: string;
  title: string;
  heroImageUrl: string;
  galleryImages?: string[];
  priceInInr: number;
  currency: string;
  perPerson: boolean;
  about: {
    tripName: string;
    location: string;
    startDate: string;
    endDate: string;
    groupSizeMin: number;
    groupSizeMax: number;
    ageMin: number;
    ageMax: number;
    tripTypes: string[];
  };
  host: {
    name: string;
    description: string;
    organizerImage: string;
    rating: number;
    reviewCount: number;
  };
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  inclusions: string[];
  exclusions: string[];
  reviewsSummary: {
    average: number;
    totalCount: number;
  };
  reviews: Array<{
    author: string;
    dateIso: string;
    rating: number;
    content: string;
    likes?: number;
    comments?: number;
    avatarUrl?: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  relatedTrips: Array<{
    title: string;
    country: string;
    imageUrl: string;
  }>;
  status: string;
  location: string;
  createdBy: string;
  createdAt: string;
}

/**
 * Server-side function to fetch trip data for ISR
 * This function is used during build time and revalidation
 */
export async function getTripData(tripId: string): Promise<TripData | null> {
  try {
    const trip = await tripService.getTripById(tripId);

    if (!trip) {
      return null;
    }

    // Transform the trip data to ensure consistent structure
    return {
      id: trip.id || tripId,
      title: trip.title || "Untitled Trip",
      heroImageUrl: trip.heroImageUrl || "/images/placeholder-trip.jpg",
      galleryImages: trip.galleryImages || [],
      priceInInr: trip.priceInInr || 0,
      currency: trip.currency || "INR",
      perPerson: trip.perPerson || true,
      about: {
        tripName: trip.about?.tripName || trip.title,
        location: trip.about?.location || "Unknown Location",
        startDate: trip.about?.startDate || new Date().toISOString(),
        endDate: trip.about?.endDate || new Date().toISOString(),
        groupSizeMin: trip.about?.groupSizeMin || 1,
        groupSizeMax: trip.about?.groupSizeMax || 10,
        ageMin: trip.about?.ageMin || 18,
        ageMax: trip.about?.ageMax || 65,
        tripTypes:
          (trip.about as unknown as { tripTypes?: string[]; tripType?: string })
            .tripTypes ||
          ((trip.about as unknown as { tripTypes?: string[]; tripType?: string })
            .tripType
            ? [
                (trip.about as unknown as {
                  tripTypes?: string[];
                  tripType?: string;
                }).tripType as string,
              ]
            : ["Adventure"]),
      },
      host: {
        name: trip.host?.name || "Unknown Host",
        description: trip.host?.description || "",
        organizerImage:
          trip.host?.organizerImage || "/images/placeholder-host.jpg",
        rating: trip.host?.rating || 4.5,
        reviewCount: trip.host?.reviewsCount || 0,
      },
      itinerary: trip.itinerary || [],
      inclusions: trip.inclusions || [],
      exclusions: trip.exclusions || [],
      reviewsSummary: {
        average: trip.reviewsSummary?.average || 4.5,
        totalCount: trip.reviewsSummary?.totalCount || 0,
      },
      reviews: trip.reviews || [],
      faqs: trip.faqs || [],
      relatedTrips: trip.relatedTrips || [],
      status: trip.status || "Active",
      location: trip.about?.location || "Unknown Location",
      createdBy: trip.createdBy || "",
      createdAt: trip.createdAt
        ? trip.createdAt.toDate().toISOString()
        : new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching trip data for ISR:", error);
    return null;
  }
}

/**
 * Get all trip IDs for generateStaticParams
 * This function fetches all trips to pre-generate static pages
 */
export async function getAllTripIds(): Promise<string[]> {
  try {
    const trips = await tripService.getAllTrips();
    return trips.map((trip) => trip.id || "").filter(Boolean);
  } catch (error) {
    console.error("Error fetching trip IDs for static generation:", error);
    return [];
  }
}

/**
 * Generate SEO metadata for a trip
 */
export function generateTripMetadata(trip: TripData) {
  const title = `${trip.title} | TravlAbhi - Adventure Travel`;
  const description = `Discover the amazing ${
    trip.about.tripName
  } experience in ${
    trip.about.location
  }. This ${trip.about.tripTypes
    .map((t) => t.toLowerCase())
    .join(", ")} trip offers an unforgettable adventure for travelers aged ${
    trip.about.ageMin
  }-${trip.about.ageMax} years. Book now for the best travel experience.`;
  const imageUrl = trip.heroImageUrl || "/images/logo.png";
  const url = `https://travlabhi.com/trip/${trip.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "TravlAbhi",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: trip.title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
    keywords: [
      trip.title,
      trip.about.location,
      ...trip.about.tripTypes,
      "travel",
      "adventure",
      "trip",
      "vacation",
      "tourism",
      "TravlAbhi",
    ]
      .filter(Boolean)
      .join(", "),
  };
}
