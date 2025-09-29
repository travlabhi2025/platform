import EditTripPage from "@/components/edit-trip/EditTripPage";
import OrganizerProtectedRoute from "@/components/auth/OrganizerProtectedRoute";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id: tripId } = await params;
  console.log("Edit Trip Page - Received tripId:", tripId);

  return (
    <OrganizerProtectedRoute>
      <EditTripPage tripId={tripId} />
    </OrganizerProtectedRoute>
  );
}
