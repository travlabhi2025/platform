import EditTripPage from "@/components/edit-trip/EditTripPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const tripId = params.id;
  console.log("Edit Trip Page - Received tripId:", tripId);

  return (
    <ProtectedRoute>
      <EditTripPage tripId={tripId} />
    </ProtectedRoute>
  );
}
