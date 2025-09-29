import BookingStatusPage from "@/components/booking/BookingStatusPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <BookingStatusPage />
    </ProtectedRoute>
  );
}
