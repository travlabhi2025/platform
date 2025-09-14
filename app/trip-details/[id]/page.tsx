import TripDetailsPage from "@/components/trip-details/TripDetailsPage";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const tripId = params.id;
  console.log("Trip Details Page - Received tripId:", tripId);
  return <TripDetailsPage tripId={tripId} />;
}
