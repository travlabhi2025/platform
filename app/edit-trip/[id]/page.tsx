import EditTripPage from "@/components/edit-trip/EditTripPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id: tripId } = await params;
  console.log("Edit Trip Page - Received tripId:", tripId);

  return (
    <ProtectedRoute>
      <EditTripPage tripId={tripId} />
    </ProtectedRoute>
  );
}
