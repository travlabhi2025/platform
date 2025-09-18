import TripDetailsPage from "@/components/trip-details/TripDetailsPage";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id: tripId } = await params;
  console.log("Trip Details Page - Received tripId:", tripId);
  return <TripDetailsPage tripId={tripId} />;
}
