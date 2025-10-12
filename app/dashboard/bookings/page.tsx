import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BookingManagementPage from "@/components/dashboard/BookingManagementPage";

export const dynamic = "force-dynamic";

export default function DashboardBookingsPage() {
  return (
    <ProtectedRoute>
      <BookingManagementPage />
    </ProtectedRoute>
  );
}
