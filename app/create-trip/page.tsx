import CreateTripPage from "@/components/create-trip/CreateTripPage";
import OrganizerProtectedRoute from "@/components/auth/OrganizerProtectedRoute";

export default function Page() {
  return (
    <OrganizerProtectedRoute>
      <CreateTripPage />
    </OrganizerProtectedRoute>
  );
}
