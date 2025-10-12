import { Metadata } from "next";
import {
  getTripData,
  getAllTripIds,
  generateTripMetadata,
} from "@/lib/trip-data";
import TripMarketingPageServer from "@/components/trip-details/TripMarketingPageServer";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Enable ISR with 20-minute revalidation
export const revalidate = 1200; // 20 minutes in seconds

// Generate static params for all trips at build time
export async function generateStaticParams() {
  try {
    const tripIds = await getAllTripIds();
    return tripIds.map((id) => ({
      id: id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { id: tripId } = await params;
    const trip = await getTripData(tripId);

    if (!trip) {
      return {
        title: "Trip Not Found | TravlAbhi",
        description: "The requested trip could not be found.",
      };
    }

    return generateTripMetadata(trip);
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Trip | TravlAbhi",
      description: "Discover amazing travel experiences with TravlAbhi.",
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { id: tripId } = await params;

  try {
    // Fetch trip data server-side for ISR
    const trip = await getTripData(tripId);

    if (!trip) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Trip Not Found
            </h1>
            <p className="text-gray-600">
              The trip you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
          </div>
        </div>
      );
    }

    return <TripMarketingPageServer trip={trip} />;
  } catch (error) {
    console.error("Error rendering trip page:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Trip
          </h1>
          <p className="text-gray-600">
            There was an error loading the trip details. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
