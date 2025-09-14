import TripDetailsPage from "@/components/trip-details/TripDetailsPage";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { id?: string };
}

export default function Page({ searchParams }: PageProps) {
  // Get trip ID from URL params, fallback to default
  const tripId = searchParams.id || "everest-base-camp";
  return <TripDetailsPage tripId={tripId} />;
}
