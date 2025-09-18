import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BookingConfirmationPage from "@/components/booking/BookingConfirmationPage";

interface PageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { bookingId } = await params;
  return (
    <ProtectedRoute>
      <BookingConfirmationPage bookingId={bookingId} />
    </ProtectedRoute>
  );
}
