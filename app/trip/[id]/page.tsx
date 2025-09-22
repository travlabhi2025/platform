import TripMarketingPage from "@/components/trip-details/TripMarketingPage";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id: tripId } = await params;
  console.log("Trip Marketing Page - Received tripId:", tripId);
  return <TripMarketingPage tripId={tripId} />;
}
